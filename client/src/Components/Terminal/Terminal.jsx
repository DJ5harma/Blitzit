import { useState } from 'react';
import { EMITTER } from '../../Utils/EMITTER';
import { TerminalInputHistory } from './TerminalInputHistory';
import { TerminalHistory } from './TerminalHistory';
import { UseTerminal } from '../../Providers/TerminalProvider';

export const Terminal = () => {
    const { setInputHistory, setHistory } = UseTerminal();

    const [input, setInput] = useState('');

    return (
        <div className="button w-full h-full text-left flex flex-col justify-between gap-4 bg-black p-2">
            <div className="w-full flex overflow-auto">
                <TerminalHistory />
                <TerminalInputHistory />
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
