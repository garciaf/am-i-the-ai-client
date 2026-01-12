<script lang="ts">
	import { goto } from '$app/navigation';
	import { gameStore } from '$lib/stores/game';
	import type { Answer } from '$lib/stores/game';
	import socket from '$lib/socket';

	let selectedAnswers: Answer[] = [];
	let hasVoted = false;

	// Mock answers for demo
	const mockAnswers: Answer[] = [
		{ id: '1', text: 'I would invest it all in cryptocurrency and hope for the best!' },
		{ id: '2', text: 'Travel around the world for a year and experience different cultures.' },
		{ id: '3', text: 'Allocate 50% to index funds, 30% to real estate, and 20% to emergency fund for optimal financial security.' }
	];

	if ($gameStore.answers.length === 0) {
		gameStore.update(state => ({ ...state, answers: mockAnswers }));
	}

	function voteForAnswer(answer: Answer) {
		const isSelected = selectedAnswers.some(a => a.id === answer.id);
		const maxSelections = $gameStore.aiAnswerCount || 2;

		if (isSelected) {
			selectedAnswers = selectedAnswers.filter(a => a.id !== answer.id);
		} else if (selectedAnswers.length < maxSelections) {
			selectedAnswers = [...selectedAnswers, answer];
		}
	}

	function submitVote() {
		if (selectedAnswers.length > 0) {
			if (socket) {
				socket.emit('submit-vote', {
					ids: selectedAnswers.map(a => a.id),
				});
			}
			hasVoted = true;
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="border-2 border-green-400 p-8 bg-slate-800">
		<div class="mb-6">
			<div class="text-green-300">&gt; PHASE: VOTING</div>
			<div class="text-sm text-green-400 mt-2">QUESTION: {$gameStore.currentQuestion}</div>
		</div>

		<div class="mb-6">
			<div class="text-green-300 mb-4">&gt; SELECT THE ANSWER YOU THINK IS FROM AN AI:</div>

			<div class="space-y-4">
				{#each $gameStore.answers as answer}
					<button
						onclick={() => voteForAnswer(answer)}
						disabled={hasVoted}
						class="w-full text-left bg-slate-900 border-2 p-4 transition-all disabled:opacity-50"
						class:border-red-500={selectedAnswers.some(a => a.id === answer.id)}
						class:border-green-400={!selectedAnswers.some(a => a.id === answer.id)}
						class:hover:border-green-300={!selectedAnswers.some(a => a.id === answer.id)}
					>
						<div class="text-green-300 text-sm mb-2">&gt; RESPONSE #{$gameStore.answers.indexOf(answer) + 1}</div>
						<div class="text-green-400">{answer.text}</div>
					</button>
				{/each}
			</div>
		</div>

		<button
			onclick={submitVote}
			disabled={selectedAnswers.length == 0}
			class="w-full bg-green-400 text-slate-900 p-4 font-bold text-xl hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			[SUBMIT VOTE]
		</button>

		<div class="mt-4 text-green-300 text-sm text-center">
			&gt; CHOOSE CAREFULLY - YOU ONLY GET ONE VOTE
		</div>
	</div>
</div>
