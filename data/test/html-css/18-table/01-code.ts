import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('table')&&h.document.querySelector('[colspan="2"]')&&h.document.querySelectorAll('[rowspan="2"]').length===2&&['コンテンツA','画像A','画像B'].every(t=>h.document.body.textContent.includes(t)));
  }
};

export default grader;
