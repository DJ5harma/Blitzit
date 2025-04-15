import React from 'react';
import { Editor } from './Editor';
import { EditorTabs } from './EditorTabs';
import { UseFiles } from '../../Providers/FilesProvider';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const EditorTabsPane = () => {
    const { editorStates, setActiveEditorIndex } = UseFiles();

    return (
        <PanelGroup 
            autoSaveId="editor-panes" 
            direction="horizontal"
            className="h-full w-full"
        >
            {editorStates.map((state, idx) => (
                <React.Fragment key={idx}>
                    <Panel 
                        defaultSize={100 / editorStates.length}
                        minSize={25}
                        className={`h-full ${idx !== 0 ? 'border-l border-gray-700' : ''}`}
                    >
                        <div 
                            className="h-full w-full"
                            onClick={() => setActiveEditorIndex(idx)}
                        >
                            <EditorTabs editorIndex={idx} />
                            <Editor editorIndex={idx} />
                        </div>
                    </Panel>
                    
                    {idx < editorStates.length - 1 && (
                        <PanelResizeHandle className="w-1 hover:bg-blue-500 transition-colors">
                            <div className="w-full h-full" />
                        </PanelResizeHandle>
                    )}
                </React.Fragment>
            ))}
        </PanelGroup>
    );
};

export default EditorTabsPane;