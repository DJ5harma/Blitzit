import { useEffect, useRef } from 'react';
import { useSocket } from '../Providers/SocketProvider';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import { useRoom } from '../Providers/RoomProvider';

const xterm = new XTerm({
    cursorBlink: true,
    theme: { background: 'black', foreground: 'white' },
});

export const Terminal = () => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const { skt } = useSocket();

    const { callForTree } = useRoom();

    useEffect(() => {
        let commandBuffer = '';
        xterm.onData((input) => {
            switch (input) {
                case '\r':
                    xterm.writeln(`\r`); // Move to new line after command execution
                    skt.emit('connectMainTerminal -i1', {
                        input: commandBuffer,
                    });
                    setTimeout(() => {
                        skt.emit('connectMainTerminal -i1', { input: 'pwd\n' });
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
            callForTree();
        });
        setTimeout(() => {
            skt.emit('connectMainTerminal -i1', { input: 'pwd\n' });
        }, 400);

        return () => {
            skt.removeListener('connectMainTerminal -o1');
            xterm.dispose();
        };
    }, []);

    return (
        <div
            ref={terminalRef}
            className="w-full h-full text-left overflow-auto"
        ></div>
    );
};
