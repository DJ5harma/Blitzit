import React from 'react';
import { Editor } from './Editor';
import { EditorTabs } from './EditorTabs';
import { UseFiles } from '../../Providers/FilesProvider';

const EditorTabsPane = () => {
  const { editorStates, setActiveEditorIndex } = UseFiles();
  
  return (
    <div className="h-full w-full flex overflow-scroll">
      {editorStates.map((p, idx) => (
        <div 
          key={idx}
          className={` h-full ${editorStates.length === 1 ? 'w-full' : 'flex-1 min-w-[300px]'} ${idx !== 0 ? 'border-l border-gray-700' : ''}`}
          onClick={() => setActiveEditorIndex(idx)}
        >
          <EditorTabs editorIndex={idx} />
          <Editor editorIndex={idx} />
        </div>
      ))}
    </div>
  );
};

export default EditorTabsPane;
