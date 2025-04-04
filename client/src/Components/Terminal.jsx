import { useEffect, useState } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { EMITTER } from '../Utils/EMITTER';

export const Terminal = () => {
    const { skt } = useSocket();

    const [history, setHistory] = useState([]);
    const [inputHistory, setInputHistory] = useState([]);
    const [input, setInput] = useState('');

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
        <div className="w-full h-full text-left  flex flex-col justify-between gap-4 overflow-hidden">
            <div className="w-full flex overflow-auto">
                <div className="flex flex-col overflow-auto gap-2 w-3/4">
                    <span className="bg-blue-950 pl-3 select-none">
                        Terminal
                    </span>
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
                <div className="flex flex-col overflow-auto gap-2 w-1/4 px-2">
                    <span className="bg-white text-black pl-3 select-none">
                        Input History
                    </span>
                    {inputHistory.map((text) => {
                        return (
                            <span className="border-b-2 border-neutral-500">
                                {text}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center gap-2 pb-2 [&>*]:p-2 select-none">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your command"
                    className="border-1 border-white w-1/2 min-w-2xs rounded"
                />
                {input && (
                    <button
                        onClick={() => {
                            if (input === '') return;
                            if (input.toLowerCase() === 'clear') setHistory([]);
                            else {
                                EMITTER.runMainTerminalCommand(input);
                                EMITTER.callForTree();
                            }
                            setInput((p) => {
                                setInputHistory((pv) => [...pv, p]);
                                return '';
                            });
                        }}
                    >
                        Run
                    </button>
                )}
                <button onClick={() => EMITTER.runMainTerminalCommand('pwd')}>
                    Location
                </button>
                {history.length > 0 && (
                    <button
                        onClick={() => {
                            setHistory([]);
                            setInputHistory([]);
                        }}
                        className="p-2"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};
