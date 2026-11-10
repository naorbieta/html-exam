import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('meta[name=viewport]')?.getAttribute('content').includes('width=device-width'));
  },
  documentAnswer: true
};

export default grader;
