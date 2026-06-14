<script>
  import { Router, Route, links, navigate } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import GroupList from "./components/group/GroupList.svelte";
  import GroupDetail from "./pages/GroupDetail.svelte";
  import AuctionHouse from "./pages/AuctionHouse.svelte";
  import MyTeam from "./pages/MyTeam.svelte";
  import { authStore } from "./stores/authStore.js";

  // The url property is required by svelte-routing for SSR, 
  // but it's also good practice for standard client-side routing.
  export let url = "";
</script>

<Router {url}>
  <nav use:links>
    <a href="/">Home</a>
    {#if $authStore.isAuthenticated}
      <a href="/dashboard">Dashboard</a>
      <a href="/groups">Groups</a>
      <a href="/auctions">Auction House</a>
      <a href="/my-team">My Team</a>
      <a href="/trade-market">Trade Market</a>
      <button class="logout-btn" on:click={() => { authStore.logout(); navigate('/', { replace: true }); }}>Logout</button>
    {/if}
  </nav>

  <main>
    <Route path="/" component={Home} />

    <Route path="/dashboard">
      <h1>Dashboard</h1>
      <p>Tournament stats and live rewards will appear here.</p>
    </Route>

    <Route path="/groups" component={GroupList} />
    <Route path="/groups/:id" component={GroupDetail} />

    <Route path="/auctions" component={AuctionHouse} />

    <Route path="/my-team" component={MyTeam} />

    <Route path="/trade-market">
      <h1>Trade Market</h1>
      <p>Propose trades or sell players to the open market.</p>
    </Route>
  </main>
</Router>

<style>
  nav {
    padding: 1rem;
    background-color: #f3f4f6;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    border-bottom: 2px solid #e5e7eb;
  }
  a {
    text-decoration: none;
    color: #374151;
    font-weight: 600;
  }
  a:hover {
    color: #2563eb;
  }
  .logout-btn {
    margin-left: auto;
    background: none;
    border: none;
    color: #ef4444;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
  }
  .logout-btn:hover {
    text-decoration: underline;
  }
  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
