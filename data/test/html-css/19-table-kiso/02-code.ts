import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('[rowspan="3"]')&&h.document.querySelectorAll('tr').length===3&&['タイトル','A','B','C','1','2','3'].every(t=>h.document.body.textContent.includes(t)));
  }
};

export default grader;
