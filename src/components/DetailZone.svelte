<script lang="ts">
  import { afterUpdate } from 'svelte';

  import type { TradingCombination } from '../interfaces/trading-combination';
  import { colors, maxHighlights, requiredQualitySum } from '../page-interactive';
  import { compareItemPosition, getItemType, getQualityOfItem } from '../stash-item-utils';

  export let combinations: TradingCombination[] = [];
  export let selectedCombination: TradingCombination | null = null;
  export let message = '';

  let detailLines: string[] = [];
  $: selectedIndex = combinations.indexOf(selectedCombination);

  function combinationToText(combination: TradingCombination): string {
    const itemType = getItemType(combination.items[0]);
    const prefix = { flask: '💧', gem: '💎' }[itemType] || 'Σ';
    const qualitySumIfWorse = combination.sum === requiredQualitySum ? '' : `(${combination.sum}%)`;
    const qualityText = combination.items.sort(compareItemPosition).map(getQualityOfItem).join(', ');
    return `${prefix}${qualitySumIfWorse} ${qualityText}`;
  }

  function onDetailLineClick(event: MouseEvent, index: number): void {
    const combination = combinations[index];
    selectedCombination = selectedCombination === combination ? null : combination;
    event.stopPropagation();
  }

  afterUpdate(() => {
    const highlightCount = Math.min(maxHighlights, combinations.length);
    detailLines = combinations.slice(0, highlightCount).map(combinationToText);
    if (combinations.length > maxHighlights) {
      detailLines = [...detailLines, '(已達最大顯示數)'];
    }
  });
</script>

<div class="detail-panel-container">
  <div class="detail-panel">
    {#each detailLines as detailLine, index}
      <p
        class="detail-line"
        style="color: {colors[index]};"
        class:active={selectedCombination && selectedIndex === index}
        class:inactive={selectedCombination && selectedIndex !== index}
        on:click={(event) => onDetailLineClick(event, index)}
      >
        {detailLine}
      </p>
    {/each}
  </div>

  {#if message}
    <p class="message">⚠️ {message}</p>
  {/if}
</div>

<style lang="scss">
  @import './DetailZone';
</style>
