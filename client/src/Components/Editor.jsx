import MonacoEditor from '@monaco-editor/react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { useRoom } from '../Providers/RoomProvider';
import { getYText, useYjsBinding } from '../hooks/YjsBinding';

export const Editor = () => {
    const { focusedPath, pathToContent, setPathToContent } = useOpenFiles();
    const { roomId } = useRoom();

    // Sync to Yjs
    const initialContent = pathToContent[focusedPath];
    useYjsBinding(focusedPath, roomId, setPathToContent, initialContent);

    return (
        <div className="h-full">
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
                    }}
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
