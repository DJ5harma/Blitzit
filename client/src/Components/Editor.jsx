import MonacoEditor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';
import { IoClose } from 'react-icons/io5';
import { useSocket } from '../Providers/SocketProvider';
import { IoMdSave } from 'react-icons/io';

export const Editor = () => {
    const { skt } = useSocket();
    const { openFiles, closeFile } = useOpenFiles();
    const fileKeys = Object.keys(openFiles);
    const [fileName, setFileName] = useState('');

    const file = fileName ? openFiles[fileName] : null;

    const editorContentRef = useRef(file ? file.value : null);

    const saveFile = () => {
        if (!file || !editorContentRef.current) return;
        skt.emit('connectEditorTerminal -i2', {
            input: `echo "${editorContentRef.current}" > ` + file.path,
        });
        alert('File saved!');
    };

    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#1e1e1e',
                color: '#fff',
                fontFamily: 'sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    background: '#333',
                    padding: 6,
                    borderBottom: '1px solid #444',
                }}
            >
                {fileKeys.map((name) => (
                    <div
                        key={name}
                        disabled={fileName === name}
                        onClick={() => setFileName(name)}
                        style={{
                            padding: '8px 8px 8px 12px',
                            marginRight: 8,
                            border: 'solid 1px gray',
                            background: fileName === name ? 'black' : '#2d2d2d',
                            color: '#fff',
                            cursor: fileName === name ? 'default' : 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {name}
                        <IoClose
                            onClick={(e) => {
                                closeFile(name);
                                e.stopPropagation();
                            }}
                            color="black"
                            style={{
                                backgroundColor: 'rgb(220,220,220)',
                                padding: 2,
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderRadius: 5,
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ flex: 1 }}>
                {file ? (
                    <>
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
                            style={{ height: '100%', width: '100%' }}
                            onChange={(content) => {
                                editorContentRef.current = content;
                                console.log({ change: content });
                            }}
                        />
                        <button
                            onClick={saveFile}
                            title={'save ' + file.name}
                            style={{
                                position: 'fixed',
                                top: '20vh',
                                right: 10,
                                zIndex: 20,
                                border: 'solid 2px',
                            }}
                        >
                            <IoMdSave size={25} />
                        </button>
                    </>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#aaa',
                            fontSize: '1.2rem',
                        }}
                    >
                        No file selected.
                    </div>
                )}
            </div>
        </div>
    );
};
