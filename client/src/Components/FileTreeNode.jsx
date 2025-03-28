import { useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import { FaFolder } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export const FileTreeNode = ({ obj, marginLeft, path }) => {
	if (!obj) return null;
	const { skt } = useSocket();

	const [deletedFiles, setDeletedFiles] = useState(new Set());
	const [deletedFolders, setDeletedFolders] = useState(new Set());

	return Object.keys(obj).map((key, i) => {
		const isFolder = obj[key] !== null;
		const myPath = path + "/" + key;

        
		function deleteEntity() {
            if (isFolder) {
                skt.emit("connectFileTerminal -i1", { input: "rm -r " + myPath });
				setDeletedFolders(new Set([...deletedFolders, myPath]));
			} else {
				skt.emit("connectFileTerminal -i1", { input: "rm " + myPath });
				setDeletedFiles(new Set([...deletedFiles, myPath]));
			}
			setTimeout(() => {
				skt.emit("connectFileTerminal -i1", { input: "find /app -type d" });
			}, 1000);
			setTimeout(() => {
				skt.emit("connectFileTerminal -i1", { input: "find /app -type f" });
			}, 1000);
		}
		// console.log({ [key]: path + "/" + key });
        if (isFolder && deletedFolders.has(myPath)) return "deleting...";
        if (!isFolder && deletedFiles.has(myPath)) return "deleting...";
		return (
			<div key={i} style={{ paddingLeft: marginLeft }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingRight: 10,
						borderBottom: "solid 0.5px",
					}}
				>
					<span
						style={{
							display: "flex",
							gap: 6,
							alignItems: "center",
							padding: 5,
						}}
					>
						{isFolder ? <FaFolder /> : <FaFileAlt />}

						{key}
					</span>
					<button
						onClick={() => deleteEntity(myPath, isFolder)}
						style={{ padding: "2px 5px" }}
					>
						<MdDelete />
					</button>
				</div>
				<div>
					<FileTreeNode
						obj={obj[key]}
						marginLeft={marginLeft + 12}
						path={myPath}
					/>
				</div>
			</div>
		);
	});
};
