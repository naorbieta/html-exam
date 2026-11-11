import { acceptCompletion, autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentLess, insertTab, temporarilySetTabFocusMode } from '@codemirror/commands';
import { bracketMatching, foldGutter, indentOnInput, indentUnit } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { Compartment, EditorSelection, EditorState, type Extension } from '@codemirror/state';
import {
  EditorView,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  scrollPastEnd,
} from '@codemirror/view';
import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from 'react';
import { classNames } from '../../utils/classnames.js';
import { debounce } from '../../utils/debounce.js';
import type { Theme } from '../types.js';
import { BinaryContent } from './BinaryContent.js';
import { getTheme, reconfigureTheme } from './cm-theme.js';
import { getLanguage } from './languages.js';

export interface EditorDocument {
  value: string | Uint8Array;
  loading: boolean;
  readOnly?: boolean;
  filePath: string;
  scroll?: ScrollPosition;
}

export interface EditorSettings {
  fontSize?: string;
  tabSize?: number;
}

type TextEditorDocument = EditorDocument & {
  value: string;
};

export interface ScrollPosition {
  top: number;
  left: number;
}

export interface EditorUpdate {
  selection: EditorSelection;
  content: string;
}

export type OnChangeCallback = (update: EditorUpdate) => void;
export type OnScrollCallback = (position: ScrollPosition) => void;

interface Props {
  label?: string;
  theme: Theme;
  id?: unknown;
  doc?: EditorDocument;
  debounceChange?: number;
  debounceScroll?: number;
  autoFocusOnDocumentChange?: boolean;
  onChange?: OnChangeCallback;
  onScroll?: OnScrollCallback;
  className?: string;
  settings?: EditorSettings;
}

type EditorStates = Map<string, EditorState>;

function isComposing(view: EditorView) {
  return view.composing || view.compositionStarted;
}

function markComposing(view: EditorView, composing: boolean) {
  view.dom.setAttribute('data-composing', composing ? 'true' : 'false');
}

