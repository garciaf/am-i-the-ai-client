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
	<div class="border-2 border-lab-steel p-8 bg-lab-panel rounded-lg">
		<div class="mb-6">
			<div class="text-lab-ink-soft text-sm mb-2">&gt; LOBBY CODE:</div>
			<div class="text-4xl font-bold text-lab-ink tracking-widest">{$playerStore?.lobbyId}</div>
		</div>

		<div class="border-t-2 border-lab-steel pt-6 mb-6 rounded-lg">
			<div class="text-lab-ink-soft text-sm mb-4">&gt; CONNECTED PLAYERS:</div>
			<div class="space-y-2">
				{#if $gameStore.players.length > 0}
					{#each $gameStore.players as player}
						<div class="bg-lab-bg border border-lab-steel p-3 rounded-lg">
							&gt; {player.name}
							{#if player.id === $playerStore?.id}
								<span class="text-lab-ink-soft">(YOU)</span>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="bg-lab-bg border border-lab-steel p-3 rounded-lg">
						&gt; {$playerStore?.name || 'You'}
					</div>
				{/if}
			</div>
		</div>

		<div class="border-t-2 border-lab-steel pt-6 rounded-lg">
			<button
				onclick={startGame}
				class="w-full bg-lab-cyan text-white p-4 font-bold text-xl hover:bg-lab-cyan-dark transition-colors rounded-lg"
			>
				[START GAME]
			</button>
		</div>

		<div class="mt-6 text-lab-ink-soft text-sm">
			<p>&gt; WAITING FOR PLAYERS TO JOIN...</p>
			<p>&gt; SHARE THE LOBBY CODE ABOVE</p>
		</div>
	</div>
</div>
