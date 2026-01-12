import { writable } from 'svelte/store';


export interface Answer {
	id: string;
	text: string;
}

export interface GamePlayer {
	id: string;
	name: string;
	color?: string;
}

export interface GameState {
	currentQuestion: string | null;
	answers: Answer[];
	lobbyId: string;
	players: GamePlayer[];
	aiAnswerCount?: number;
	loadingMessage?: string;
}


export const gameStore = writable<GameState>({
	currentQuestion: null,
	answers: [],
	lobbyId: '',
	players: [],
	aiAnswerCount: 2,
});
