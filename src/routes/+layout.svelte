<script lang="ts">
	import '../app.css';
	import liveNavigation from '$lib/liveNavigation';
</script>

<div class="min-h-screen bg-lab-bg text-lab-ink font-machine">
	<div class="container mx-auto px-4 py-6">
		<header class="mb-6 border-2 border-lab-steel bg-lab-panel rounded-lg p-4">
			<h1 class="text-3xl text-center tracking-wider text-lab-cyan">
				&gt; AM_I_THE_AI.EXE
			</h1>
			<div class="text-center text-sm mt-1 text-lab-ink-soft">
				[LAB ONLINE] | [STATUS: STERILE]
			</div>
		</header>

		<slot />
	</div>
</div>
