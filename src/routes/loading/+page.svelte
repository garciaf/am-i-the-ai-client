<script lang="ts">
	import { gameStore } from '$lib/stores/game';
</script>

<div class="max-w-2xl mx-auto">
	<div class="border-2 border-green-400 p-8 bg-slate-800">
		<div class="flex flex-col items-center justify-center space-y-6">
			<div class="text-center">
				<div class="text-green-400 text-2xl mb-4 font-bold">
					&gt; PROCESSING...
				</div>

				<div class="flex justify-center space-x-1 mb-6">
					<div class="w-3 h-3 bg-green-400 animate-pulse"></div>
					<div class="w-3 h-3 bg-green-400 animate-pulse delay-75"></div>
					<div class="w-3 h-3 bg-green-400 animate-pulse delay-150"></div>
				</div>
			</div>

			{#if $gameStore.loadingMessage}
				<div class="border-2 border-green-400 p-4 bg-slate-900 w-full">
					<p class="text-green-300 text-center whitespace-pre-line">
						{$gameStore.loadingMessage}
					</p>
				</div>
			{/if}

			<div class="text-green-300 text-sm text-center">
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