export function CodeMirrorEditor({
  label = "コードの解答",
  id,
  doc,
  debounceScroll = 100,
  debounceChange = 0,
  autoFocusOnDocumentChange = false,
  onScroll,
  onChange,
  theme,
  settings,
  className = '',
}: Props) {
  const [language] = useState(new Compartment());
  const [readOnly] = useState(new Compartment());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView>();
  const themeRef = useRef<Theme>();
  const docRef = useRef<EditorDocument>();
  const editorStatesRef = useRef<EditorStates>();
  const onScrollRef = useRef(onScroll);
  const onChangeRef = useRef(onChange);
  const lastFileRef = useRef<string>();
  const languagePathRef = useRef<string>();
  const pendingCompositionSync = useRef(false);
  const syncFromPropsRef = useRef<() => void>(() => {});

  const isBinaryFile = doc?.value instanceof Uint8Array;

  onScrollRef.current = onScroll;
  onChangeRef.current = onChange;
  docRef.current = doc;
  themeRef.current = theme;

  syncFromPropsRef.current = () => {
    const view = viewRef.current;
    const editorStates = editorStatesRef.current;
    const current = docRef.current;
    const currentTheme = themeRef.current;
    if (!view || !editorStates || !currentTheme) {
      return;
    }
    syncEditorFromProps({
      view,
      doc: current,
      theme: currentTheme,
      settings,
      language,
      readOnly,
      label,
      onScrollRef,
      debounceScroll,
      editorStates,
      autoFocusOnDocumentChange,
      lastFileRef,
      languagePathRef,
    });
  };

  useEffect(() => {
    const onUpdate = debounce((update: EditorUpdate) => {
      onChangeRef.current?.(update);
    }, debounceChange);

    const view = new EditorView({
      parent: containerRef.current!,
      dispatchTransactions(transactions) {
        const previousSelection = view.state.selection;

        view.update(transactions);

        const newSelection = view.state.selection;

        const selectionChanged =
          newSelection !== previousSelection &&
          (newSelection === undefined || previousSelection === undefined || !newSelection.eq(previousSelection));

        markComposing(view, isComposing(view));

        if (
          docRef.current &&
          !docRef.current.loading &&
          (transactions.some((transaction) => transaction.docChanged) || selectionChanged)
        ) {
          onUpdate({
            selection: view.state.selection,
            content: view.state.doc.toString(),
          });

          editorStatesRef.current!.set(docRef.current.filePath, view.state);
        }
      },
    });

    markComposing(view, false);
    viewRef.current = view;

    const retryAfterComposition = () => {
      markComposing(view, isComposing(view));
      if (!pendingCompositionSync.current) {
        return;
      }
      pendingCompositionSync.current = false;
      syncFromPropsRef.current();
    };
    view.contentDOM.addEventListener('compositionend', retryAfterComposition);

    // we grab the style tag that codemirror mounts
    const codemirrorStyleTag = document.head.children[0];
    codemirrorStyleTag.setAttribute('data-astro-transition-persist', 'codemirror');

    return () => {
      view.contentDOM.removeEventListener('compositionend', retryAfterComposition);
      viewRef.current?.destroy();
      viewRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    viewRef.current.dispatch({
      effects: [reconfigureTheme(theme)],
    });
  }, [theme]);

  useEffect(() => {
    editorStatesRef.current = new Map<string, EditorState>();
    lastFileRef.current = undefined;
    languagePathRef.current = undefined;
  }, [id]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) {
      return;
    }
    if (doc && !(doc.value instanceof Uint8Array) && lastFileRef.current === doc.filePath && isComposing(view)) {
      pendingCompositionSync.current = true;
      return;
    }
    pendingCompositionSync.current = false;
    syncFromPropsRef.current();
  }, [id, doc?.value, doc?.filePath, doc?.loading, doc?.readOnly, autoFocusOnDocumentChange]);

  return (
    <div className={classNames('relative', className)}>
      {isBinaryFile && <BinaryContent />}
      <div className="h-full overflow-hidden" ref={containerRef} />
    </div>
  );
}

export default CodeMirrorEditor;

CodeMirrorEditor.displayName = 'CodeMirrorEditor';

function syncEditorFromProps({
  view,
  doc,
  theme,
  settings,
  language,
  readOnly,
  label,
  onScrollRef,
  debounceScroll,
  editorStates,
  autoFocusOnDocumentChange,
  lastFileRef,
  languagePathRef,
}: {
  view: EditorView;
  doc?: EditorDocument;
  theme: Theme;
  settings?: EditorSettings;
  language: Compartment;
  readOnly: Compartment;
  label: string;
  onScrollRef: MutableRefObject<OnScrollCallback | undefined>;
  debounceScroll: number;
  editorStates: EditorStates;
  autoFocusOnDocumentChange: boolean;
  lastFileRef: RefObject<string | undefined>;
  languagePathRef: RefObject<string | undefined>;
}) {
  if (!doc) {
    lastFileRef.current = undefined;
    setNoDocument(view);
    return;
  }

  if (doc.value instanceof Uint8Array) {
    return;
  }

  // Replacing the EditorView state mid-composition immediately commits IME text.
  if (lastFileRef.current === doc.filePath && isComposing(view)) {
    return;
  }

  const switchingFile = lastFileRef.current !== doc.filePath;
  let state = editorStates.get(doc.filePath);

  if (!state) {
    state = newEditorState(doc.value, theme, settings, onScrollRef, debounceScroll, label, [
      language.of([]),
      readOnly.of([EditorState.readOnly.of(doc.loading || !!doc.readOnly), EditorView.contentAttributes.of({ 'aria-readonly': String(!!doc.readOnly) })]),
    ]);

    editorStates.set(doc.filePath, state);
  }

  if (switchingFile) {
    view.setState(state);
    lastFileRef.current = doc.filePath;
  }

  setEditorDocument(view, theme, language, readOnly, autoFocusOnDocumentChange && switchingFile, doc as TextEditorDocument, languagePathRef);
}

