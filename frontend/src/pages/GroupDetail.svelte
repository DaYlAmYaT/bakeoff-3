<script>
  import { onMount } from 'svelte';
  import { groupStore } from '../stores/groupStore.js';
  import { navigate } from 'svelte-routing';

  // The id is automatically passed down by svelte-routing from the URL /groups/:id
  export let id;

  let loading = true;
  let error = null;
  
  // Reactively bind to the current group in our store
  $: group = $groupStore.currentGroup;

  onMount(async () => {
    try {
      loading = true;
      await groupStore.fetchGroup(id);
    } catch (err) {
      error = err.message || 'Failed to load group details.';
    } finally {
      loading = false;
    }
  });

  function copyInviteToken() {
    if (group && group.inviteToken) {
      navigator.clipboard.writeText(group.inviteToken);
      alert('Invite token copied to clipboard!');
    }
  }
</script>

<div class="group-detail-container">
  <button class="back-link" on:click={() => navigate('/groups')}>&larr; Back to Leagues</button>

  {#if loading}
    <div class="loading">Loading group details...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if group}
    <div class="header">
      <h2>{group.name}</h2>
      <p class="description">{group.description || 'No description provided.'}</p>
      <div class="meta">
        <span class="status">Status: {group.status}</span>
        <span class="owner">Owner: {group.ownerUserId?.displayName}</span>
      </div>
    </div>

    <div class="invite-section">
      <h3>Invite Friends</h3>
      <p>Share this token with your friends so they can join the league:</p>
      <div class="token-box">
        <code>{group.inviteToken}</code>
        <button on:click={copyInviteToken}>Copy Token</button>
      </div>
    </div>

    <div class="members-section">
      <h3>Members ({group.members.length})</h3>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Email</th>
              <th>Cash Balance</th>
              <th>Loans</th>
            </tr>
          </thead>
          <tbody>
            {#each group.members as member}
              <tr>
                <td>{member.userId?.displayName || 'Unknown User'}</td>
                <td>{member.userId?.email || 'N/A'}</td>
                <td class="cash">{member.currentCashBalance.toLocaleString()} PB</td>
                <td class="loan">{member.outstandingLoan > 0 ? member.outstandingLoan.toLocaleString() + ' PB' : '-'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .group-detail-container { max-width: 900px; margin: 0 auto; }
  .back-link { background: none; border: none; color: #2563eb; cursor: pointer; font-weight: 600; margin-bottom: 1.5rem; padding: 0; font-size: 1rem; }
  .back-link:hover { text-decoration: underline; }
  
  .header { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 2rem; border: 1px solid #e5e7eb; }
  .header h2 { margin-top: 0; color: #1f2937; margin-bottom: 0.5rem; font-size: 2rem; }
  .description { color: #4b5563; font-size: 1.1rem; margin-bottom: 1.5rem; }
  .meta { display: flex; gap: 2rem; font-size: 0.875rem; color: #6b7280; }
  .status { text-transform: capitalize; font-weight: 600; color: #10b981; }
  
  .invite-section { background: #eff6ff; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #bfdbfe; }
  .invite-section h3 { margin-top: 0; color: #1e3a8a; margin-bottom: 0.5rem; }
  .invite-section p { color: #1e40af; margin-bottom: 1rem; font-size: 0.875rem; }
  .token-box { display: flex; align-items: center; gap: 1rem; }
  .token-box code { background: white; padding: 0.75rem 1rem; border-radius: 4px; font-weight: bold; border: 1px solid #bfdbfe; color: #1e3a8a; letter-spacing: 1px; flex-grow: 1; font-size: 1.1rem; }
  .token-box button { background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;}
  .token-box button:hover { background: #1d4ed8; }
  
  .members-section { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
  .members-section h3 { margin-top: 0; color: #1f2937; margin-bottom: 1.5rem; }
  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; text-align: left; }
  th { padding: 0.75rem 1rem; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; }
  td { padding: 1rem; border-bottom: 1px solid #e5e7eb; color: #1f2937; }
  .cash { font-weight: 600; color: #10b981; }
  .loan { color: #ef4444; }
  
  .loading { text-align: center; color: #6b7280; padding: 3rem; font-size: 1.2rem; }
  .error { background-color: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
</style>