import io from 'socket.io-client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { EMITTER } from '../Utils/EMITTER';
import { CONSTANTS } from '../Utils/CONSTANTS';

const context = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef();

    if (!socketRef.current) {
        socketRef.current = io(CONSTANTS.BACKEND_URL, { autoConnect: false });
    }

    useEffect(() => {
        const skt = socketRef.current;

        const onConnect = () => {
            EMITTER.init(skt);
            setIsConnected(true);
        };

        skt.on('connect', onConnect);
        skt.connect();

        return () => {
            skt.off('connect', onConnect);
            skt.disconnect();
        };
    }, []);

    if (!isConnected) return <>Socket connecting</>;

    return (
        <context.Provider value={{ skt: socketRef.current }}>
            {children}
        </context.Provider>
    );
};

export const useSocket = () => useContext(context);
