<script>
  export let player;
</script>

<div class="player-card">
  <div class="image-container">
    <img src={player.playerImageUrl} alt={player.name} />
    <span class="ranking">#{player.ranking}</span>
  </div>
  <div class="details">
    <h3>{player.name}</h3>
    <p class="bio">{player.bio}</p>
    <div class="value">
      <span>Market Value:</span>
      <strong>{player.currentMarketValue.toLocaleString()} PB</strong>
    </div>
  </div>
</div>

<style>
  .player-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    display: flex;
    flex-direction: column;
  }
  .image-container {
    position: relative;
    height: 200px;
    background: #f3f4f6;
  }
  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .ranking {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #f59e0b;
    color: white;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .details { padding: 1rem; display: flex; flex-direction: column; flex-grow: 1; }
  h3 { margin: 0 0 0.5rem 0; color: #1f2937; }
  .bio { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; flex-grow: 1; }
  .value { display: flex; justify-content: space-between; align-items: center; background: #f9fafb; padding: 0.5rem; border-radius: 4px; font-size: 0.875rem; }
  .value strong { color: #10b981; }
</style>