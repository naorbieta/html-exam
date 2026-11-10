import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('meta[charset]')?.getAttribute('charset').toLowerCase()==='utf-8'&&h.document.querySelector('meta[name=description][content]')&&h.document.querySelector('meta[name=viewport]')?.getAttribute('content').includes('width=device-width')&&h.document.querySelector('meta[name=keywords]')?.getAttribute('content').includes('HTML基礎')&&h.document.querySelector('title')?.textContent==='Webスクール');
  },
  documentAnswer: true
};

export default grader;
