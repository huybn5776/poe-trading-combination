import { StashItem } from './interfaces/stash-item';

export function getActiveStashItems(): Promise<StashItem[]> {
  const activeStashTab = getActiveStashTab();
  const accountName = getAccountName();
  const league = getLeague();
  if (activeStashTab === -1 || !accountName || !league) {
    return Promise.resolve([]);
  }
  return fetchStashItems(accountName, league, activeStashTab);
}

function getActiveStashTab(): number {
  const tabWindow = document.getElementsByClassName('tabWindow')[0];
  const stashTabs = Array.from(tabWindow?.getElementsByClassName('tab') || []);
  return stashTabs
    .map((stashTab) => stashTab.children[0])
    .findIndex((tab) => (tab as HTMLElement).style.backgroundPositionY === '26px');
}

function getAccountName(): string | undefined {
  return (document.getElementsByClassName('profile-link')[0] as HTMLElement)?.innerText;
}

function getLeague(): string {
  const activeCharter = document.querySelector('.character.active');
  const leagueLabel = (activeCharter?.getElementsByClassName('infoLine3')[0] as HTMLElement)?.innerText || '';
  return leagueLabel.split(' ')[0];
}

async function fetchStashItems(accountName: string, league: string, tabIndex: number): Promise<StashItem[]> {
  const url = `https://web.poe.garena.tw/character-window/get-stash-items?accountName=${accountName}&realm=pc&league=${league}&tabs=0&tabIndex=${tabIndex}`;
  const result = await fetch(url);
  const json = await result.json();
  return json.items;
}
