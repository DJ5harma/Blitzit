import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';

const context = createContext();

export const TerminalProvider = ({ children }) => {
    const { skt } = UseSocket();
    const [history, setHistory] = useState([]);
    const [inputHistory, setInputHistory] = useState([]);

    useEffect(() => {
        skt.on('connectMainTerminal -o1', ({ data }) => {
            data = data.replace(
                new RegExp(`[\\x00-\\x09\\x0B-\\x1F\\x7F]`, 'g'),
                ''
            );
            setHistory((p) => [...p, data]);
        });

        EMITTER.runMainTerminalCommand('pwd');

        return () => {
            skt.removeListener('connectMainTerminal -o1');
        };
    }, [skt]);

    return (
        <context.Provider
            value={{ inputHistory, setInputHistory, history, setHistory }}
        >
            {children}
        </context.Provider>
    );
};

export const UseTerminal = () => useContext(context);
