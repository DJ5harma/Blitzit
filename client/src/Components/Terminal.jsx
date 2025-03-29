import { useEffect, useRef } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import { useRoom } from '../Pages/Room';

export const Terminal = () => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const { skt } = useSocket();

    const { callForTree } = useRoom();

    useEffect(() => {
        const xterm = new XTerm({
            cursorBlink: true,
            theme: { background: 'black', foreground: 'white' },
        });
        let commandBuffer = '';
        xterm.onData((input) => {
            console.log({input})
            if (input === '\r') {
                // Enter key pressed
                xterm.writeln(`\r`); // Move to new line after command execution
                skt.emit('connectMainTerminal -i1', {
                    input: commandBuffer,
                });
                setTimeout(() => {
                    skt.emit('connectMainTerminal -i1', { input: 'pwd\n' });
                }, 400);
                commandBuffer = '';
            } else if (input === '\u007f') {
                // Handle backspace
                if (commandBuffer.length > 0) {
                    commandBuffer = commandBuffer.slice(0, -1);
                    xterm.write('\b \b'); // Remove last character visually
                }
            } else {
                commandBuffer += input;
                xterm.write(input); // Display input in terminal
            }
        });
        xterm.open(terminalRef.current);
        xtermRef.current = xterm;

        skt.on('connectMainTerminal -o1', ({ data }) => {
            xterm.write(data.replace(/\n/g, '\r\n'));
            // xterm.writeln("");
            callForTree();
        });
        skt.emit('connectMainTerminal -i1', { input: 'pwd\n' });

        return () => {
            skt.removeListener('connectMainTerminal -o1');
            xterm.dispose();
        };
    }, []);

    // if (!terminalId) return 'Loading terminal...';

    return (
        <div
            ref={terminalRef}
            style={{
                width: '100%',
                height: '100%',
                textAlign: 'left', // Ensures left alignment
                overflow: 'auto', // Prevents unexpected shifts
            }}
        ></div>
    );
};
