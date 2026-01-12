<script lang="ts">
	import '../app.css';
	import liveNavigation from '$lib/liveNavigation';
</script>

<div class="min-h-screen bg-slate-900 text-green-400 font-mono">
	<div class="container mx-auto px-4 py-8">
		<header class="mb-8 border-2 border-green-400 p-4">
			<h1 class="text-3xl font-bold text-center tracking-wider">
				&gt; AM_I_THE_AI.EXE
			</h1>
			<div class="text-center text-sm mt-2 text-green-300">
				[SYSTEM ONLINE] | [STATUS: OPERATIONAL]
			</div>
		</header>

		<slot />
	</div>
</div>
