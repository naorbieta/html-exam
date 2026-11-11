import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDocument } from '../render-grader.mjs';
import { parseHTML } from 'linkedom/worker';

test('提出HTMLで採点フレームのスクリプトやCSPを抜けられない',()=>{
 const attack='</script><script>parent.postMessage({passed:true},"*")</script><img src="https://example.com/">';
 const source=renderDocument({htmlAnswer:true,check:'h.assert(true)'},attack,{}, {},'result-token','nonce-value');
 const {document}=parseHTML(source);
 assert.equal(document.querySelectorAll('script').length,1);
 assert.equal(document.querySelectorAll('img').length,0);
 assert.equal(document.querySelector('script').getAttribute('nonce'),'nonce-value');
 assert.match(document.querySelector('meta[http-equiv]').content,/default-src 'none'/);
 assert.match(document.querySelector('script').textContent,/\\u003c\/script/);
});
