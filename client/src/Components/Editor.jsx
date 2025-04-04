import MonacoEditor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { IoClose } from 'react-icons/io5';
import { useSocket } from '../Providers/SocketProvider';
import { useEffect } from 'react';
import { EMITTER } from '../Utils/EMITTER';

export const Editor = () => {
    const { skt } = useSocket();
    const { openFiles, closeFile, saveFlag } = useOpenFiles();
    const fileKeys = Object.keys(openFiles);
    const [fileName, setFileName] = useState('');

    const file = fileName ? openFiles[fileName] : null;

    const editorContentRef = useRef(file ? file.value : '');

    useEffect(() => {
        if (!file || !editorContentRef.current) return;

        // bash escapes
        editorContentRef.current.replaceAll(`"`, `\\"`);
        editorContentRef.current.replaceAll('`', '\\`');

        EMITTER.saveFile(editorContentRef.current, file.path);
        // skt.emit('connectEditorTerminal -i2', {
        //     input: `echo '${editorContentRef.current}' > ` + file.path,
        // });

        alert(`"${file.path}" saved!`);
    }, [file, saveFlag, skt]);

    return (
        <div className="h-full flex flex-col text-white">
            <div className="flex bg-neutral-600 p-1">
                {fileKeys.map((name) => (
                    <div
                        key={name}
                        disabled={fileName === name}
                        onClick={() => setFileName(name)}
                        className="flex items-center gap-2 p-2 border border-gray-500 text-white rounded-lg"
                        style={{
                            background: fileName === name ? 'black' : '#2d2d2d',
                            cursor: fileName === name ? 'default' : 'pointer',
                        }}
                    >
                        {name}
                        <IoClose
                            onClick={(e) => {
                                closeFile(name);
                                e.stopPropagation();
                            }}
                            color="black"
                            className="flex items-center cursor-pointer rounded-sm p-0.5 bg-neutral-200"
                        />
                    </div>
                ))}
            </div>

            <div className="h-full">
                {file ? (
                    <MonacoEditor
                        theme="vs-dark"
                        path={file.name}
                        defaultLanguage={file.language}
                        value={file.value}
                        options={{
                            'semanticHighlighting.enabled': true,
                            dragAndDrop: true,
                            minimap: true,
                            wordWrap: true,
                            fontSize: 20,
                        }}
                        onChange={(content) => {
                            editorContentRef.current = content;
                            console.log({ change: content });
                        }}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-neutral-300 text-xl">
                        No file selected... choose one from the file tree.
                    </div>
                )}
            </div>
        </div>
    );
};
