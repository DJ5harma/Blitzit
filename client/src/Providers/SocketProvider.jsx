import io from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';
import { EMITTER } from '../Utils/EMITTER';
import { CONSTANTS } from '../Utils/CONSTANTS';
import { toast } from 'react-toastify';

const context = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const skt = io(CONSTANTS.BACKEND_URL);

        const tst = toast.loading('Connecting to socket');

        skt.on('connect', () => {
            EMITTER.init(skt);
            toast.dismiss(tst);
            toast.success('Socket connected!');
            setIsConnected(true);
        });

        skt.on('disconnect', (reason) => {
            console.warn('Socket disconnected:', reason);
            setIsConnected(false);
        });

        skt.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        setSocket(skt);

        return () => {
            skt.disconnect();
        };
    }, []);

    if (!isConnected || !socket) return <>Socket connecting...</>;

    return (
        <context.Provider value={{ skt: socket }}>{children}</context.Provider>
    );
};

export const useSocket = () => useContext(context);
