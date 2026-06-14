<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { teamStore } from '../stores/teamStore.js';
  import { groupStore } from '../stores/groupStore.js';
  import PlayerCard from '../components/auction/PlayerCard.svelte';
  import BiddingInterface from '../components/auction/BiddingInterface.svelte';

  $: currentGroup = $groupStore.currentGroup;
  $: loading = $teamStore.loading;
  $: error = $teamStore.error;
  $: auctions = $teamStore.auctions;

  // Fetch auctions automatically when the group changes or the page loads
  $: if (currentGroup) {
    teamStore.fetchAuctions(currentGroup._id);
  }
</script>

<div class="auction-house">
  <div class="header">
    <h1>Auction House</h1>
    {#if currentGroup}
      <p class="subtitle">Bidding in: <strong>{currentGroup.name}</strong></p>
    {/if}
  </div>

  {#if !currentGroup}
    <div class="empty-state">
      <h2>No Group Selected</h2>
      <p>You need to select a group from your leagues to participate in an auction.</p>
      <button class="btn-primary" on:click={() => navigate('/groups')}>Go to Groups</button>
    </div>
  {:else if loading && auctions.length === 0}
    <div class="loading">Loading active auctions...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if auctions && auctions.length > 0}
    <div class="auction-grid">
      {#each auctions as auction}
        <div class="auction-item">
          <PlayerCard player={auction.player} />
          <BiddingInterface {auction} groupId={currentGroup._id} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <h2>No Active Auctions</h2>
      <p>There are currently no players available for auction in this group.</p>
    </div>
  {/if}
</div>

<style>
  .auction-house { max-width: 1200px; margin: 0 auto; }
  .header { margin-bottom: 2rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 1rem; }
  .header h1 { margin: 0; color: #1f2937; }
  .subtitle { margin: 0.5rem 0 0 0; color: #4b5563; font-size: 1.1rem; }
  .subtitle strong { color: #2563eb; }
  .auction-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
  .auction-item { display: flex; flex-direction: column; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
  .empty-state { text-align: center; padding: 4rem 2rem; background: #f9fafb; border-radius: 8px; border: 1px dashed #d1d5db; }
  .empty-state h2 { margin-top: 0; color: #374151; }
  .empty-state p { color: #6b7280; margin-bottom: 1.5rem; }
  .btn-primary { padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; font-size: 1rem; }
  .btn-primary:hover { background: #1d4ed8; }
  .loading { text-align: center; color: #6b7280; padding: 3rem; font-size: 1.2rem; }
  .error { background-color: #fee2e2; color: #b91c1c; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
</style>