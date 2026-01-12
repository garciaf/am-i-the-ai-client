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
	<div class="border-2 border-green-400 p-8 bg-slate-800">
		<div class="mb-6 flex justify-between items-center">
			<div class="text-green-300">&gt; PHASE: ANSWERING</div>
		</div>

		<div class="border-2 border-green-400 p-6 mb-6 bg-slate-900">
			<div class="text-green-300 text-sm mb-2">&gt; QUESTION:</div>
			<div class="text-xl text-green-400">{currentQuestion}</div>
		</div>

		<div class="mb-6">
			<label class="block text-green-300 mb-2" for="answer">
				&gt; YOUR ANSWER:
			</label>
			<textarea
				bind:this={textareaElement}
				id="answer"
				bind:value={answer}
				placeholder="Type your answer here..."
				rows="6"
				class="w-full bg-slate-900 border-2 border-green-400 text-green-400 p-4 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
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
			class="w-full bg-green-400 text-slate-900 p-4 font-bold text-xl hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			[SUBMIT ANSWER]
		</button>

		<div class="mt-4 text-green-300 text-sm text-center">
			&gt; ANSWER WILL AUTO-SUBMIT WHEN TIME EXPIRES
		</div>
	</div>
</div>
