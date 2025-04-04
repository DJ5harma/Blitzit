import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { useParams } from 'react-router-dom';

const context = createContext();

export const RoomProvider = ({ children }) => {
    const { roomId } = useParams();

    const { skt } = useSocket();

    const [terminalsConnected, setTerminalsConnected] = useState(false);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (terminalsConnected) return;

        skt.emit('getRoomDetails', { roomId }, (roomData) => {
            if (!roomData) {
                console.error('Room details not received');
                return;
            }

            console.log('Room details:', roomData);

            setRoom(roomData);

            const { editorTerminalId, mainTerminalId, fileTreeTerminalId } =
                roomData;

            skt.emit(
                'connectEditorTerminal',
                {
                    editorTerminalId,
                },
                () => {
                    skt.emit(
                        'connectMainTerminal',
                        {
                            mainTerminalId,
                        },
                        () => {
                            skt.emit(
                                'connectFileTreeTerminal',
                                {
                                    fileTreeTerminalId,
                                },
                                () => {
                                    setTerminalsConnected(true);
                                }
                            );
                        }
                    );
                }
            );
        });
    }, [roomId, skt, terminalsConnected]);

    if (!terminalsConnected || !room)
        return <>Connecting all the terminals....</>;

    return (
        <context.Provider
            value={{
                roomId,
                room,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const useRoom = () => useContext(context);
