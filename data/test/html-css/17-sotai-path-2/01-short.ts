import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "text",
  resolveUrl: {
    base: "https://example.com/blog/staff/2022_08/index.html",
    target: "https://example.com/items/js/staff.js",
    relative: true
  }
};

export default grader;
