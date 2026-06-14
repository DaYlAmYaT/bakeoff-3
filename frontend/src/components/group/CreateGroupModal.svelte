<script>
  import { createEventDispatcher } from 'svelte';
  import { groupStore } from '../../stores/groupStore.js';

  const dispatch = createEventDispatcher();

  let name = '';
  let description = '';
  let defaultStartingBudget = 1000000;
  let localError = '';

  // Subscribing to the groupStore for loading/error states
  $: loading = $groupStore.loading;
  $: storeError = $groupStore.error;

  async function handleSubmit() {
    localError = '';
    if (!name.trim()) {
      localError = 'Group name is required.';
      return;
    }

    try {
      await groupStore.createGroup({
        name,
        description,
        defaultStartingBudget,
      });
      // Tell the parent component to close the modal and refresh its data
      dispatch('close');
    } catch (err) {
      // Errors are caught and surfaced via storeError
    }
  }

  function handleClose() {
    dispatch('close');
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-backdrop" on:click={handleClose}>
  <div class="modal-content" on:click|stopPropagation>
    <h2>Create a Fantasy Group</h2>

    {#if localError || storeError}
      <div class="error">{localError || storeError}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="groupName">Group Name</label>
        <input type="text" id="groupName" bind:value={name} required placeholder="The Pickleball Legends" />
      </div>

      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <textarea id="description" bind:value={description} placeholder="A group for the ultimate fantasy showdown!" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label for="budget">Default Starting Budget (Pickle Bucks)</label>
        <input type="number" id="budget" bind:value={defaultStartingBudget} min="0" step="1000" />
        <small>New members will receive this amount unless they configured a custom budget.</small>
      </div>

      <div class="actions">
        <button type="button" class="btn-cancel" on:click={handleClose} disabled={loading}>Cancel</button>
        <button type="submit" class="btn-submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  .form-group { margin-bottom: 1.25rem; }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #4b5563;
  }
  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  small {
    display: block;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  button { padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; cursor: pointer; border: none; }
  .btn-cancel { background: #e5e7eb; color: #374151; }
  .btn-cancel:hover { background: #d1d5db; }
  .btn-submit { background: #2563eb; color: white; }
  .btn-submit:hover:not(:disabled) { background: #1d4ed8; }
  button:disabled { opacity: 0.7; cursor: not-allowed; }
  .error { background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.875rem; }
</style>