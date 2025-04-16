import { FileTree } from '../Components/FileTree/FileTree';
import { FileTreeNavbar } from '../Components/FileTree/FileTreeNavbar';
import { Terminal } from '../Components/Terminal/Terminal';
import { FilesProvider } from '../Providers/FilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';
import { useEffect, useState } from 'react';
import { ResizableWrapper } from '../Wrappers/ResizableWrapper';
import { TerminalProvider } from '../Providers/TerminalProvider';
import { Search } from '../Components/Search/Search';
import { EditorPacker } from '../Components/Editor/EditorPacker';

export const Room = () => {
    const [hidden, setHidden] = useState({
        fileTree: false,
        terminal: false,
        search: true,
    });

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!e.ctrlKey) return;
            const key = e.key.toLowerCase();
            if (key === '`') {
                e.preventDefault();
                setHidden((p) => ({ ...p, terminal: !p.terminal }));
            } else if (key === 'b') {
                e.preventDefault();
                setHidden((p) => ({ ...p, fileTree: !p.fileTree }));
            } else if (key === 'f') {
                e.preventDefault();
                setHidden((p) => ({ ...p, search: !p.search }));
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <RoomProvider>
            <FilesProvider>
                <Search
                    hidden={hidden.search}
                    hide={() => setHidden((p) => ({ ...p, search: !p.search }))}
                />
                <TerminalProvider>
                    <div className="w-screen h-screen flex overflow-hidden">
                        <div style={{ width: 70 }}>
                            <FileTreeNavbar setHidden={setHidden} />
                        </div>
                        <div
                            style={{ width: 'calc(100% - 70px)' }}
                            className="h-full flex-1"
                        >
                            <ResizableWrapper
                                child1={!hidden.fileTree && <FileTree />}
                                initial={300}
                                child2={
                                    <div className="flex flex-col w-full h-full">
                                        <ResizableWrapper
                                            child1={<EditorPacker />}
                                            axis="y"
                                            child2={
                                                !hidden.terminal && <Terminal />
                                            }
                                            initial={600}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </TerminalProvider>
            </FilesProvider>
        </RoomProvider>
    );
};
