import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  html: "<!DOCTYPE html>\n<html>\n    <head></head>\n    <body>\n        <div class=\"wrapper\">\n            <div class=\"box\">\n                吾輩は猫である。名前はまだ無い。\n                どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。この書生というのは時々我々を捕えて煮て食うという話である。しかしその当時は何という考もなかったから別段恐しいとも思わなかった。ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。この時妙なものだと思った感じが今でも残っている。第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。\n                のみならず顔の真中があまりに突起している。そうしてその穴の中から時々ぷうぷうと……\n            </div>\n        </div>\n        <style>\n            .wrapper {\n                width: 1170px;\n                margin: 0 auto;\n            }\n        </style>\n    </body>\n</html>",
  check(h) {
    const s=h.css('.box');h.assert(parseFloat(s.columnGap)>0&&parseFloat(s.columnRuleWidth)>0&&s.columnRuleStyle!=='none','段の間に余白と縦線を設定してください。');h.assert(s.columnCount==='2','2段組にしてください。');
  },
  target: ".box",
  documentAnswer: true
};

export default grader;
