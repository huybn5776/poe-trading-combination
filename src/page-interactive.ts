import { ItemType } from './enums/item-type';
import { Subscription } from './interfaces/subscription';
import { TradingCombination } from './interfaces/trading-combination';
import { getItemType, getQualityOfItem, compareItemPosition } from './stash-item-utils';
import styles from './styles.module.scss';

const colors = ['red', 'lime', 'yellow', 'aqua', 'darkOrange', 'fuchsia', '#99f', 'rosyBrown', 'lightGray'];
const maxHighlights = 9;
const blockSize = 47.4645;
const requiredQualitySum = 40;

export interface CombinationButtonConfig {
  onButtonClick: (type?: ItemType) => void;
}

export async function waitUntilStashTabOpen(): Promise<void> {
  await waitForActivePanel();
  await waitForStashPanel();
}

function waitForActivePanel(): Promise<HTMLElement> {
  return new Promise<HTMLElement>((resolve) => {
    const observer = new MutationObserver(() => {
      const colorbox = document.getElementById('colorbox');
      const activePanel = colorbox?.getElementsByClassName('activePanel')[0] as HTMLElement;
      if (!activePanel) {
        return;
      }
      observer.disconnect();
      resolve(activePanel);
    });
    observer.observe(document.body, { attributes: true, childList: true });
  });
}

function waitForStashPanel(): Promise<HTMLElement> {
  return new Promise<HTMLElement>((resolve) => {
    const observer = new MutationObserver(() => {
      const stashPanel = document.getElementsByClassName('stashPanel')[0] as HTMLElement;
      if (!stashPanel) {
        return;
      }
      observer.disconnect();
      resolve(stashPanel);
    });
    observer.observe(document.body, { attributes: true, childList: true });
  });
}

export function renderCombinationButtons(config: CombinationButtonConfig): void {
  const stashPanel = document.getElementsByClassName('stashPanel')[0];
  const stashTabContainer = stashPanel.getElementsByClassName('stashTabContainer')[0];

  const calcCombinationButtons = createCombinationButtons(config);
  stashTabContainer.appendChild(calcCombinationButtons);
  calcCombinationButtons.style.top = `-${calcCombinationButtons.offsetHeight + 32}px`;
}

function createCombinationButtons(config: CombinationButtonConfig): HTMLElement {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = styles.combinationButtonContainer;

  const calcCombinationButton = document.createElement('button');
  calcCombinationButton.className = styles.combinationButton;
  calcCombinationButton.innerText = '商店配方組合';
  calcCombinationButton.onclick = () => config.onButtonClick();
  buttonsContainer.appendChild(calcCombinationButton);

  const flaskButton = document.createElement('button');
  flaskButton.className = styles.combinationButton;
  flaskButton.innerText = '💧藥水';
  flaskButton.onclick = () => config.onButtonClick(ItemType.flask);
  buttonsContainer.appendChild(flaskButton);

  const gemButton = document.createElement('button');
  gemButton.className = styles.combinationButton;
  gemButton.innerText = '💎寶石';
  gemButton.onclick = () => config.onButtonClick(ItemType.gem);
  buttonsContainer.appendChild(gemButton);

  return buttonsContainer;
}

export function highlightCombinations(combinations: TradingCombination[], selectedCombination?: TradingCombination): void {
  const highlightContainer = getHighlightContainerOrCreate();
  clearElementChild(highlightContainer);
  renderHighlightBlocks(highlightContainer, combinations, selectedCombination);
  renderCombinationDetails(highlightContainer, combinations, selectedCombination);
}

function getHighlightContainerOrCreate(): HTMLElement {
  const highlightContainerId = 'highlightContainer';
  let highlightContainer = document.getElementById(highlightContainerId);
  if (highlightContainer) {
    return highlightContainer;
  }

  const stashTabContent = document.getElementsByClassName('stashTabContents')[0];
  highlightContainer = document.createElement('div');
  highlightContainer.id = highlightContainerId;
  stashTabContent.appendChild(highlightContainer);

  return highlightContainer;
}

function clearElementChild(element: HTMLElement): void {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}

function renderHighlightBlocks(
  highlightContainer: HTMLElement,
  combinations: TradingCombination[],
  selectedCombination?: TradingCombination,
): void {
  for (let i = 0; i < combinations.length && i < maxHighlights; i += 1) {
    const combination = combinations[i];
    const highlightBlocks = createHighlightBlocks(combination, colors[i]);

    for (const highlightBlock of highlightBlocks) {
      highlightBlock.onclick = createOnCombinationClickListener(combinations, combination, selectedCombination);
      highlightContainer.appendChild(highlightBlock);

      if (selectedCombination && combination !== selectedCombination) {
        highlightBlock.classList.add(styles.highlightItemInactive);
      } else if (combination === selectedCombination) {
        highlightBlock.classList.add(styles.highlightItemActive);
      }
    }
  }
}

