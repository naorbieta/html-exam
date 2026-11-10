import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    const outer=h.document.querySelector('div'); const inner=outer?.querySelector('div');h.assert(outer&&inner&&outer.style.position==='relative'&&inner.style.position==='absolute'&&outer.style.width==='200px'&&outer.style.height==='200px'&&inner.style.bottom==='0'&&inner.style.right==='0');
  },
  documentAnswer: true
};

export default grader;
