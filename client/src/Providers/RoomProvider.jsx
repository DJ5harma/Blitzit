import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UseHome } from './HomeProvider';

const context = createContext();

export const RoomProvider = ({ children }) => {
    const { roomId } = useParams();
    const { addProject } = UseHome();

    const { skt } = UseSocket();

    const [terminalsConnected, setTerminalsConnected] = useState(false);
    const [project, setProject] = useState({
        title: '',
        createdAt: '',
        Image: '',
        runCommand: '',
    });

    useEffect(() => {
        if (terminalsConnected) return;

        skt.emit(
            'ConnectTerminals',
            { roomId },
            ({ title, createdAt, Image, runCommand }) => {
                addProject({ title, roomId, createdAt, runCommand });
                setProject({ title, createdAt, Image, runCommand });
                setTerminalsConnected(true);
                toast.success('Terminals connected!');
            }
        );
    }, [addProject, roomId, skt, terminalsConnected]);

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

export const UseRoom = () => useContext(context);
