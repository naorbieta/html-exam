// Adapted from TutorialKit's default Astro components; see vendor/tutorialkit/SOURCE.json.
import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import resizeStyles from '../vendor/tutorialkit/react/styles/resize-panel.module.css';

export const topBarButton = 'flex items-center text-2xl text-tk-elements-topBar-iconButton-iconColor hover:text-tk-elements-topBar-iconButton-iconColorHover transition-theme bg-tk-elements-topBar-iconButton-backgroundColor hover:bg-tk-elements-topBar-iconButton-backgroundColorHover p-1 rounded-md';

export function TutorialLayout({ title, actions, navigation, progress, content, editor, results, mobileView, setMobileView }) {
  return <div className="h-full flex flex-col bg-tk-elements-app-backgroundColor text-tk-elements-app-textColor">
    <nav className="bg-tk-elements-topBar-backgroundColor transition-theme border-b border-tk-elements-app-borderColor flex max-w-full items-center p-3 px-4 min-h-[56px]">
      <div className="flex flex-1 font-semibold text-tk-elements-topBar-logo-color">{title}</div>
      <div className="flex items-center gap-2">{actions}</div>
    </nav>
    <main className="flex-1 min-h-0 relative overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full" autoSaveId="practice-main" id="practice-main">
        <Panel defaultSize={40} minSize={30} maxSize={60} className={`h-full flex flex-col ${mobileView === 'editor' ? 'max-sm:hidden' : ''}`}>
          {navigation}
          <div className="flex-1 min-h-0 overflow-auto scrollbar-transparent p-6 sm:p-8">{content}</div>
        </Panel>
        <PanelResizeHandle className={`${resizeStyles.PanelResizeHandle} hidden sm:block`} />
        <Panel defaultSize={60} minSize={40} className={`h-full flex flex-col sm:border-l border-tk-elements-app-borderColor ${mobileView === 'content' ? 'max-sm:hidden' : ''}`}>
          {progress}
          <div className="flex-1 min-h-0 overflow-auto">{editor}</div>
          {results}
        </Panel>
      </PanelGroup>
    </main>
    <div className="sm:hidden h-12 flex-shrink-0 transition-theme bg-tk-elements-app-backgroundColor border-t border-tk-elements-app-borderColor flex justify-center items-center text-tk-elements-app-textColor">
      <button type="button" onClick={() => setMobileView('content')} aria-pressed={mobileView === 'content'}>問題</button>
      <button type="button" aria-label="問題と解答を切り替える" className="rounded-full w-8 h-4 p-0.5 bg-gray-4 dark:bg-gray-6 mx-2 relative" onClick={() => setMobileView(mobileView === 'content' ? 'editor' : 'content')}>
        <span className={`inline-block transition-all absolute top-0.5 rounded-full bg-white dark:bg-gray-2 w-3 h-3 ${mobileView === 'content' ? 'left-0.5' : 'left-[calc(100%-0.75rem-0.125rem)]'}`} />
      </button>
      <button type="button" onClick={() => setMobileView('editor')} aria-pressed={mobileView === 'editor'}>解答</button>
    </div>
  </div>;
}
