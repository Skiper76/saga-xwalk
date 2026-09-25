import { loadCSS } from './aem.js';

const STORAGE_KEY = 'saga-demo-notice-dismissed';

/**
 * Shows a one-time modal warning visitors that this is a demo/prototype
 * site, not the official Saga website. Dismissal is remembered in
 * localStorage so the notice only appears on the visitor's first visit.
 */
export default async function showDemoNotice() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {
    // storage unavailable (e.g. privacy mode) - fall through and show notice
  }

  await loadCSS(`${window.hlx.codeBasePath}/styles/demo-notice.css`);

  const overlay = document.createElement('div');
  overlay.className = 'demo-notice-overlay';
  overlay.innerHTML = `
    <div class="demo-notice-dialog" role="alertdialog" aria-modal="true" aria-labelledby="demo-notice-title" aria-describedby="demo-notice-desc">
      <p class="demo-notice-eyebrow">Demonstration site</p>
      <h2 id="demo-notice-title">This is not the Saga website</h2>
      <div id="demo-notice-desc">
        <p>This site is a design prototype built to demonstrate a possible redesign of Saga on Adobe Edge Delivery Services. It is not operated by, affiliated with or endorsed by Saga Services Limited or any Saga group company.</p>
        <p>No products or services are offered here. There is nothing to buy or log in to. Never enter personal, account or payment details on this site.</p>
      </div>
      <button type="button" class="demo-notice-primary">I understand, continue to the demo</button>
      <a class="demo-notice-secondary" href="https://www.saga.co.uk/">Go to the official Saga site</a>
    </div>
  `;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // do nothing
    }
    overlay.remove();
    document.body.classList.remove('demo-notice-open');
  };

  overlay.querySelector('.demo-notice-primary').addEventListener('click', dismiss);
  document.body.append(overlay);
  document.body.classList.add('demo-notice-open');
  overlay.querySelector('.demo-notice-primary').focus();
}
