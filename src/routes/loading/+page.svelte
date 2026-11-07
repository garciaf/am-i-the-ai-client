<script lang="ts">
	import { gameStore } from '$lib/stores/game';
</script>

<div class="max-w-2xl mx-auto">
	<div class="border-2 border-lab-steel p-8 bg-lab-panel rounded-lg">
		<div class="flex flex-col items-center justify-center space-y-6">
			<div class="text-center">
				<div class="text-lab-ink text-2xl mb-4 font-bold">
					&gt; PROCESSING...
				</div>

				<div class="flex justify-center space-x-1 mb-6">
					<div class="w-3 h-3 bg-lab-cyan animate-pulse"></div>
					<div class="w-3 h-3 bg-lab-cyan animate-pulse delay-75"></div>
					<div class="w-3 h-3 bg-lab-cyan animate-pulse delay-150"></div>
				</div>
			</div>

			{#if $gameStore.loadingMessage}
				<div class="border-2 border-lab-steel p-4 bg-lab-bg w-full rounded-lg">
					<p class="text-lab-ink-soft text-center whitespace-pre-line">
						{$gameStore.loadingMessage}
					</p>
				</div>
			{/if}

			<div class="text-lab-ink-soft text-sm text-center">
				&gt; PLEASE WAIT...
			</div>
		</div>
	</div>
</div>

<style>
	.delay-75 {
		animation-delay: 75ms;
	}
	.delay-150 {
		animation-delay: 150ms;
	}
</style>
