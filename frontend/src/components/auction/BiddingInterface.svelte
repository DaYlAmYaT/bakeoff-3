<script>
  import { teamStore } from '../../stores/teamStore.js';
  import { authStore } from '../../stores/authStore.js';

  export let auction;
  export let groupId;

  $: player = auction.player;
  $: currentBid = auction.bid;
  
  $: minBid = currentBid ? currentBid.currentBidAmount + 1000 : player.currentMarketValue;
  let bidAmount = minBid;
  let placingBid = false;
  let localError = '';
  
  $: user = $authStore.user;

  $: isHighestBidder = currentBid && currentBid.currentHighestBidderUserId?._id === user?._id;

  async function handleBid() {
    if (bidAmount < minBid) {
      localError = `Bid must be at least ${minBid.toLocaleString()} PB`;
      return;
    }
    
    localError = '';
    placingBid = true;
    try {
      await teamStore.placeBid(player._id, groupId, bidAmount);
      // Reload auctions to get updated bid state
      await teamStore.fetchAuctions(groupId);
    } catch (err) {
      localError = err.message || 'Failed to place bid';
    } finally {
      placingBid = false;
    }
  }
  
  $: endTime = currentBid ? new Date(currentBid.auctionEndTime).toLocaleString() : 'No bids yet';
</script>

<div class="bidding-interface">
  {#if localError}
    <div class="error">{localError}</div>
  {/if}

  <div class="bid-status">
    {#if currentBid}
      <div class="current-bid">
        <span>Current Bid:</span>
        <strong>{currentBid.currentBidAmount.toLocaleString()} PB</strong>
      </div>
      <div class="bidder">
        <span>Highest Bidder:</span>
        <span class="name {isHighestBidder ? 'me' : ''}">
          {isHighestBidder ? 'You' : currentBid.currentHighestBidderUserId?.displayName || 'Unknown'}
        </span>
      </div>
      <div class="end-time">
        <span>Ends:</span>
        <span>{endTime}</span>
      </div>
    {:else}
      <div class="no-bids">No active bids. Starting price: {player.currentMarketValue.toLocaleString()} PB</div>
    {/if}
  </div>

  <form class="bid-form" on:submit|preventDefault={handleBid}>
    <input 
      type="number" 
      bind:value={bidAmount} 
      min={minBid} 
      step="1000" 
      disabled={isHighestBidder || placingBid}
    />
    <button type="submit" disabled={isHighestBidder || placingBid}>
      {placingBid ? 'Placing...' : (isHighestBidder ? 'Highest Bidder' : 'Place Bid')}
    </button>
  </form>
</div>

<style>
  .bidding-interface { padding: 1rem; background: #eff6ff; border-top: 1px solid #bfdbfe; display: flex; flex-direction: column; gap: 1rem; }
  .bid-status { font-size: 0.875rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .current-bid, .bidder, .end-time { display: flex; justify-content: space-between; }
  .current-bid strong { color: #2563eb; font-size: 1.125rem; }
  .bidder .me { color: #10b981; font-weight: bold; }
  .no-bids { text-align: center; color: #6b7280; font-style: italic; }
  .bid-form { display: flex; gap: 0.5rem; }
  input { flex-grow: 1; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; font-size: 1rem; }
  button { padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
  button:hover:not(:disabled) { background: #1d4ed8; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  .error { background: #fee2e2; color: #b91c1c; padding: 0.5rem; border-radius: 4px; font-size: 0.875rem; text-align: center; }
</style>