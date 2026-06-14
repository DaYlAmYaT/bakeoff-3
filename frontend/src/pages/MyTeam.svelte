<script>
  import { navigate } from 'svelte-routing';
  import { groupStore } from '../stores/groupStore.js';
  import { teamStore } from '../stores/teamStore.js';
  import RosterGrid from '../components/team/RosterGrid.svelte';

  $: currentGroup = $groupStore.currentGroup;
  $: loading = $teamStore.loading;
  $: error = $teamStore.error;
  $: myTeams = $teamStore.myTeams;
  
  // Find the team that belongs to the current active group
  $: activeTeam = myTeams.find(t => t.groupId === currentGroup?._id);

  let teamName = "My Awesome Team";
  let creatingTeam = false;

  // Fetch the user's team whenever the active group changes
  $: if (currentGroup) {
    teamStore.fetchMyTeams(currentGroup._id);
  }

  async function handleCreateTeam() {
    if (!teamName.trim()) return;
    creatingTeam = true;
    try {
      await teamStore.saveTeam({
        groupId: currentGroup._id,
        teamName,
        roster: []
      });
      // Refresh to grab the newly created team object from the backend
      await teamStore.fetchMyTeams(currentGroup._id);
    } catch (err) {
      console.error(err);
    } finally {
      creatingTeam = false;
    }
  }
</script>

<div class="my-team-page">
  <div class="header">
    <h1>My Team</h1>
    {#if currentGroup}
      <p class="subtitle">Managing team for: <strong>{currentGroup.name}</strong></p>
    {/if}
  </div>

  {#if !currentGroup}
    <div class="empty-state">
      <h2>No Group Selected</h2>
      <p>You need to select a group from your leagues to manage your team.</p>
      <button class="btn-primary" on:click={() => navigate('/groups')}>Go to Groups</button>
    </div>
  {:else if loading && !activeTeam && !creatingTeam}
    <div class="loading">Loading your team...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if activeTeam}
    <div class="team-header">
      <h2>{activeTeam.teamName}</h2>
      <div class="team-stats">
        <span>Roster: {activeTeam.roster.length} / 8</span>
      </div>
    </div>
    
    <RosterGrid team={activeTeam} />
    
  {:else}
    <div class="empty-state">
      <h2>No Team Found</h2>
      <p>You haven't formed a team for this league yet.</p>
      <div class="create-team-form">
        <input type="text" bind:value={teamName} placeholder="Enter Team Name" />
        <button class="btn-primary" on:click={handleCreateTeam} disabled={creatingTeam || !teamName.trim()}>
          {creatingTeam ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .my-team-page { max-width: 1200px; margin: 0 auto; }
  .header { margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
  .header h1 { margin: 0; color: #1f2937; }
  .subtitle { margin: 0.5rem 0 0 0; color: #4b5563; font-size: 1.1rem; }
  .subtitle strong { color: #2563eb; }
  .team-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .team-header h2 { margin: 0; color: #1f2937; }
  .team-stats { font-weight: 600; color: #4b5563; background: #f3f4f6; padding: 0.5rem 1rem; border-radius: 999px; }
  .empty-state { text-align: center; padding: 4rem 2rem; background: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db; }
  .empty-state h2 { margin-top: 0; color: #374151; }
  .empty-state p { color: #6b7280; margin-bottom: 1.5rem; }
  .create-team-form { display: flex; justify-content: center; gap: 1rem; max-width: 400px; margin: 0 auto; }
  .create-team-form input { flex: 1; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 1rem; }
  .btn-primary { padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; font-size: 1rem; }
  .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
  .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
  .loading { text-align: center; color: #6b7280; padding: 3rem; font-size: 1.2rem; }
  .error { background-color: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
</style>