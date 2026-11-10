import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "text",
  resolveUrl: {
    base: "https://example.com/top/top.html",
    target: "https://example.com/image/test.jpg",
    relative: true
  }
};

export default grader;
