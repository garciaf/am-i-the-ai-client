<script lang="ts">
  import socket from '$lib/socket'; // ✅ use SvelteKit alias
  import { playerStore } from '$lib/stores/player';

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

  socket?.on('joined-lobby', (data) => {
    const { lobbyId, clientId } = data;
    playerStore.update(state => ({...state, lobbyId, id: clientId, name}));

    if (socket) {
      socket.emit('new-player', {
        name: name,
      });
    }
  });
  // ✅ This will only be called on client (safe)
  function joinLobby(event: Event) {
    event.preventDefault();
    playerStore.update(state => ({...state, lobbyId, name}));

    if (socket) {
      // Tell socket we're joining a new lobby (enables reconnection to it)
      socket.joinLobby(lobbyId);

      socket.emit('join-lobby', {
        lobbyId: lobbyId,
        name: name,
      });
    }
  }
</script>

<div class="max-w-2xl mx-auto">
	<div class="border-2 border-green-400 p-8 bg-slate-800">
		<div class="mb-6">
			<p class="text-green-300 mb-4">
				&gt; INITIALIZING GAME PROTOCOL...<br/>
				&gt; QUESTION.ANSWER.VOTE SEQUENCE READY<br/>
				&gt; AWAITING USER INPUT...
			</p>
		</div>

		<div class="space-y-6">
			<div>
				<label class="block text-green-400 mb-2" for="name">
					&gt; ENTER USERNAME:
				</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					placeholder="PLAYER_001"
					class="w-full bg-slate-900 border-2 border-green-400 text-green-400 p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
				/>
			</div>

			<div class="border-t-2 border-green-400 pt-6">
				<div>
					<label class="block text-green-400 mb-2" for="lobbyId">
						&gt; ENTER LOBBY CODE:
					</label>
					<input
						id="lobbyId"
						type="text"
						bind:value={lobbyId}
						placeholder="ABC123"
						class="w-full bg-slate-900 border-2 border-green-400 text-green-400 p-3 uppercase focus:outline-none focus:ring-2 focus:ring-green-300"
					/>
				</div>

				<button
					onclick={joinLobby}
					disabled={!name || !lobbyId}
					class="w-full mt-4 bg-green-400 text-slate-900 p-3 font-bold hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					[JOIN GAME]
				</button>
			</div>
		</div>
	</div>

	<div class="mt-8 text-center text-green-300 text-sm">
		<p>&gt; GAMEPLAY: ANSWER QUESTIONS | VOTE ON RESPONSES | IDENTIFY THE AI</p>
	</div>
</div>