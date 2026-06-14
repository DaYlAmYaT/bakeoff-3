<script>
  export let team; // We expect a team object with a 'roster' array passed in as a prop

  // A fantasy team strictly has 8 slots.
  // We map over an array of 8 to ensure we always show 8 boxes, filling them if a player exists.
  $: slots = Array.from({ length: 8 }).map((_, index) => {
    return team?.roster?.[index] || null;
  });
</script>

<div class="roster-grid">
  {#each slots as slot, index}
    <div class="slot {slot ? 'filled' : 'empty'}">
      <div class="slot-number">{index + 1}</div>
      
      {#if slot && slot.playerId}
        <div class="player-info">
          <img src={slot.playerId.playerImageUrl} alt={slot.playerId.name} class="avatar" />
          <div class="details">
            <span class="name">{slot.playerId.name}</span>
            <span class="category {slot.assignedCategory === 'Unassigned' ? 'unassigned' : ''}">
              {slot.assignedCategory || 'Unassigned'}
            </span>
          </div>
        </div>
      {:else}
        <div class="empty-placeholder">
          <span>Empty Slot</span>
          <small>Win auctions to fill</small>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .roster-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  .slot {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    background: #f9fafb;
    position: relative;
    min-height: 80px;
    transition: all 0.2s;
  }
  .slot.filled {
    border-style: solid;
    border-color: #e5e7eb;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .slot-number {
    position: absolute;
    top: -10px;
    left: -10px;
    background: #4b5563;
    color: white;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
  }
  .player-info { display: flex; align-items: center; gap: 1rem; width: 100%; }
  .avatar { width: 50px; height: 50px; border-radius: 50%; object-fit: cover; background: #e5e7eb; border: 2px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .details { display: flex; flex-direction: column; }
  .name { font-weight: 600; color: #1f2937; }
  .category {
    font-size: 0.75rem; color: #10b981; background: #d1fae5; padding: 0.2rem 0.5rem;
    border-radius: 4px; margin-top: 0.25rem; display: inline-block; width: fit-content; font-weight: 500;
  }
  .category.unassigned { color: #9ca3af; background: #f3f4f6; }
  
  .empty-placeholder { width: 100%; text-align: center; display: flex; flex-direction: column; gap: 0.25rem; }
  .empty-placeholder span { color: #9ca3af; font-weight: 500; }
  .empty-placeholder small { color: #d1d5db; font-size: 0.75rem; }
</style>