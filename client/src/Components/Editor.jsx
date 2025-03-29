import MonacoEditor from '@monaco-editor/react';
import { useState } from 'react';
import { useOpenFiles } from '../Providers/OpenFilesProvider';

export const Editor = () => {
    const { openFiles } = useOpenFiles();
    const fileKeys = Object.keys(openFiles);

    const [fileName, setFileName] = useState('');

    const file = fileName ? openFiles[fileName] : null;

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
                    padding: '10px',
                    borderBottom: '1px solid #444',
                }}
            >
                {fileKeys.map((name) => (
                    <button
                        key={name}
                        disabled={fileName === name}
                        onClick={() => setFileName(name)}
                        style={{
                            padding: '8px 16px',
                            marginRight: '8px',
                            border: 'none',
                            background: fileName === name ? '#555' : '#2d2d2d',
                            color: '#fff',
                            cursor: fileName === name ? 'default' : 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.3s ease',
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div style={{ flex: 1 }}>
                {file ? (
                    <MonacoEditor
                        theme="vs-dark"
                        path={file.name}
                        defaultLanguage={file.language}
                        defaultValue={file.value}
                        options={{
                            'semanticHighlighting.enabled': true,
                            dragAndDrop: true,
                            minimap: true,
                            wordWrap: true,
                        }}
                        style={{ height: '100%', width: '100%' }}
                    />
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
