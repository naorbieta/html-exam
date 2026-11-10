// The checker runs in an opaque frame; submitted HTML cannot execute scripts or make requests.
export function renderDocument(config, answer, answers, scenario, token, nonce) {
  const previousAnswers = { ...answers };
  for (const id of config.previous || []) previousAnswers[id] = codeSource(answers[id]);
  const payload = JSON.stringify({ config, answer: codeSource(answer), answers: previousAnswers, scenario, token }).replaceAll('<', '\\u003c');
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; base-uri 'none'; form-action 'none'"><body><script nonce="${nonce}">(${runCheck.toString()})(${payload})<\/script>`;
}

async function runCheck({ config, answer, answers, scenario, token }) {
  const checks = [];
  const assert = (condition, message = '表示が指定された条件と一致しません。') => {
    checks.push({ label: message, passed: Boolean(condition) });
    if (!condition) throw new Error(message);
  };
  try {
    const fullDocument = value => typeof value === 'string' && /^\s*<(?:!doctype\s+html|html\b)/i.test(value);
    const documentAnswer = config.htmlAnswer || config.documentAnswer && fullDocument(answer);
    const previous = (config.previous || []).map(id => answers[id] || '');
    const source = documentAnswer ? answer : config.documentAnswer && [...previous].reverse().find(fullDocument) || config.html;
    const parsed = new DOMParser().parseFromString(source || '<body></body>', 'text/html');
    parsed.querySelectorAll('script,object,embed,link,meta,base').forEach(element => element.remove());
    for (const element of parsed.querySelectorAll('*')) for (const attr of [...element.attributes]) {
      if (/^on/i.test(attr.name) || /^(?:src|srcset|href|action|formaction)$/i.test(attr.name)) element.removeAttribute(attr.name);
    }
    // Fixed dimensions keep image-dependent layout checks independent of external hosting.
    parsed.querySelectorAll('img').forEach(img => {
      img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000"><rect width="1500" height="1000" fill="#789"/></svg>');
    });
    document.head.append(...parsed.head.childNodes);
    document.body.replaceChildren(...parsed.body.childNodes);
    if (!documentAnswer) {
      const combined = previous.filter(value => !fullDocument(value)).concat(answer).join('\n');
      const css = combined.replace(/\/\*[\s\S]*?\*\//g, '');
      const style = document.createElement('style');
      style.textContent = css.includes('{') ? css : `${config.target || 'body'}{${css}}`;
      document.body.append(style);
    }
    const element = selector => { const value = typeof selector === 'string' ? document.querySelector(selector) : selector; assert(value, `${selector} が見つかりません。`); return value; };
    const h = {
      assert, document, window, answer, answers,
      all: selector => [...document.querySelectorAll(selector)],
      el: element,
      css: (selector, pseudo) => getComputedStyle(element(selector), pseudo),
      rules: selector => {
        const target = element(selector), found = [];
        const collect = rules => {
          for (const rule of rules) {
            if (rule.type === CSSRule.MEDIA_RULE && !matchMedia(rule.conditionText).matches) continue;
            if (rule.type === CSSRule.SUPPORTS_RULE && !CSS.supports(rule.conditionText)) continue;
            if (rule.selectorText) { try { if (target.matches(rule.selectorText)) found.push(rule); } catch {} }
            if (rule.cssRules) collect(rule.cssRules);
          }
        };
        for (const sheet of document.styleSheets) collect(sheet.cssRules);
        return found;
      },
      gradient: selector => {
        const value = getComputedStyle(element(selector)).backgroundImage;
        const type = value.match(/^(linear|radial)-gradient\(/)?.[1];
        assert(type, 'グラデーションを設定してください。');
        const parts = []; let depth = 0, start = value.indexOf('(') + 1;
        for (let i = start; i < value.length - 1; i++) {
          if (value[i] === '(') depth++;
          if (value[i] === ')') depth--;
          if (value[i] === ',' && depth === 0) { parts.push(value.slice(start,i).trim()); start = i + 1; }
        }
        parts.push(value.slice(start,-1).trim());
        let direction = 180;
        if (type === 'linear' && parts[0].startsWith('to ')) {
          const sides = parts.shift().slice(3).split(/\s+/).sort().join(' ');
          direction = {top:0,'right top':45,right:90,'bottom right':135,bottom:180,'bottom left':225,left:270,'left top':315}[sides];
        } else if (type === 'linear') {
          try { direction = CSSNumericValue.parse(parts[0]).to('deg').value; parts.shift(); } catch {}
        } else if (!/^rgba?\(/.test(parts[0])) parts.shift();
        const colors = parts.map(part => {
          const match = part.match(/^rgba?\(([^)]+)\)/);
          assert(match, 'グラデーションの色を確認してください。');
          const channels = match[1].split(',').map(Number);
          return {r:channels[0],g:channels[1],b:channels[2],a:channels[3] ?? 1};
        });
        return {type,direction:(direction % 360 + 360) % 360,colors};
      },
      rect: selector => element(selector).getBoundingClientRect(),
      near: (actual, expected, message, tolerance = 1.5) => assert(Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance, message),
      overlap: (a, b) => { a = element(a).getBoundingClientRect(); b = element(b).getBoundingClientRect(); return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; },
      hover: selector => {
        const style = document.createElement('style');
        const rewrite = rules => [...rules].map(rule => !rule.selectorText && rule.cssRules && !rule.keyText ? `${rule.conditionText ? '@media '+rule.conditionText : ''}{${rewrite(rule.cssRules)}}` : rule.cssText.replace(/:hover/g, '[data-grader-hover]')).join('\n');
        style.textContent = [...document.styleSheets].map(sheet => rewrite(sheet.cssRules)).join('\n'); document.body.append(style); element(selector).setAttribute('data-grader-hover', '');
      },
      polygon: selector => {
        const e = element(selector), rect = e.getBoundingClientRect(), clip = getComputedStyle(e).clipPath;
        if (!clip.startsWith('polygon(')) return [];
        const host = document.createElement('div'), probe = document.createElement('div');
        host.style.cssText = `position:fixed;left:0;top:0;width:${rect.width}px;height:${rect.height}px;visibility:hidden`;
        probe.style.position = 'absolute'; host.append(probe); document.body.append(host);
        try { return clip.slice(8,-1).split(',').map(point => {
          const parts = point.trim().match(/calc\([^)]*\)|[^\s]+/g) || [];
          if (parts.length !== 2) throw new Error('図形の頂点を確認してください。');
          probe.style.left = parts[0]; probe.style.top = parts[1]; const r = probe.getBoundingClientRect(); return [r.left,r.top];
        }); } finally { host.remove(); }
      },
      animations: selector => element(selector).getAnimations({ subtree: true }),
      sample: (animation, fraction) => { animation.pause(); animation.currentTime = Number(animation.effect.getTiming().duration) * fraction; },
      frame: () => new Promise(resolve => setTimeout(resolve, 32))
    };
    await h.frame();
    const check = new Function('h', `return (async()=>{${scenario.check || config.check}})()`);
    await check(h);
    parent.postMessage({ token, passed: true, checks }, '*');
  } catch (error) { parent.postMessage({ token, passed: false, checks, message: error.message }, '*'); }
}

export async function gradeRenderedAnswer(item, answer, answers = {}) {
  const rule = item.grading;
  const result = { itemId: item.id, passed: true, feedback: '正解です。', checks: [] };
  for (const scenario of rule.config.cases || [{}]) {
    const outcome = await new Promise(resolve => {
      const frame = document.createElement('iframe');
      const token = crypto.randomUUID(), nonce = crypto.randomUUID();
      frame.tabIndex = -1; frame.setAttribute('sandbox', 'allow-scripts'); frame.setAttribute('aria-hidden', 'true');
      frame.style.cssText = `position:fixed;left:-20000px;top:0;border:0;width:${scenario.width || 1200}px;height:${scenario.height || 900}px;pointer-events:none`;
      let timeout;
      const finish = value => { clearTimeout(timeout); window.removeEventListener('message', receive); frame.remove(); resolve(value); };
      const receive = event => { if (event.source === frame.contentWindow && event.data?.token === token) finish(event.data); };
      window.addEventListener('message', receive);
      timeout = setTimeout(() => finish({ passed: false, message: '表示の採点がタイムアウトしました。CSSを確認して、もう一度採点してください。' }), 5000);
      frame.srcdoc = renderDocument(rule.config, codeSource(answer), answers, scenario, token, nonce);
      document.body.append(frame);
    });
    result.checks.push(...(outcome.checks || []));
    if (!outcome.passed) { result.passed = false; result.feedback = outcome.message || rule.feedback; break; }
  }
  return result;
}
import { codeSource } from './editor-files.mjs';

