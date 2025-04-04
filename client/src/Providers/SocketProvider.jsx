import io from 'socket.io-client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const context = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef();

    if (!socketRef.current) {
        socketRef.current = io('http://localhost:4000', { autoConnect: false });
    }

    useEffect(() => {
        const skt = socketRef.current;

        const onConnect = () => {
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
