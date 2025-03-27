import { useEffect, useState, useRef } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";

export const Terminal = ({ terminalId }) => {
    const terminalRef = useRef(null);
    const xtermRef = useRef(null);
    const { skt } = useSocket();

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        // Initialize xterm instance
        const xterm = new XTerm({
            cursorBlink: true,
            theme: { background: "black", foreground: "white" },
        });
        xterm.open(terminalRef.current);
        xtermRef.current = xterm;

        // Emit terminal connection event
        skt.emit("connectTerminal", { execId: terminalId });

        // Handle incoming terminal output
        skt.on("connectTerminal -o1", ({ data }) => {
            xterm.write(data.replace(/\n/g, "\r\n"));
            xterm.writeln('')
            console.log({data})
        });

        // Handle user input
        let commandBuffer = "";
        xterm.onData((input) => {
            
            if (input === "\r") {
                // Enter key pressed
                xterm.writeln(`\r`); // Move to new line after command execution
                skt.emit("connectTerminal -i1", { input: commandBuffer });
                commandBuffer = "";
            } else if (input === "\u007f") {
                // Handle backspace
                if (commandBuffer.length > 0) {
                    commandBuffer = commandBuffer.slice(0, -1);
                    xterm.write("\b \b"); // Remove last character visually
                }
            } else {
                commandBuffer += input;
                xterm.write(input); // Display input in terminal
            }
        });

        return () => {
            skt.removeListener("connectTerminal -o1");
            xterm.dispose();
        };
    }, [terminalId]);
    return (
        <div
            ref={terminalRef}
            style={{
                width: "100%",
                height: "100%",
                textAlign: "left", // Ensures left alignment
                overflow: "auto", // Prevents unexpected shifts
            }}
        ></div>
    );
    
};
