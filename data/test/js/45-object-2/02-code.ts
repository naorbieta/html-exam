import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  context: [
    {
      name: "person",
      code: "let person={name:'ヒカキン',hometown:'新潟県'};"
    }
  ],
  check(h) {
    h.assert(Object.entries(person).some(([key,value])=>key!=='name'&&key!=='hometown'&&typeof value==='number'&&value>=0),'personに年齢の数値を追加してください。');
  }
};

export default grader;
