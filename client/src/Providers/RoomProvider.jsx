import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useHomeContext } from './HomeProvider';

const context = createContext();

export const RoomProvider = ({ children }) => {
    const { roomId } = useParams();
    const { addProject } = useHomeContext();

    const { skt } = useSocket();

    const [terminalsConnected, setTerminalsConnected] = useState(false);
    const [project, setProject] = useState({
        title: 'Loading title...',
    });

    useEffect(() => {
        if (terminalsConnected) return;

        skt.emit(
            'getRoomDetails',
            { roomId },
            ({
                editorTerminalId,
                mainTerminalId,
                fileTreeTerminalId,
                title,
                createdAt
            }) => {
                addProject(title, roomId, createdAt);
                setProject((p) => ({ ...p, title }));

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
                                        console.log('File terminal connected');
                                        setTerminalsConnected(true);
                                        toast.success('Terminals connected!');
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }, [roomId, skt, terminalsConnected]);

    if (!terminalsConnected) return <>Connecting all the terminals....</>;

    return (
        <context.Provider
            value={{
                roomId,
                project,
            }}
        >
            {children}
        </context.Provider>
    );
};

export const useRoom = () => useContext(context);
