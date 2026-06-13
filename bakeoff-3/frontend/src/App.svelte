<script>
  import { Router, Route, links } from "svelte-routing";

  // The url property is required by svelte-routing for SSR, 
  // but it's also good practice for standard client-side routing.
  export let url = "";
</script>

<Router {url}>
  <nav use:links>
    <a href="/">Home</a>
    <a href="/dashboard">Dashboard</a>
    <a href="/groups">Groups</a>
    <a href="/auctions">Auction House</a>
    <a href="/my-team">My Team</a>
    <a href="/trade-market">Trade Market</a>
  </nav>

  <main>
    <Route path="/">
      <h1>Welcome to Fantasy Pickleball</h1>
      <p>Log in or sign up to start building your legacy.</p>
    </Route>

    <Route path="/dashboard">
      <h1>Dashboard</h1>
      <p>Tournament stats and live rewards will appear here.</p>
    </Route>

    <Route path="/groups/*">
      <h1>Groups & Leagues</h1>
      <p>Manage your fantasy pickleball groups.</p>
    </Route>

    <Route path="/auctions">
      <h1>Auction House</h1>
      <p>Bid on pro players to build your team!</p>
    </Route>

    <Route path="/my-team">
      <h1>My Team</h1>
      <p>Assign your acquired players to tournament categories.</p>
    </Route>

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
  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
