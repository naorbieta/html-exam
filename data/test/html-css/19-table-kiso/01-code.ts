import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('table')&&h.document.querySelector('[colspan]')&&['タイトル','A','B','C','1','2','3'].every(t=>h.document.body.textContent.includes(t)));
  }
};

export default grader;
