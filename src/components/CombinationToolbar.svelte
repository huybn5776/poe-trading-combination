<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import { ItemType } from '../enums/item-type';

  const dispatch = createEventDispatcher();

  function onButtonClick(itemType?: ItemType): void {
    dispatch('combine', itemType);
  }
</script>

<div class="combination-toolbar">
  <button class="combination-button" on:click={() => onButtonClick()}>商店配方組合</button>
  <button class="combination-button" on:click={() => onButtonClick(ItemType.flask)}>💧藥水</button>
  <button class="combination-button" on:click={() => onButtonClick(ItemType.gem)}>💎寶石</button>
</div>

<style>
  .combination-toolbar {
    position: absolute;
    top: -60px;
    right: 0;
    z-index: 10;
  }

  .combination-button {
    height: 28px;
    margin-left: 2px;
    color: #ffc077;
    line-height: 1;
    background: linear-gradient(#543924, #7c5436);
    border: 2px solid #744f33;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
