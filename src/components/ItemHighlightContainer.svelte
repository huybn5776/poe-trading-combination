<script lang="ts">
  import type { TradingCombination } from '../interfaces/trading-combination';
  import { colors, maxHighlights } from '../page-interactive';
  import { getQualityOfItem } from '../stash-item-utils';
  import ItemHighlight from './ItemHighlight.svelte';

  export let combinations: TradingCombination[] = [];
  export let selectedCombination: TradingCombination | null = null;

  function onHighlightItemClick(event: MouseEvent, combination: TradingCombination): void {
    selectedCombination = selectedCombination === combination ? null : combination;
    event.stopPropagation();
  }
</script>

<div class="combination-container">
  {#each combinations.slice(0, maxHighlights) as combination, index}
    {#each combination.items as item}
      <ItemHighlight
        size={{ x: item.w, y: item.h }}
        position={{ x: item.x, y: item.y }}
        color={colors[index]}
        quality={getQualityOfItem(item)}
        active={selectedCombination && selectedCombination === combination}
        inactive={selectedCombination && selectedCombination !== combination}
        on:click={(event) => onHighlightItemClick(event, combination)}
      />
    {/each}
  {/each}
</div>

<style lang="scss">
</style>
