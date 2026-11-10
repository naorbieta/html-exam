import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    const radios=[...h.document.querySelectorAll('input[type=radio]')];h.assert(radios.length===3&&radios.every(r=>r.name==='fruits')&&radios.filter(r=>r.hasAttribute('checked')).length===1&&/りんご/.test(h.document.body.textContent)&&/もも/.test(h.document.body.textContent)&&/ぶどう/.test(h.document.body.textContent));
  },
  documentAnswer: true
};

export default grader;
