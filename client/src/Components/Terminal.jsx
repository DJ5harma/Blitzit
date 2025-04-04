import { useEffect, useRef } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { Terminal as XTerm } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { EMITTER } from '../Utils/EMITTER';

const xterm = new XTerm({
    cursorBlink: true,
    theme: { background: 'black', foreground: 'white' },
    scrollOnUserInput: true,
    rows: 50,
});

export const Terminal = () => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const { skt } = useSocket();

    useEffect(() => {
        let commandBuffer = '';
        xterm.onData((input) => {
            switch (input) {
                case '\r':
                    xterm.writeln(`\r`); // Move to new line after command execution
                    if (commandBuffer === 'clear') {
                        xterm.clear();
                    } else {
                        EMITTER.runMainTerminalCommand(commandBuffer);
                    }
                    setTimeout(() => {
                        EMITTER.runMainTerminalCommand('pwd');
                    }, 400);
                    commandBuffer = '';
                    break;
                case '\u007f':
                    if (commandBuffer.length > 0) {
                        commandBuffer = commandBuffer.slice(0, -1);
                        xterm.write('\b \b'); // Remove last character visually
                    }
                    break;

                default:
                    commandBuffer += input;
                    xterm.write(input); // Display input in terminal
                    break;
            }
        });
        xterm.open(terminalRef.current);
        xtermRef.current = xterm;

        skt.on('connectMainTerminal -o1', ({ data }) => {
            xterm.write(data.replace(/\n/g, '\r\n'));
            xterm.write('\n');
            EMITTER.callForTree();
        });

        EMITTER.runMainTerminalCommand('pwd');

        return () => {
            skt.removeListener('connectMainTerminal -o1');
            xterm.dispose();
        };
    }, [skt]);

    return (
        <div
            ref={terminalRef}
            className="w-full h-full text-left overflow-y-auto scroll-auto"
        ></div>
    );
};
