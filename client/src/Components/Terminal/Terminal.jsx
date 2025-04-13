import { useCallback, useEffect, useState } from 'react';
import { EMITTER } from '../../Utils/EMITTER';
import { TerminalInputHistory } from './TerminalInputHistory';
import { TerminalHistory } from './TerminalHistory';
import { UseTerminal } from '../../Providers/TerminalProvider';

export const Terminal = () => {
    const { inputHistory, setInputHistory, setHistory } = UseTerminal();

    const [input, setInput] = useState('');
    const [inFocus, setInFocus] = useState(false);

    const [prevCmdPointer, setPrevCmdPointer] = useState(inputHistory.length);

    useEffect(() => {
        if (prevCmdPointer === inputHistory.length) setInput('');
        else setInput(inputHistory[prevCmdPointer]);
    }, [prevCmdPointer, inputHistory]);

    const runCmd = useCallback(() => {
        if (input === '') return;
        if (input.toLowerCase() === 'clear') setHistory([]);
        else {
            EMITTER.runMainTerminalCommand(input);
            EMITTER.callForTree();
        }
        setInputHistory((pv) => [...pv, input]);
        setInput('');
        setPrevCmdPointer((p) => p + 1);
    }, [input, setHistory, setInputHistory]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!inFocus) return;
            console.log({ key: e.key });

            switch (e.key) {
                case 'Enter':
                    return runCmd();
                case 'ArrowUp':
                    return setPrevCmdPointer((p) => (p === 0 ? 0 : p - 1));
                case 'ArrowDown':
                    return setPrevCmdPointer((p) =>
                        p === inputHistory.length ? p : p + 1
                    );
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [runCmd, inFocus, inputHistory]);

    return (
        <div
            className="button w-full h-full text-left flex flex-col justify-between gap-4 bg-black p-2 overflow-auto"
            style={{ fontSize: 16 }}
            onFocus={() => setInFocus(true)}
            onBlur={() => setInFocus(false)}
        >
            <div className="w-full flex overflow-auto h-full">
                <TerminalHistory />
                <TerminalInputHistory />
            </div>
            <div className="flex items-center gap-2 [&>*]:p-2 select-none overflow-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your command"
                    className="border-1 border-white w-1/2 min-w-2xs rounded"
                />
                {input && <button onClick={runCmd}>Run</button>}
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
