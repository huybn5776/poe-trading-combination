/* eslint-disable no-alert */

import { findBestTradingCombinations } from './combination-algorithm';
import { ItemType } from './enums/item-type';
import { StashItem } from './interfaces/stash-item';
import { TradingCombination } from './interfaces/trading-combination';
import {
  clearHighlights,
  highlightCombinations,
  renderCombinationButtons,
  subscribeForDocumentClickEvent,
  subscribeForDocumentEscapeKeyEvent,
  waitUntilStashTabOpen,
} from './page-interactive';
import { getActiveStashItems } from './stash-item-api';
import { getQualityOfItem, isFlaskItem, isGemItem } from './stash-item-utils';

async function init(): Promise<void> {
  await waitUntilStashTabOpen();
  renderCombinationButtons({ onButtonClick: tradingCombination });
}

init();

async function tradingCombination(type?: ItemType): Promise<void> {
  const stashItems = await getActiveStashItems();
  if (!stashItems?.length) {
    alert('此倉庫頁為空/無法取得內容物');
    return;
  }

  const combinations = [
    ...(!type || type === 'flask' ? getFlaskCombinations(stashItems) : []),
    ...(!type || type === 'gem' ? getGemCombinations(stashItems) : []),
  ];
  if (!combinations.length) {
    alert('找不到適合的配方組合');
    return;
  }

  highlightCombinations(combinations);
  registerClearHighlightCallback();
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
  const clear: () => void = () => {
    clearHighlights();
    clickSubscription.unsubscribe();
    escapeSubscription.unsubscribe();
  };
  const clickSubscription = subscribeForDocumentClickEvent(clear);
  const escapeSubscription = subscribeForDocumentEscapeKeyEvent(clear);
}
