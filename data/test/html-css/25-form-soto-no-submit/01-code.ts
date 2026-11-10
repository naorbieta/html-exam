import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    const f=h.document.querySelector('form[id]');h.assert(f&&[...h.document.querySelectorAll('button[type=submit],input[type=submit]')].some(e=>e.getAttribute('form')===f.id&&!f.contains(e)));
  },
  documentAnswer: true
};

export default grader;
