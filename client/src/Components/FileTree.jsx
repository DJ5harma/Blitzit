import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { FileTreeNode } from "./FileTreeNode";
import { useRoom } from "../Pages/Room";

// dirOutput
// :
// "\u0001\u0000\u0000\u0000\u0000\u0000\u0000\"/app\n/app/testFolder\n/app/folder2\n"
// fileOutput
// :
// "\u0001\u0000\u0000\u0000\u0000\u0000\u0000,/app/testFolder/testFile.txt\n/app/script.py\n"

function getFileTree(dirOutput, fileOutput) {
	// Process directory output
	dirOutput = dirOutput
		.substring(dirOutput.indexOf("/")) // Start from first /
		.trim()
		.split("\n")
		.filter(Boolean);

	fileOutput = fileOutput
		.substring(fileOutput.indexOf("/")) // Start from first /
		.trim()
		.split("\n")
		.filter(Boolean);

	const tree = {};

	function addToTree(fullPath, isFile) {
		const parts = fullPath.split("/").filter(Boolean); // Handle paths in frontend
		let current = tree;

		parts.forEach((part, index) => {
			if (!current[part]) {
				current[part] = index === parts.length - 1 && isFile ? null : {};
			}

			if (index === parts.length - 1 && isFile) {
				current[part] = null; // Ensure files are set to null
			}

			current = current[part];
		});
	}

	dirOutput.forEach((dir) => addToTree(dir, false));
	fileOutput.forEach((file) => addToTree(file, true));
	return JSON.parse(JSON.stringify(tree, null, 2));
}

export const FileTree = ({ containerId }) => {
	const { skt } = useSocket();
	const { callForTree } = useRoom();

	const [output, setOutput] = useState({ fileOutput: null, dirOutput: null });

	const [terminalId, setTerminalId] = useState(null);
	const [isTerminalCreated, setIsTerminalCreated] = useState(false);

	const [obj, setObj] = useState(null);

	useEffect(() => {
		if (terminalId) return;
		skt.on("createFileTerminal -o1", ({ execId }) => {
			setTerminalId(execId);
			setIsTerminalCreated(true);
			// console.log("fsexec: ", execId);
		});
		skt.emit("createFileTerminal", { containerId });

		return () => {
			skt.removeListener("createFileTerminal -o1");
		};
	}, [terminalId, containerId, skt]);

	useEffect(() => {
		if (!isTerminalCreated) return;

		skt.emit("connectFileTerminal", { execId: terminalId });

		setTimeout(() => {
			callForTree();
		}, 300);

		skt.on("connectFileTerminal -o1", ({ data }) => {
			data.replace(/\n/g, "\r\n");
			// console.log({ tree: data });
			setOutput((p) => {
				if (!p.dirOutput) return { ...p, dirOutput: data };
				if (!p.fileOutput) {
					const res = { ...p, fileOutput: data };
					setObj(() => getFileTree(res.dirOutput, res.fileOutput));
					return res;
				}
				return { dirOutput: data, fileOutput: null };
			});
		});

		return () => {
			skt.removeListener("connectFileTerminal -o1");
		};
	}, [callForTree, isTerminalCreated, skt, terminalId]);

	if (!obj || !output.dirOutput || !output.fileOutput) return null;

	// console.log(obj);

	return (
		<div
			style={{
				border: "solid red",
				paddingLeft: 10,
				overflowY: "auto",
				height: "100%",
			}}
		>
			<FileTreeNode
				name={"app"}
				value={obj["app"]}
				marginLeft={0}
				path={"/app"}
			/>
		</div>
	);
};
