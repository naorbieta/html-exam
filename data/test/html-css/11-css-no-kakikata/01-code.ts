import type { Grader } from '../../../grader.ts';

const grader: Grader = {
  kind: "render",
  htmlAnswer: true,
  check(h) {
    const p=h.el('p'),s=h.css(p),nodes=[];for(let e=p;e;e=e.parentElement)nodes.push(e);h.near(parseFloat(s.fontSize),18,'文字サイズを18pxにしてください。',.01);const channels=s.color.match(/[\d.]+/g)?.map(Number)||[];h.assert(channels.length===4&&channels[0]>channels[1]&&channels[0]>channels[2]&&Math.abs(channels[3]-.5)<.005,'文字色を半透明の赤色にしてください。');h.assert(Number(s.fontWeight)>=600,'文字を太字にしてください。');h.assert(nodes.every(e=>Number(getComputedStyle(e).opacity)===1),'opacityではなく、文字色の透明度を指定してください。');h.assert(h.rect(p).width>0&&h.rect(p).height>0&&s.visibility==='visible','文字を表示してください。');const properties=['font-size','color','font-weight'];h.assert(properties.every(key=>nodes.some(e=>e.style.getPropertyValue(key))),'HTMLタグのstyle属性で文字サイズ・色・太さを指定してください。');
  }
};

export default grader;
