<script lang="ts">
  import socket from '$lib/socket';
  import { connection } from '$lib/socket';

  let name = '';
  let lobbyId = readLobbyIdFromUrl() ?? '';

  function readLobbyIdFromUrl(): string {
    if (typeof window === 'undefined') return '';
    const href = window.location.href; // Use pathname to get the path part of the URL
    const queryIndex = href.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = href.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      return params.get('lobbyId') ?? '';
    }
    return '';
  }

  function joinLobby(event: Event) {
    event.preventDefault();
    socket?.joinLobby(lobbyId.trim(), name.trim());
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
					onclick={joinLobby}
					disabled={!name || !lobbyId || $connection.state === 'joining' || $connection.state === 'joined'}
					class="w-full mt-4 bg-lab-cyan text-white p-3 font-bold hover:bg-lab-cyan-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg"
				>
					[JOIN GAME]
				</button>
			</div>

			{#if $connection.state === 'joining'}
				<p class="text-lab-cyan text-center">&gt; JOINING LOBBY {lobbyId}...</p>
			{:else if $connection.state === 'joined'}
				<p class="text-lab-green text-center">&gt; CONNECTED. WAITING FOR THE HOST SCREEN...</p>
			{:else if $connection.state === 'error' || $connection.state === 'disconnected'}
				<p class="text-lab-red text-center">&gt; {$connection.message}</p>
			{/if}
		</div>
	</div>

	<div class="mt-8 text-center text-lab-ink-soft text-sm">
		<p>&gt; GAMEPLAY: ANSWER QUESTIONS | VOTE ON RESPONSES | IDENTIFY THE AI</p>
	</div>
</div>