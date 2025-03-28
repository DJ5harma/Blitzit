import { useParams } from 'react-router-dom';
import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { createContext, useContext, useEffect, useState } from 'react';
import { Editor } from '../Components/Editor';
import { useSocket } from '../Providers/SocketProvider';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';

const context = createContext();

export const Room = () => {
    const { roomId } = useParams();
    const { skt } = useSocket();

    const [terminalsConnected, setTerminalsConnected] = useState(false);

    function callForTree() {
        skt.emit('connectFileTreeTerminal -i1', { input: 'find /app -type d' });
        setTimeout(() => {
            skt.emit('connectFileTreeTerminal -i1', {
                input: 'find /app -type f',
            });
        }, 400);
    }

    useEffect(() => {
        if (terminalsConnected) return;
        skt.emit(
            'getRoomDetails',
            { roomId },
            ({
                mainTerminalId,
                fileTreeTerminalId,
                editorTerminalId,
                containerId,
            }) => {
                console.log({
                    mainTerminalId,
                    fileTreeTerminalId,
                    editorTerminalId,
                    containerId,
                });

                skt.emit('connectEditorTerminal', {
                    editorTerminalId,
                    containerId,
                });
                skt.emit('connectMainTerminal', {
                    mainTerminalId,
                    containerId,
                });
                skt.emit('connectFileTreeTerminal', {
                    fileTreeTerminalId,
                    containerId,
                });
                setTerminalsConnected(true);
            }
        );
    }, [roomId, skt, terminalsConnected]);

    if (!terminalsConnected) return <>getting all the terminal ids....</>;

    return (
        <OpenFilesProvider>
            <context.Provider
                value={{
                    callForTree,
                    roomId,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100vw',
                        height: '100vh',
                    }}
                >
                    <div style={{ height: '70vh', display: 'flex' }}>
                        <div style={{ height: '100%', width: '30vw' }}>
                            <FileTree />
                        </div>
                        <div
                            style={{
                                height: '100%',
                                width: '70vw',
                                border: 'solid green',
                            }}
                        >
                            <Editor />
                        </div>
                    </div>
                    <div style={{ height: '30vh' }}>
                        <Terminal />
                    </div>
                </div>
            </context.Provider>
        </OpenFilesProvider>
    );
};

export const useRoom = () => useContext(context);
