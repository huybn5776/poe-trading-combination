import App from './App.svelte';
import SamplePage from './components/SamplePage.svelte';
import { waitUntilStashTabOpen } from './page-interactive';

async function init(): Promise<App> {
  if (process.env.production) {
    await waitUntilStashTabOpen();
  } else {
    // eslint-disable-next-line no-new
    new SamplePage({ target: document.body });
  }

  const stashPanel = document.getElementsByClassName('stashPanel')[0];
  const stashTabContainer = stashPanel?.getElementsByClassName('stashTabContainer')[0];

  return new App({ target: stashTabContainer || document.body });
}

init();
