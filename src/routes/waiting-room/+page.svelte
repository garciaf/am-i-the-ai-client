<script lang="ts">
	import socket from '$lib/socket';
	import { playerStore } from '$lib/stores/player';
	import { gameStore } from '$lib/stores/game';

	function startGame() {
		if (socket) {
			socket.emit('ready');
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="border-2 border-green-400 p-8 bg-slate-800">
		<div class="mb-6">
			<div class="text-green-300 text-sm mb-2">&gt; LOBBY CODE:</div>
			<div class="text-4xl font-bold text-green-400 tracking-widest">{$playerStore?.lobbyId}</div>
		</div>

		<div class="border-t-2 border-green-400 pt-6 mb-6">
			<div class="text-green-300 text-sm mb-4">&gt; CONNECTED PLAYERS:</div>
			<div class="space-y-2">
				{#if $gameStore.players.length > 0}
					{#each $gameStore.players as player}
						<div class="bg-slate-900 border border-green-400 p-3">
							&gt; {player.name}
							{#if player.id === $playerStore?.id}
								<span class="text-green-300">(YOU)</span>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="bg-slate-900 border border-green-400 p-3">
						&gt; {$playerStore?.name || 'You'}
					</div>
				{/if}
			</div>
		</div>

		<div class="border-t-2 border-green-400 pt-6">
			<button
				onclick={startGame}
				class="w-full bg-green-400 text-slate-900 p-4 font-bold text-xl hover:bg-green-300 transition-colors"
			>
				[START GAME]
			</button>
		</div>

		<div class="mt-6 text-green-300 text-sm">
			<p>&gt; WAITING FOR PLAYERS TO JOIN...</p>
			<p>&gt; SHARE THE LOBBY CODE ABOVE</p>
		</div>
	</div>
</div>
