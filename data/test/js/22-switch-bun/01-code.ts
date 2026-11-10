import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "code",
  requires: ["\\bswitch\\s*\\("],
  cases: [
    {
      prompts: ["月曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('月曜日')&&/がんば|頑張/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["水曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('水曜日')&&/がんば|頑張/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["土曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('土曜日')&&/休/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["日曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('日曜日')&&/休/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["金曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('金曜日')&&/がんば|頑張/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["火曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('火曜日')&&/がんば|頑張/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["木曜日"],
      check(h) {
        h.assert(h.alerts.length===1&&h.alerts[0].includes('木曜日')&&/がんば|頑張/.test(h.alerts[0]),'入力した曜日に合わせてメッセージを表示してください。');
      }
    },
    {
      prompts: ["月"],
      check(h) {
        h.assert(h.alerts.length===1&&/正しく|不正|曜日では|無効/.test(h.alerts[0]),'曜日以外の入力にもメッセージを表示してください。');
      }
    },
    {
      prompts: ["abc"],
      check(h) {
        h.assert(h.alerts.length===1&&/正しく|不正|曜日では|無効/.test(h.alerts[0]),'曜日以外の入力にもメッセージを表示してください。');
      }
    }
  ]
};

export default grader;
