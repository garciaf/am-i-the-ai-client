<script lang="ts">
	import { goto } from '$app/navigation';
	import { playerStore } from '$lib/stores/player';
	import { onMount } from 'svelte';
	import socket from '$lib/socket';
  	
	let name = '';
  	let lobbyId = '';

	// Clear any previous lobby when landing on home page
	onMount(() => {
		socket?.leaveLobby();
	});

	function joinGame() {
		if (name && lobbyId) {
			playerStore.set({ name: name, id: crypto.randomUUID() });
			goto(`/lobby?lobbyId=${lobbyId}`);
		}
	}

	function createGame() {
		if (name) {
			playerStore.set({ name: name, id: crypto.randomUUID() });
			const newLobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
			goto(`/lobby?lobbyId=${newLobbyId}`);
		}
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="border-2 border-lab-steel p-8 bg-lab-panel rounded-lg">
		<div class="mb-6">
			<p class="text-lab-ink-soft mb-4">
				&gt; INITIALIZING GAME PROTOCOL...<br/>
				&gt; QUESTION.ANSWER.VOTE SEQUENCE READY<br/>
				&gt; AWAITING USER INPUT...
			</p>
		</div>

		<div class="space-y-6">
			<div>
				<label class="block text-lab-ink mb-2" for="name">
					&gt; ENTER USERNAME:
				</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					placeholder="PLAYER_001"
					class="font-human w-full bg-lab-bg border-2 border-lab-steel text-lab-ink p-3 focus:outline-none focus:ring-2 focus:ring-lab-cyan rounded-lg"
				/>
			</div>

			<div class="border-t-2 border-lab-steel pt-6 rounded-lg">
				<div>
					<label class="block text-lab-ink mb-2" for="lobbyId">
						&gt; ENTER LOBBY CODE:
					</label>
					<input
						id="lobbyId"
						type="text"
						bind:value={lobbyId}
						placeholder="ABC123"
						class="w-full bg-lab-bg border-2 border-lab-steel text-lab-ink p-3 uppercase focus:outline-none focus:ring-2 focus:ring-lab-cyan rounded-lg"
					/>
				</div>

				<button
					onclick={joinGame}
					disabled={!name || !lobbyId}
					class="w-full mt-4 bg-lab-cyan text-white p-3 font-bold hover:bg-lab-cyan-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
				>
					[JOIN GAME]
				</button>
			</div>

			<div class="text-center text-lab-ink">- OR -</div>

			<button
				onclick={createGame}
				disabled={!name}
				class="w-full bg-lab-bg border-2 border-lab-steel text-lab-ink p-3 font-bold hover:bg-lab-cyan hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
			>
				[CREATE NEW GAME]
			</button>
		</div>
	</div>

	<div class="mt-8 text-center text-lab-ink-soft text-sm">
		<p>&gt; GAMEPLAY: ANSWER QUESTIONS | VOTE ON RESPONSES | IDENTIFY THE AI</p>
	</div>
</div>
