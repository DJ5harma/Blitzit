import MonacoEditor from '@monaco-editor/react';
import { UseFiles } from '../../Providers/FilesProvider';
import { UseRoom } from '../../Providers/RoomProvider';
import { getYText, useYjsBinding } from './YjsBinding.js';
import { getLanguageFromFilePath } from '../../Utils/getLanguageFromFilePath';

export const Editor = ({ editorIndex = 0 }) => {
    const { editorStates, pathToContent, setPathToContent } = UseFiles();
    const { roomId } = UseRoom();
    
    const editorState = editorStates[editorIndex];
    const focusedPath = editorState?.focusedPath;
    const initialContent = focusedPath ? pathToContent[focusedPath] : '';
    
    useYjsBinding(focusedPath, roomId, setPathToContent, initialContent);

    return (
        <div className="button" style={{height : `calc(100% - 45px)`}}>
            {focusedPath ? (
                <MonacoEditor
                    theme="vs-dark"
                    path={focusedPath}
                    value={initialContent}
                    options={{
                        semanticHighlighting: true,
                        dragAndDrop: true,
                        minimap: true,
                        wordWrap: 'on',
                        fontSize: 20,
                        codeLens: true,
                        wordBasedSuggestions: true,
                        autoClosingQuotes: true,
                    }}
                    language={getLanguageFromFilePath(focusedPath)}
                    onChange={(content) => {
                        setPathToContent((prev) => ({
                            ...prev,
                            [focusedPath]: content,
                        }));

                        const yText = getYText(focusedPath, roomId);
                        if (yText && content !== yText.toString()) {
                            yText.delete(0, yText.length);
                            yText.insert(0, content);
                        }
                    }}
                    loading={<>Loading {focusedPath}...</>}
                />
            ) : (
                <div className="h-full flex items-center justify-center text-neutral-300 text-xl select-none">
                    No file selected... choose one from the file tree.
                </div>
            )}
        </div>
    );
};