import { useSocket } from "../Providers/SocketProvider";
import { FaFolder } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRoom } from "../Pages/Room";
import { useState } from "react";

export const FileTreeNode = ({ name, value, marginLeft, path }) => {
	const { skt } = useSocket();

	const [isDeleted, setIsDeleted] = useState(false);

	const { callForTree } = useRoom();

	const isFolder = value !== null;

	function deleteEntity() {
		if (isFolder) {
			skt.emit("connectFileTerminal -i1", { input: "rm -r " + path });
		} else {
			skt.emit("connectFileTerminal -i1", { input: "rm " + path });
		}
		setIsDeleted(true);
		callForTree();
	}

	return (
		<>
			<div style={{ paddingLeft: marginLeft }}>
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

						{name}
					</span>
					<button onClick={() => deleteEntity()} style={{ padding: "2px 5px" }}>
						<MdDelete />
					</button>
				</div>
			</div>
			{!isDeleted && value &&
				Object.keys(value).map((key, i) => {
					return (
						<FileTreeNode
							key={i}
							path={path + "/" + key}
							marginLeft={marginLeft + 15}
							name={key}
							value={value[key]}
						/>
					);
				})}
		</>
	);
};
