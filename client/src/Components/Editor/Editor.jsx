import MonacoEditor from '@monaco-editor/react';
import { UseFiles } from '../../Providers/FilesProvider';
import { UseRoom } from '../../Providers/RoomProvider';
import { getYText, useYjsBinding } from './YjsBinding.js';
import { getLanguageFromFilePath } from '../../Utils/getLanguageFromFilePath';

export const Editor = () => {
    const { focusedPath, pathToContent, setPathToContent } = UseFiles();
    const { roomId } = UseRoom();

    // Sync to Yjs
    const initialContent = pathToContent[focusedPath];
    useYjsBinding(focusedPath, roomId, setPathToContent, initialContent);

    return (
        <div className="button h-full">
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
                            // Prevent echo loop
                            yText.delete(0, yText.length);
                            yText.insert(0, content);
                        }
                    }}
                />
            ) : (
                <div className="h-full flex items-center justify-center text-neutral-300 text-xl select-none">
                    No file selected... choose one from the file tree.
                </div>
            )}
        </div>
    );
};
