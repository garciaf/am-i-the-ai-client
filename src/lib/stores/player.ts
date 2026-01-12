import { persisted } from 'svelte-persisted-store';

export interface Player {
	id?: string;
	name: string;
	lobbyId?: string;
}

export const playerStore = persisted<Player | null>('player', null);
