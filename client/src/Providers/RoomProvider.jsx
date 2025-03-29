import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { useParams } from 'react-router-dom';

const context = createContext();

export const RoomProvider = ({ children }) => {
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
                });
                skt.emit('connectMainTerminal', {
                    mainTerminalId,
                });
                skt.emit('connectFileTreeTerminal', {
                    fileTreeTerminalId,
                });
                setTerminalsConnected(true);
            }
        );
    }, [roomId, skt, terminalsConnected]);

    if (!terminalsConnected) return <>getting all the terminal ids....</>;

    return (
        <context.Provider
            value={{
                callForTree,
                roomId,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const useRoom = () => useContext(context);
