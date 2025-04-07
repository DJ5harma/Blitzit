import { FileTree } from '../Components/FileTree/FileTree';
import { FileTreeNavbar } from '../Components/FileTree/FileTreeNavbar';
import { Editor } from '../Components/Editor/Editor';
import { EditorTabs } from '../Components/Editor/EditorTabs';
import { Terminal } from '../Components/Terminal/Terminal';
import { FilesProvider } from '../Providers/FilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';
import { useEffect, useState } from 'react';
import { ResizableWrapper } from '../Wrappers/ResizableWrapper';
import { TerminalProvider } from '../Providers/TerminalProvider';

export const Room = () => {
    const [hidden, setHidden] = useState({ fileTree: false, terminal: false });

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!e.ctrlKey) return;
            if (e.key === '`') {
                e.preventDefault();
                setHidden((p) => ({ ...p, terminal: !p.terminal }));
            } else if (e.key.toLowerCase() === 'b') {
                e.preventDefault();
                setHidden((p) => ({ ...p, fileTree: !p.fileTree }));
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <RoomProvider>
            <FilesProvider>
                <div className="w-screen h-screen flex overflow-hidden">
                    <div style={{ width: 70 }}>
                        <FileTreeNavbar setHidden={setHidden} />
                    </div>
                    <div
                        style={{ width: 'calc(100% - 70px)' }}
                        className="h-full"
                    >
                        <TerminalProvider>
                            <ResizableWrapper
                                child1={!hidden.fileTree && <FileTree />}
                                initial={300}
                                child2={
                                    <div className="flex flex-col w-full h-full">
                                        <EditorTabs />
                                        <ResizableWrapper
                                            child1={<Editor />}
                                            axis="y"
                                            child2={
                                                !hidden.terminal && <Terminal />
                                            }
                                            initial={600}
                                        />
                                    </div>
                                }
                            />
                        </TerminalProvider>
                    </div>
                </div>
            </FilesProvider>
        </RoomProvider>
    );
};
