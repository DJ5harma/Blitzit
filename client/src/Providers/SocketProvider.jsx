import io from 'socket.io-client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const context = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const { current: skt } = useRef(
        io('http://localhost:4000', { autoConnect: false })
    );

    useEffect(() => {
        if (isConnected) return;
        skt.on('connect', () => {
            setIsConnected(true);
        });
        skt.connect();
        return () => {
            skt.removeAllListeners();
            skt.disconnect();
        };
    }, [skt]);

    if (!isConnected) return <>Socket connecting</>;

    return <context.Provider value={{ skt }}>{children}</context.Provider>;
};

export const useSocket = () => useContext(context);
