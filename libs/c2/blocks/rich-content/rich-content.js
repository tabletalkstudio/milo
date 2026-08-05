import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function hangOpeningQuote(header) {
  if (!header) return;
  // \p{Pi} = high curly quotes (“ ‘) and guillemets (« ‹). Also match opening quotes that
  // Unicode files under Ps/Po instead of Pi: straight " (U+0022); German / Central- &
  // Eastern-European low-9 „ ‚ (U+201E, U+201A); CJK corner brackets 「 『 ｢ ﹁ ﹃
  // (U+300C, U+300E, U+FF62, U+FE41, U+FE43); full-width ＂ (U+FF02); reversed low-9 ⹂
  // (U+2E42). The straight single quote (') is intentionally excluded to avoid mangling
  // headings like "'90s nostalgia" / "'Twas".
  const openingQuotes = /^(\p{Pi}|["„‚「『｢﹁﹃＂⹂])/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el) {
  decorateBlockText(el);
  const firstText = el?.querySelector('h1, h2, h3, h4, h5, h6, p');
  hangOpeningQuote(firstText);
}

function promoteParagraphHeading(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `heading-${headingSize}`);
}

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphHeading(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