function createHighlightBlocks(combination: TradingCombination, color: string): HTMLElement[] {
  return combination.items.map((item) => {
    const highlightBlock = document.createElement('div');
    highlightBlock.className = styles.highlightBlock;
    highlightBlock.style.width = `${blockSize * item.w}px`;
    highlightBlock.style.height = `${blockSize * item.h}px`;
    highlightBlock.style.left = `${blockSize * item.x}px`;
    highlightBlock.style.top = `${blockSize * item.y}px`;
    highlightBlock.style.borderColor = color;

    const qualityLabel = document.createElement('span');
    qualityLabel.className = styles.qualityLabel;
    qualityLabel.style.backgroundColor = color;
    qualityLabel.innerText = `${getQualityOfItem(item)}%`;

    highlightBlock.appendChild(qualityLabel);

    return highlightBlock;
  });
}

function createOnCombinationClickListener(
  combinations: TradingCombination[],
  clickedCombination?: TradingCombination,
  selectedCombination?: TradingCombination,
): (event: MouseEvent) => void {
  return (event) => {
    if (clickedCombination === selectedCombination) {
      highlightCombinations(combinations);
    } else {
      highlightCombinations(combinations, clickedCombination);
    }
    event.stopPropagation();
  };
}

function renderCombinationDetails(
  highlightContainer: HTMLElement,
  combinations: TradingCombination[],
  selectedCombination?: TradingCombination,
): void {
  const highlightCount = Math.min(maxHighlights, combinations.length);
  let detailLines = combinations.slice(0, highlightCount).map(combinationToText);
  if (combinations.length > maxHighlights) {
    detailLines = [...detailLines, '(已達最大顯示數)'];
  }

  const combinationDetail = createCombinationDetailPanel(detailLines);
  highlightContainer.appendChild(combinationDetail);
  const detailHeight = combinationDetail.offsetHeight;
  combinationDetail.style.top = `-${detailHeight + 32}px`;

  const infoLineElements = Array.from(combinationDetail.children) as HTMLElement[];
  for (let i = 0; i < highlightCount; i += 1) {
    const combination = combinations[i];
    const infoLineElement = infoLineElements[i];
    infoLineElement.onclick = createOnCombinationClickListener(combinations, combination, selectedCombination);
    if (selectedCombination) {
      infoLineElement.classList.add(
        combination === selectedCombination ? styles.infoLineElementActive : styles.infoLineElementInactive,
      );
    }
  }
}

function combinationToText(combination: TradingCombination): string {
  const itemType = getItemType(combination.items[0]);
  const prefix = { flask: '💧', gem: '💎' }[itemType] || 'Σ';
  const qualitySumIfWorse = combination.sum === requiredQualitySum ? '' : `(${combination.sum}%)`;
  const qualityText = combination.items.sort(compareItemPosition).map(getQualityOfItem).join(', ');
  return `${prefix}${qualitySumIfWorse} ${qualityText}`;
}

function createCombinationDetailPanel(textLines: string[]): HTMLElement {
  const combinationDetailPanel = document.createElement('div');
  combinationDetailPanel.className = styles.combinationDetailPanel;
  combinationDetailPanel.style.gridTemplateRows = `repeat(${Math.min(textLines.length, 5)}, 1fr)`;

  const infoLineElements = textLines.map((textLine, index) => {
    const infoLineElement = document.createElement('p');
    infoLineElement.className = styles.infoLineElement;
    infoLineElement.style.color = colors[index];
    infoLineElement.innerText = textLines[index];
    return infoLineElement;
  });
  for (const infoLineElement of infoLineElements) {
    combinationDetailPanel.appendChild(infoLineElement);
  }

  return combinationDetailPanel;
}

export function clearHighlights(): void {
  document.getElementById('highlightContainer')?.remove();
}

export function subscribeForDocumentClickEvent(callback: (event: MouseEvent) => void): Subscription {
  document.addEventListener('click', callback);
  return { unsubscribe: () => document.removeEventListener('click', callback) };
}

export function subscribeForDocumentEscapeKeyEvent(callback: (event: KeyboardEvent) => void): Subscription {
  const onKeyDown: (event: KeyboardEvent) => void = (event) => {
    if (event.key !== 'Escape') {
      return;
    }
    callback(event);
  };
  document.addEventListener('keydown', onKeyDown);
  return { unsubscribe: () => document.removeEventListener('keydown', onKeyDown) };
}
