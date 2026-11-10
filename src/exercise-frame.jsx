import React, { useEffect, useRef } from 'react';
import { Button } from '../vendor/tutorialkit/react/Button.tsx';

export function exerciseDocument(html) {
  return '<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><style>body{margin:0;padding:16px;font-family:system-ui,sans-serif;color:#0f1419;background:#fff}p{font-size:24px;line-height:1.6;overflow-wrap:anywhere}</style>' + html;
}

export function readExercise(frame, selector) {
  const target = frame?.contentDocument?.querySelector(selector);
  if (!target) return null;
  const style = frame.contentWindow.getComputedStyle(target);
  return { text: target.textContent, color: style.color, visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && target.getBoundingClientRect().height > 0 };
}

export function ExerciseFrame({ item, answers, frameRef, onChange, saving }) {
  const timer = useRef(), latest = useRef(), resetting = useRef(false);
  latest.current = { onChange, saving };
  useEffect(() => () => clearInterval(timer.current), []);
  const config = item.grading.config;
  function initialize() {
    clearInterval(timer.current);
    if (item.type !== 'dom_task') return;
    const target = frameRef.current.contentDocument.querySelector(config.selector);
    const prior = answers[config.previous];
    const saved = answers[item.id];
    const initialText = prior?.text || config.initialText;
    const restored = !resetting.current && saved && typeof saved.text === 'string' && (!prior?.text || saved.text === prior.text) ? saved : null;
    target.textContent = restored?.text ?? initialText;
    target.style.color = restored?.color ?? prior?.color ?? config.initialColor;
    const initial = readExercise(frameRef.current, config.selector);
    if (resetting.current) { latest.current.onChange(item, initial); resetting.current = false; }
    let last = JSON.stringify(initial);
    // Stylesheet edits in DevTools change computed styles without a DOM mutation.
    timer.current = setInterval(() => {
      if (latest.current.saving) return;
      const value = readExercise(frameRef.current, config.selector);
      if (value && JSON.stringify(value) !== last) { last = JSON.stringify(value); latest.current.onChange(item, value); }
    }, 250);
  }
  return <div className="exercise-page">
    <iframe ref={frameRef} title="実習ページ" sandbox="allow-same-origin" srcDoc={exerciseDocument(config.exerciseHtml)} onLoad={initialize} />
    {item.type === 'dom_task' && <div className="flex justify-end mt-2"><Button variant="secondary" type="button" disabled={saving} onClick={() => { resetting.current = true; frameRef.current.srcdoc = exerciseDocument(config.exerciseHtml); }}>リセット</Button></div>}
  </div>;
}
