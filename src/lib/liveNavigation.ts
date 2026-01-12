import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import socket from '$lib/socket';
import { playerStore } from '$lib/stores/player';
import { gameStore } from '$lib/stores/game';

class LiveNavigation {
	constructor() {
		this.onRefresh();

		socket?.on('change-screen', (data) => {
			if (data.screen === 'waiting-room') {
				goto('/waiting-room');
			} else if (data.screen === 'loading') {
				const { message } = data;
				gameStore.update(state => ({ ...state, loadingMessage: message || '' }));
				goto('/loading');
			} else if (data.screen === 'question') {
				const { text, id, category } = data;
				gameStore.update(state => ({ ...state, currentQuestion: text || null }));
				goto('/question');
			} else if (data.screen === 'voting') {
				const { answers, count } = data;
				console.log('Received answers for voting:', data);
				gameStore.update(state => ({ ...state, answers: answers || [], aiAnswerCount: count || 2 }));
				goto('/voting');
			} else if (data.screen === 'results') {
				goto('/results');
			}
		});

		socket?.on('update-players-list', (data) => {
			gameStore.update(state => ({
				...state,
				players: data.players || []
			}));
		});

		socket?.on('update-player', (data) => {
			console.log('Updating player data:', data);
			const { id, lobbyId, name } = data;
			playerStore.update(state => state ? {
				...state,
				id: id || state.id,
				lobbyId: lobbyId || state.lobbyId,
				name: name || state.name
			} : null);
		});

		socket?.on('game-started', () => {
			gameStore.update(state => ({ ...state, phase: 'question' }));
			goto('/question');
		});
	}

	onRefresh() {
		if (!browser) return;

		const navEntries = performance.getEntriesByType('navigation');
		// @ts-ignore
		const navType = navEntries[0]?.type || performance.navigation?.type;

		if (navType === 'reload') {
			socket?.emit('player-reconnected', { message: 'Page was refreshed' });
		}

		if (sessionStorage.getItem('refreshing') === 'true') {
			sessionStorage.removeItem('refreshing');
		}

		window.addEventListener('beforeunload', () => {
			sessionStorage.setItem('refreshing', 'true');
		});
	}
}

let liveNavigation = null;

if (browser) {
	liveNavigation = new LiveNavigation();
}

export default liveNavigation;
