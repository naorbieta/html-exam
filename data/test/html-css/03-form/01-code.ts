import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  htmlAnswer: true,
  check(h) {
    h.assert(h.document.querySelector('form[method=post][action="form.php"]') && h.document.querySelector('input[type=hidden][name=id][value="123"]') && h.document.querySelector('input[type=email][name=mail]'));
  },
  documentAnswer: true
};

export default grader;
