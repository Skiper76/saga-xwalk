import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-promo — a row of promotional pods, each a coloured panel with a
 * banner image, heading, description and a single CTA button. Colours cycle
 * across the three pod positions (see cards-promo.css).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture, img')) return;
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-promo-card-image';
      } else {
        div.className = 'cards-promo-card-body';
        // ensure the CTA renders as a button even if EDS button
        // auto-decoration did not run on the authored markup
        const cta = div.querySelector('p:last-child > a');
        if (cta && cta.parentElement.childElementCount === 1 && !cta.classList.contains('button')) {
          cta.classList.add('button');
          cta.parentElement.classList.add('button-container');
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
