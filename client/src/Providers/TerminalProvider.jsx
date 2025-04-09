import { createContext, useContext, useEffect, useState } from 'react';
import { UseSocket } from './SocketProvider';
import { EMITTER } from '../Utils/EMITTER';

const context = createContext();

export const TerminalProvider = ({ children }) => {
    const { skt } = UseSocket();
    const [history, setHistory] = useState([]);
    const [inputHistory, setInputHistory] = useState([]);

    useEffect(() => {
        skt.on('MAIN_TERMINAL_OUTPUT', (output) => {
            console.log("temrinal output: ", output);
            
            output = output.replace(
                new RegExp(`[\\x00-\\x09\\x0B-\\x1F\\x7F]`, 'g'),
                ''
            );
            setHistory((p) => [...p, output]);
        });

        EMITTER.runMainTerminalCommand('pwd');

        return () => {
            skt.removeListener('MAIN_TERMINAL_OUTPUT');
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
