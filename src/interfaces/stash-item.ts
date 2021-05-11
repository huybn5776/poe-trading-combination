export interface StashItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  typeLine: string;
  baseType: string;
  icon: string;
  ilvl: number;
  properties: StashItemProperty[];
  requirements: ItemRequirement[];
  frameType: number;
  inventoryId: string;
  socketedItems: [];
}

export interface StashItemProperty {
  name: string;
  values: string[][];
  displayMode: number;
  type: number;
}

export interface ItemRequirement {
  name: string;
  values: [][];
  displayMode: number;
}
