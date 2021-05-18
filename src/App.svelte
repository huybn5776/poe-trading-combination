<script lang="ts">
  /* eslint-disable no-alert */
  import { findBestTradingCombinations } from './combination-algorithm';
  import CombinationToolbar from './components/CombinationToolbar.svelte';
  import DetailZone from './components/DetailZone.svelte';
  import ItemHighlightContainer from './components/ItemHighlightContainer.svelte';
  import type { ItemType } from './enums/item-type';
  import type { StashItem } from './interfaces/stash-item';
  import type { Subscription } from './interfaces/subscription';
  import type { TradingCombination } from './interfaces/trading-combination';
  import { subscribeForDocumentClickEvent, subscribeForDocumentEscapeKeyEvent } from './page-interactive';
  import { getActiveStashItems } from './stash-item-api';
  import { getQualityOfItem, isFlaskItem, isGemItem } from './stash-item-utils';

  let tradeCombinations: TradingCombination[] = [];
  let selectedCombination: TradingCombination | null = null;
  let clearHighlightSubscription: Subscription | null = null;
  let message = '';

  async function onCombine({ detail: type }: CustomEvent<ItemType>): Promise<void> {
    cleanUp();
    await findCombinations(type);
    setTimeout(() => registerClearHighlightCallback());
  }

  async function findCombinations(type: ItemType): Promise<void> {
    const stashItems = await getActiveStashItems();
    if (!stashItems?.length) {
      message = '此倉庫頁為空/無法取得內容物';
      return;
    }

    const combinations = [
      ...(!type || type === 'flask' ? getFlaskCombinations(stashItems) : []),
      ...(!type || type === 'gem' ? getGemCombinations(stashItems) : []),
    ];
    if (!combinations.length) {
      message = '找不到適合的配方組合';
      return;
    }

    tradeCombinations = combinations;
  }

  function cleanUp(): void {
    clearHighlightSubscription?.unsubscribe();
    tradeCombinations = [];
    selectedCombination = null;
    message = '';
  }

  function getFlaskCombinations(stashItems: StashItem[]): TradingCombination[] {
    const flasks = stashItems.filter(isFlaskItem).filter((item) => !!getQualityOfItem(item));
    return findBestTradingCombinations(flasks);
  }

  function getGemCombinations(stashItems: StashItem[]): TradingCombination[] {
    const gems = stashItems.filter(isGemItem).filter((item) => !!getQualityOfItem(item));
    return findBestTradingCombinations(gems);
  }

  function registerClearHighlightCallback(): void {
    const clickSubscription = subscribeForDocumentClickEvent(cleanUp);
    const escapeSubscription = subscribeForDocumentEscapeKeyEvent(cleanUp);
    const unsubscribe: () => void = () => {
      clickSubscription.unsubscribe();
      escapeSubscription.unsubscribe();
    };
    clearHighlightSubscription = { unsubscribe };
  }
</script>

<div class="combination-container">
  <CombinationToolbar on:combine={onCombine} />
  <ItemHighlightContainer combinations={tradeCombinations} bind:selectedCombination />
  <DetailZone combinations={tradeCombinations} bind:selectedCombination {message} />
</div>

<style lang="scss">
  @import './App';
</style>
