import { StashItem } from './interfaces/stash-item';
import { TradingCombination } from './interfaces/trading-combination';
import { getQualitySumOfItems, compareItemPosition, compareItemQuality, getQualityOfItem } from './stash-item-utils';

const requiredQualitySum = 40;
const maximumQualitySum = 45;
const maxQuality = 20;

export function findBestTradingCombinations(items: StashItem[]): TradingCombination[] {
  const combinationsWithoutSort = findTradingCombinations(items);
  const combinationsWithPositionSort = findTradingCombinations(items.sort(compareItemPosition));
  const combinationsWithQualitySort = findTradingCombinations(items.sort(compareItemQuality));
  return getLargestArray(combinationsWithoutSort, combinationsWithPositionSort, combinationsWithQualitySort);
}

export function findTradingCombinations(items: StashItem[]): TradingCombination[] {
  let combinations = findCombinationsUnderQualitySum(items, 40);
  if (!combinations.length) {
    for (let maxQualitySum = 41; maxQualitySum < maximumQualitySum; maxQualitySum += 1) {
      const usedItems = combinations.flatMap((combination) => combination);
      const availableItems = items.filter((item) => !usedItems.includes(item));
      combinations = [...combinations, ...findCombinationsUnderQualitySum(availableItems, maxQualitySum)];
    }
  }

  return combinations.map((stashItem) => ({ sum: getQualitySumOfItems(stashItem), items: stashItem }));
}

function findCombinationsUnderQualitySum(items: StashItem[], maxQualitySum: number): StashItem[][] {
  return items.reduce((combinations, targetItem) => {
    const usedItems = combinations.flatMap((combination) => combination);
    if (usedItems.includes(targetItem)) {
      return combinations;
    }
    const availableItems = items.filter((item) => !usedItems.includes(item));
    const itemCombination = findTradingCombination(availableItems, [targetItem], maxQualitySum);
    return itemCombination ? [...combinations, itemCombination] : combinations;
  }, [] as StashItem[][]);
}

function findTradingCombination(items: StashItem[], itemCombination: StashItem[], maxQualitySum: number): StashItem[] | null {
  for (const currentItem of items.filter((item) => !itemCombination.includes(item))) {
    const tryingCombination = [...itemCombination, currentItem];
    const qualitySum = getQualitySumOfItems(tryingCombination);
    const currentItemQuality = getQualityOfItem(currentItem);

    if (currentItemQuality === maxQuality) {
      return null;
    }
    if (requiredQualitySum <= qualitySum && qualitySum <= maxQualitySum) {
      return tryingCombination;
    }
    if (qualitySum <= requiredQualitySum) {
      const nextCombination = findTradingCombination(
        items.filter((item) => item !== currentItem),
        tryingCombination,
        maxQualitySum,
      );
      if (nextCombination) {
        return nextCombination;
      }
    }
  }
  return null;
}

function getLargestArray<T>(...arrays: T[][]): T[] {
  return arrays.sort((array1, array2) => array2.length - array1.length)[0];
}
