import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.doctype && /^html$/i.test(h.doctype.name), 'DOCTYPEを確認してください。');
    h.assert(h.document.querySelector('h1')?.textContent==='Hello!みなさん！', 'h1の文言を確認してください。');
    h.assert([...h.document.querySelectorAll('*')].every(e=>['HTML','HEAD','BODY','H1'].includes(e.tagName)), 'HTML・HEAD・BODY・H1以外の要素は使わないでください。');
  }
};

export default grader;
