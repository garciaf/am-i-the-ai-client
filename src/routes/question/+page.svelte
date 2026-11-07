<script lang="ts">
	import socket from '$lib/socket';
	import { gameStore } from '$lib/stores/game';
	import { onMount } from 'svelte';

	let answer = '';
	let textareaElement: HTMLTextAreaElement;

	// Store the question separately to avoid reactive updates
	let currentQuestion = '';

	$: if ($gameStore.currentQuestion) {
		currentQuestion = $gameStore.currentQuestion;
	}

	onMount(() => {
		// Auto-focus the textarea when component loads
		if (textareaElement) {
			textareaElement.focus();
		}
	});

	function submitAnswer() {
		if (answer.trim()) {
			if (socket) {
				socket.emit('submit-answer', {
					answer: answer.trim(),
				});
			}
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="border-2 border-lab-steel p-8 bg-lab-panel rounded-lg">
		<div class="mb-6 flex justify-between items-center">
			<div class="text-lab-ink-soft">&gt; PHASE: ANSWERING</div>
		</div>

		<div class="border-2 border-lab-steel p-6 mb-6 bg-lab-bg rounded-lg">
			<div class="text-lab-ink-soft text-sm mb-2">&gt; QUESTION:</div>
			<div class="text-xl text-lab-ink">{currentQuestion}</div>
		</div>

		<div class="mb-6">
			<label class="block text-lab-ink-soft mb-2" for="answer">
				&gt; YOUR ANSWER:
			</label>
			<textarea
				bind:this={textareaElement}
				id="answer"
				bind:value={answer}
				placeholder="Type your answer here..."
				rows="6"
				class="font-human text-2xl w-full bg-lab-bg border-2 border-lab-steel text-lab-ink p-4 focus:outline-none focus:ring-2 focus:ring-lab-cyan resize-none rounded-lg"
				data-gramm="false"
				data-gramm_editor="false"
				data-enable-grammarly="false"
				spellcheck="false"
				autofocus
			></textarea>
		</div>

		<button
			onclick={submitAnswer}
			disabled={!answer.trim()}
			class="w-full bg-lab-cyan text-white p-4 font-bold text-xl hover:bg-lab-cyan-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
		>
			[SUBMIT ANSWER]
		</button>

		<div class="mt-4 text-lab-ink-soft text-sm text-center">
			&gt; ANSWER WILL AUTO-SUBMIT WHEN TIME EXPIRES
		</div>
	</div>
</div>
