import { useEffect, useRef, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";

export const Terminal = ({ containerId, setTerminalTrigger }) => {
	const terminalRef = useRef(null);
	const xtermRef = useRef(null);
	const { skt } = useSocket();

	const [terminalId, setTerminalId] = useState(null);
	const [isTerminalCreated, setIsTerminalCreated] = useState(false);

	useEffect(() => {
		if (terminalId) return;
		skt.on("createTerminal -o1", ({ execId }) => {
			setTerminalId(execId);
            setIsTerminalCreated(true);
			console.log("exec: ", execId);
		});
		skt.emit("createTerminal", { containerId });

		return () => {
			skt.removeListener("createTerminal -o1");
		};
	}, [terminalId]);

	useEffect(() => {
		if (!isTerminalCreated) return;
		if (!terminalRef.current || xtermRef.current) return;

		const xterm = new XTerm({
			cursorBlink: true,
			theme: { background: "black", foreground: "white" },
		});
		xterm.open(terminalRef.current);
		xtermRef.current = xterm;

		skt.emit("connectTerminal", { execId: terminalId });

		skt.on("connectTerminal -o1", ({ data }) => {
			xterm.write(data.replace(/\n/g, "\r\n"));
			// xterm.writeln("");
			console.log({ data });
		});

		setTimeout(() => {
			skt.emit("connectTerminal -i1", { input: "pwd\n" });
		}, 400);

		let commandBuffer = "";
		xterm.onData((input) => {
			if (input === "\r") {
				// Enter key pressed
				xterm.writeln(`\r`); // Move to new line after command execution
				skt.emit("connectTerminal -i1", { input: commandBuffer });
				setTimeout(() => {
					skt.emit("connectTerminal -i1", { input: "pwd\n" });
					setTerminalTrigger((p) => !p);
				}, 400);
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
	}, [terminalId, isTerminalCreated]);
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
