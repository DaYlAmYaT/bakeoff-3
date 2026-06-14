<script>
  import { navigate } from 'svelte-routing';
  import { authStore } from '../stores/authStore.js';
  import AuthForm from '../components/auth/AuthForm.svelte';

  // Redirect to dashboard if the user is already logged in
  $: if ($authStore.isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  function handleSuccess() {
    // When AuthForm dispatches 'success', send them to the dashboard
    navigate('/dashboard');
  }
</script>

<div class="home-container">
  <div class="hero">
    <h1>Welcome to Fantasy Pickleball</h1>
    <p>Build your legacy. Bid on pro players. Win big.</p>
  </div>
  
  <div class="auth-section">
    {#if !$authStore.isAuthenticated}
      <AuthForm on:success={handleSuccess} />
    {/if}
  </div>
</div>

<style>
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .hero {
    text-align: center;
  }
  .hero h1 {
    font-size: 2.5rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  .hero p {
    font-size: 1.25rem;
    color: #4b5563;
  }
</style>