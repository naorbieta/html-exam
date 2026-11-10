import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('link[rel=stylesheet]')?.getAttribute('href')?.replace(/^\.\//,'')==='css/design.css');
  },
  documentAnswer: true
};

export default grader;
