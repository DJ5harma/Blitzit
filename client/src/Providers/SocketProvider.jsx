import io from 'socket.io-client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { EMITTER } from '../Utils/EMITTER';
import { CONSTANTS } from '../Utils/CONSTANTS';
import { toast } from 'react-toastify';

const context = createContext();

export const SocketProvider = ({ children }) => {
    const { current: skt } = useRef(
        io(CONSTANTS.BACKEND_URL, {
            autoConnect: false,
            transports: ['websocket'],
        })
    );
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const tst = toast.loading('Connecting to socket');
        skt.on('connect', () => {
            EMITTER.init(skt);
            setIsConnected(true);
            toast.dismiss(tst);
            toast.success('Socket connected!');
        });
        skt.connect();
        skt.on('disconnect', () => {
            skt.connect();
        });
        return () => {
            skt.disconnect();
        };
    }, [skt]);

    if (!isConnected) return <>Socket connecting...</>;

    return <context.Provider value={{ skt }}>{children}</context.Provider>;
};

export const UseSocket = () => useContext(context);
