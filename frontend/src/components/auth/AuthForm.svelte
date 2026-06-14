<script>
  import { createEventDispatcher } from 'svelte';
  import { authStore } from '../../stores/authStore.js';

  const dispatch = createEventDispatcher();

  // Toggles between Login and Registration mode
  export let isLogin = true; 

  // Form fields
  let email = '';
  let password = '';
  let displayName = '';
  let defaultStartingBudget = 1000000;

  let localError = '';

  // Reactive variables subscribing to the authStore
  $: loading = $authStore.loading;
  $: storeError = $authStore.error;

  async function handleSubmit() {
    localError = '';
    try {
      if (isLogin) {
        await authStore.login({ email, password });
      } else {
        if (!displayName.trim()) {
          localError = 'Display Name is required for registration.';
          return;
        }
        await authStore.register({
          email,
          password,
          displayName,
          defaultStartingBudget
        });
      }
      
      // If successful, tell the parent component (like the Home page) that we're done
      dispatch('success');
    } catch (err) {
      // The error is automatically caught and updated in the store, 
      // which updates the storeError reactive variable below.
    }
  }

  function toggleMode() {
    isLogin = !isLogin;
    localError = '';
  }
</script>

<div class="auth-form-container">
  <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>

  {#if localError || storeError}
    <div class="error">{localError || storeError}</div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required placeholder="you@example.com" />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required placeholder="••••••••" />
    </div>

    {#if !isLogin}
      <div class="form-group">
        <label for="displayName">Display Name</label>
        <input type="text" id="displayName" bind:value={displayName} required placeholder="Pickleball Pro" />
      </div>

      <div class="form-group">
        <label for="budget">Custom Starting Budget (Pickle Bucks)</label>
        <input type="number" id="budget" bind:value={defaultStartingBudget} min="0" step="1000" />
      </div>
    {/if}

    <button type="submit" disabled={loading}>
      {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
    </button>
  </form>

  <p class="toggle-text">
    {isLogin ? "Don't have an account?" : "Already have an account?"}
    <button class="link-button" on:click={toggleMode} type="button">
      {isLogin ? 'Sign up here' : 'Log in here'}
    </button>
  </p>
</div>

<style>
  .auth-form-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  .form-group { margin-bottom: 1rem; }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4b5563;
  }
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  button[type="submit"] {
    width: 100%;
    padding: 0.75rem;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: background-color 0.2s;
  }
  button[type="submit"]:hover:not(:disabled) { background-color: #1d4ed8; }
  button:disabled { opacity: 0.7; cursor: not-allowed; }
  .error {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }
  .toggle-text {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  .link-button {
    background: none;
    border: none;
    color: #2563eb;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-left: 0.25rem;
  }
  .link-button:hover { text-decoration: underline; }
</style>