function newEditorState(
  content: string,
  theme: Theme,
  settings: EditorSettings | undefined,
  onScrollRef: MutableRefObject<OnScrollCallback | undefined>,
  debounceScroll: number,
  label: string,
  extensions: Extension[],
) {
  return EditorState.create({
    doc: content,
    extensions: [
      EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false' }),
      EditorState.changeFilter.of(transaction => transaction.newDoc.length <= 20000),
      EditorView.domEventHandlers({
        scroll: debounce((_event, view) => {
          onScrollRef.current?.({ left: view.scrollDOM.scrollLeft, top: view.scrollDOM.scrollTop });
        }, debounceScroll),
        keydown: (event) => {
          if (event.code === 'KeyS' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
          }
        },
        compositionstart: (_event, view) => {
          markComposing(view, true);
        },
        compositionend: (_event, view) => {
          markComposing(view, false);
        },
      }),
      getTheme(theme, settings),
      history(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
        { key: 'Tab', run: acceptCompletion },
        { key: 'Tab', run: insertTab, shift: indentLess },
        { key: 'Escape', run: temporarilySetTabFocusMode },
      ]),
      indentUnit.of('\t'),
      autocompletion({
        closeOnBlur: false,
      }),
      closeBrackets(),
      lineNumbers(),
      scrollPastEnd(),
      dropCursor(),
      drawSelection(),
      bracketMatching(),
      EditorState.tabSize.of(settings?.tabSize ?? 2),
      indentOnInput(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      foldGutter({
        markerDOM: (open) => {
          const icon = document.createElement('div');

          icon.className = `fold-icon ${open ? 'i-ph-caret-down-bold' : 'i-ph-caret-right-bold'}`;

          return icon;
        },
      }),
      ...extensions,
    ],
  });
}

function setNoDocument(view: EditorView) {
  view.dispatch({
    selection: { anchor: 0 },
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: '',
    },
  });

  view.scrollDOM.scrollTo(0, 0);
}

function setEditorDocument(
  view: EditorView,
  theme: Theme,
  language: Compartment,
  readOnly: Compartment,
  autoFocus: boolean,
  doc: TextEditorDocument,
  languagePathRef: RefObject<string | undefined>,
) {
  if (doc.value !== view.state.doc.toString()) {
    view.dispatch({
      selection: { anchor: 0 },
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: doc.value,
      },
    });
  }

  view.dispatch({
    effects: [readOnly.reconfigure([EditorState.readOnly.of(doc.loading || !!doc.readOnly), EditorView.contentAttributes.of({ 'aria-readonly': String(!!doc.readOnly) })])],
  });

  if (languagePathRef.current === doc.filePath) {
    return;
  }
  languagePathRef.current = doc.filePath;

  getLanguage(doc.filePath).then((languageSupport) => {
    if (!languageSupport) {
      return;
    }

    view.dispatch({
      effects: [language.reconfigure([languageSupport]), reconfigureTheme(theme)],
    });

    requestAnimationFrame(() => {
      const currentLeft = view.scrollDOM.scrollLeft;
      const currentTop = view.scrollDOM.scrollTop;
      const newLeft = doc.scroll?.left ?? 0;
      const newTop = doc.scroll?.top ?? 0;

      const needsScrolling = currentLeft !== newLeft || currentTop !== newTop;

      if (autoFocus) {
        if (needsScrolling) {
          // we have to wait until the scroll position was changed before we can set the focus
          view.scrollDOM.addEventListener(
            'scroll',
            () => {
              view.focus();
            },
            { once: true },
          );
        } else {
          // if the scroll position is still the same we can focus immediately
          view.focus();
        }
      }

      view.scrollDOM.scrollTo(newLeft, newTop);
    });
  });
}
