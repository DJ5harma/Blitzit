import { Fragment } from 'react';
import { UseFiles } from '../../Providers/FilesProvider';
import { Editor } from './Editor';
import { EditorTabs } from './EditorTabs';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const EditorPacker = () => {
    const { editors, setFocusedEditorIndex } = UseFiles();

    return (
        <div className="h-full flex w-full">
            <PanelGroup
                autoSaveId="editor-panes"
                direction="horizontal"
                className="h-full w-full"
            >
                {editors.length === 0 && (
                    <div className="h-full w-full flex items-center justify-center bg-blue-950 text-neutral-300 text-xl select-none">
                        No file selected... choose one from the file tree.
                    </div>
                )}
                {editors.map((_, i) => {
                    return (
                        <Fragment key={i}>
                            <Panel
                                defaultSize={100 / editors.length}
                                minSize={25}
                                className={`h-full ${
                                    i !== 0 ? 'border-l border-gray-700' : ''
                                }`}
                                id={`editor-panel-${i}`}
                            >
                                <div
                                    onClick={() => setFocusedEditorIndex(i)}
                                    className="h-full flex-1"
                                    key={i}
                                >
                                    <EditorTabs editorIndex={i} />
                                    <Editor editorIndex={i} />
                                </div>
                            </Panel>
                            {i < editors.length - 1 && (
                                <PanelResizeHandle className="w-1 hover:bg-blue-500 transition-colors">
                                    <div className="w-full h-full" />
                                </PanelResizeHandle>
                            )}
                        </Fragment>
                    );
                })}
            </PanelGroup>
        </div>
    );
};
