import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert([...h.document.querySelectorAll('iframe[src]')].some(e=>/^https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[\w-]+/.test(e.getAttribute('src'))));
  },
  documentAnswer: true
};

export default grader;
