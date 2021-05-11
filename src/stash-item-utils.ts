import { StashItem } from './interfaces/stash-item';

export function isFlaskItem(item: StashItem): boolean {
  return item.baseType.includes('藥劑');
}

export function isGemItem(item: StashItem): boolean {
  return item.icon.includes('/Gems/');
}

export function getItemType(item: StashItem): string {
  if (isFlaskItem(item)) {
    return 'flask';
  }
  if (isGemItem(item)) {
    return 'gem';
  }
  return '';
}

export function getQualityOfItem(item: StashItem): number {
  const qualityProperty = item.properties.find((property) => property.type === 6);
  const qualityLabel = qualityProperty?.values[0][0];
  return parseInt(qualityLabel, 10);
}

export function compareItemPosition(item1: StashItem, item2: StashItem): number {
  const getOrder: (item: StashItem) => number = (item) => item.y * 1000 + item.x;
  return getOrder(item1) - getOrder(item2);
}

export function compareItemQuality(item1: StashItem, item2: StashItem): number {
  const getOrder: (item: StashItem) => number = (item) => getQualityOfItem(item);
  return getOrder(item2) - getOrder(item1);
}

export function getQualitySumOfItems(items:StashItem[]): number {
  return items.reduce((acc, item) => acc + getQualityOfItem(item), 0);
}
