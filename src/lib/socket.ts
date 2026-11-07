import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { io, type Socket as IoSocket } from 'socket.io-client';
import { playerStore } from '$lib/stores/player';

// Lobby server (socket.io), e.g. http://127.0.0.1:5678 or https://game-lobby-server.fly.dev
const serverUrl = import.meta.env.VITE_WEBSOCKET_URL;

export type ConnectionState = 'connecting' | 'connected' | 'joining' | 'joined' | 'disconnected' | 'error';
export const connection = writable<{ state: ConnectionState; message?: string }>({ state: 'connecting' });

type Callback = (data: any) => void;

/**
 * Same protocol as the Godot game (and Who is the Smart Cookie):
 *   join-lobby { lobbyId, from } -> joined-lobby { clientId, lobbyId }
 *   then every message is { type: 'message', from, lobbyId, to, data }
 * Listeners registered with on() receive the message's `data`.
 */
class Socket {
	private socket: IoSocket;
	private listeners = new Map<string, Callback[]>();
	private pendingJoin: { lobbyId: string; name: string } | null = null;
	private rejoining = false;

	constructor() {
		this.socket = io(serverUrl, { transports: ['websocket', 'polling'] });

		this.socket.on('connect', () => this.onConnect());
		this.socket.on('disconnect', (reason) => {
			console.warn('[Socket] Disconnected:', reason);
			connection.set({ state: 'disconnected', message: 'Connection lost, reconnecting...' });
		});
		this.socket.on('connect_error', (error) => {
			console.error('[Socket] Connection error:', error.message);
			connection.set({ state: 'error', message: `Cannot reach the lobby server (${error.message})` });
		});

		this.socket.onAny((event: string, envelope: any) => {
			console.debug('[Socket] Received', event, envelope);
			const data = envelope && typeof envelope === 'object' && 'data' in envelope ? envelope.data : envelope;
			(this.listeners.get(event) || []).forEach((cb) => cb(data ?? {}));
		});

		this.on('joined-lobby', (data) => this.onJoinedLobby(data));
		this.on('lobby-not-found', () => {
			playerStore.update((state) => (state ? { ...state, lobbyId: '' } : state));
			connection.set({ state: 'error', message: 'This lobby does not exist anymore' });
		});
	}

	private onConnect(): void {
		console.log('[Socket] Connected to lobby server');
		connection.set({ state: 'connected' });

		if (this.pendingJoin) {
			const { lobbyId, name } = this.pendingJoin;
			this.pendingJoin = null;
			this.joinLobby(lobbyId, name);
			return;
		}

		// Page reload or network drop: rejoin the lobby we were in
		// (not on the home or join page: there the player is joining a new lobby)
		const path = window.location.pathname.replace(/\/$/, '');
		const onJoinPage = path === '' || path.endsWith('/lobby') || path === (import.meta.env.BASE_URL ?? '').replace(/\/$/, '');
		const player = get(playerStore);
		if (!onJoinPage && player?.lobbyId && player?.id) {
			this.rejoining = true;
			connection.set({ state: 'joining' });
			this.socket.emit('join-lobby', { lobbyId: player.lobbyId, from: player.id });
		}
	}

	private onJoinedLobby(data: any): void {
		const clientId = data.clientId ?? data.from;
		const player = get(playerStore);
		const lobbyId = data.lobbyId ?? player?.lobbyId ?? '';
		playerStore.update((state) => ({ ...(state ?? { name: '' }), id: clientId, lobbyId }));
		connection.set({ state: 'joined' });

		if (this.rejoining) {
			this.rejoining = false;
			this.emit('player-reconnected');
		} else {
			this.emit('new-player', { name: get(playerStore)?.name ?? '' });
		}
	}

	/** Join a lobby as a new player. The game answers by sending us to the waiting room. */
	public joinLobby(lobbyId: string, name: string): void {
		playerStore.set({ name, lobbyId });
		this.rejoining = false;
		if (!this.socket.connected) {
			this.pendingJoin = { lobbyId, name };
			return;
		}
		connection.set({ state: 'joining' });
		this.socket.emit('join-lobby', { lobbyId, from: null, name });
	}

	public leaveLobby(): void {
		this.pendingJoin = null;
		playerStore.update((state) => (state ? { ...state, lobbyId: '' } : state));
	}

	public on(eventName: string, callback: Callback): void {
		if (!this.listeners.has(eventName)) {
			this.listeners.set(eventName, []);
		}
		this.listeners.get(eventName)?.push(callback);
	}

	public emit(event: string, data: any = {}, to: string = ''): void {
		const player = get(playerStore);
		console.log(`[Socket] Emitting ${event}`, data);
		this.socket.emit(event, {
			type: 'message',
			from: player?.id ?? null,
			lobbyId: player?.lobbyId ?? null,
			to,
			data
		});
	}

	public disconnect(): void {
		this.socket.disconnect();
	}
}

// Instantiate only in the browser
let socket: Socket | null = null;

if (browser) {
	socket = new Socket();
}

export default socket;
