import { useEffect, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { EMITTER } from '../Utils/EMITTER';

export const Terminal = () => {
    const { skt } = useSocket();

    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        skt.on('connectMainTerminal -o1', ({ data }) => {
            data = data.replace(
                new RegExp(`[\\x00-\\x09\\x0B-\\x1F\\x7F]`, 'g'),
                ''
            );
            setHistory((p) => [...p, data]);
            EMITTER.callForTree();
        });

        EMITTER.runMainTerminalCommand('pwd');

        return () => {
            skt.removeListener('connectMainTerminal -o1');
        };
    }, [skt]);

    return (
        <div className="w-full h-full text-left overflow-y-auto flex flex-col justify-between gap-4">
            <div className="flex flex-col overflow-auto scroll-auto gap-2">
                {history.map((text) => {
                    return (
                        <span
                            style={
                                text[0] == '/'
                                    ? {
                                          backgroundImage:
                                              'linear-gradient(to right, aliceblue, black)',
                                          color: 'black',
                                          paddingLeft: 12,
                                      }
                                    : {}
                            }
                        >
                            {text}
                        </span>
                    );
                })}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your command"
                    className="border-1 border-white p-2 w-1/2 min-w-2xs rounded"
                />
                <button
                    onClick={() => {
                        if (input.toLowerCase() === 'clear') setHistory([]);
                        else EMITTER.runMainTerminalCommand(input);
                        setInput('');
                    }}
                    className="p-2"
                >
                    Run {`>`}
                </button>
                <button
                    onClick={() => {
                        EMITTER.runMainTerminalCommand('pwd');
                    }}
                    className="p-2"
                >
                    Get Location {`>/`}
                </button>
            </div>
        </div>
    );
};
