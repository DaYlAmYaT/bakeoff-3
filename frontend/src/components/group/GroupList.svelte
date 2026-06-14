<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { apiClient } from '../../utils/apiClient.js';
  import { groupStore } from '../../stores/groupStore.js';
  import CreateGroupModal from './CreateGroupModal.svelte';

  let groups = [];
  let loading = true;
  let error = null;

  let showCreateModal = false;
  let joinToken = '';
  let joining = false;

  async function fetchGroups() {
    try {
      loading = true;
      error = null;
      groups = await apiClient.get('/groups');
    } catch (err) {
      error = err.message || 'Failed to load groups.';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchGroups();
  });

  async function handleJoinGroup() {
    if (!joinToken.trim()) return;
    try {
      joining = true;
      error = null;
      const newGroup = await groupStore.joinGroup(joinToken);
      navigate(`/groups/${newGroup._id}`);
    } catch (err) {
      error = err.message || 'Failed to join group.';
      joining = false;
    }
  }

  function handleModalClose() {
    showCreateModal = false;
    // Refresh the group list to see the newly created group!
    fetchGroups();
  }
</script>

<div class="group-list-container">
  <div class="header">
    <h2>Your Fantasy Leagues</h2>
    <button class="btn-primary" on:click={() => showCreateModal = true}>+ Create Group</button>
  </div>

  <div class="join-section">
    <input type="text" bind:value={joinToken} placeholder="Enter Invite Token" />
    <button class="btn-secondary" on:click={handleJoinGroup} disabled={joining || !joinToken.trim()}>
      {joining ? 'Joining...' : 'Join Group'}
    </button>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if loading}
    <div class="loading">Loading your groups...</div>
  {:else if groups && groups.length === 0}
    <div class="empty-state">
      <p>You aren't in any groups yet. Create one or join using an invite token!</p>
    </div>
  {:else}
    <div class="grid">
      {#each groups as group}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="group-card" on:click={() => navigate(`/groups/${group._id}`)}>
          <h3>{group.name}</h3>
          <p class="desc">{group.description || 'No description provided.'}</p>
          <div class="footer">
            <span class="status {group.status}">{group.status}</span>
            <span class="members">{group.members.length} member(s)</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if showCreateModal}
    <CreateGroupModal on:close={handleModalClose} />
  {/if}
</div>

<style>
  .group-list-container {
    max-width: 800px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  h2 {
    color: #1f2937;
    margin: 0;
  }
  .join-section {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  .join-section input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }
  .join-section input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-size: 1rem;
    transition: background-color 0.2s;
  }
  .btn-primary { background: #2563eb; color: white; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-secondary { background: #10b981; color: white; }
  .btn-secondary:hover:not(:disabled) { background: #059669; }
  button:disabled { opacity: 0.7; cursor: not-allowed; }
  
  .error { background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; }
  .loading { text-align: center; color: #6b7280; padding: 2rem; }
  
  .empty-state { text-align: center; padding: 3rem; background: #f3f4f6; border-radius: 8px; color: #4b5563; }
  
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .group-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
  .group-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-color: #d1d5db; }
  .group-card h3 { margin: 0 0 0.5rem 0; color: #111827; }
  .desc { color: #4b5563; font-size: 0.875rem; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .footer { display: flex; justify-content: space-between; font-size: 0.875rem; color: #6b7280; }
  .status { text-transform: capitalize; font-weight: 600; }
  .status.active { color: #10b981; }
  .status.ended { color: #ef4444; }
  .status.archived { color: #9ca3af; }
</style>