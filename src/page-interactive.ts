import { Subscription } from './interfaces/subscription';

export const colors = ['red', 'lime', 'yellow', 'aqua', 'darkOrange', 'fuchsia', '#99f', 'rosyBrown', 'lightGray'];
export const maxHighlights = 9;
export const blockSize = 47.4645;
export const requiredQualitySum = 40;

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
