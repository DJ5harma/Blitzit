import { useParams } from 'react-router-dom';
import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { createContext, useContext } from 'react';
import { Editor } from '../Components/Editor';
import { useSocket } from '../Providers/SocketProvider';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';

const context = createContext();

export const Room = () => {
    const { roomId: containerId } = useParams();
    const { skt } = useSocket();

    function callForTree() {
        skt.emit('connectFileTreeTerminal -i1', { input: 'find /app -type d' });
        setTimeout(() => {
            skt.emit('connectFileTreeTerminal -i1', { input: 'find /app -type f' });
        }, 400);
    }

    return (
        <OpenFilesProvider>
            <context.Provider value={{ callForTree }}>
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
                            <FileTree containerId={containerId} />
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
                        <Terminal containerId={containerId} />
                    </div>
                </div>
            </context.Provider>
        </OpenFilesProvider>
    );
};

export const useRoom = () => useContext(context);
