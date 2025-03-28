import { useParams } from "react-router-dom";
import { Terminal } from "../Components/Terminal";
import { FileTree } from "../Components/FileTree";
import { useState } from "react";

export const Room = () => {
    const { roomId: containerId } = useParams();

    const [terminalTrigger, setTerminalTrigger] = useState(false);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div style={{ height: "50vh" }}>
                <div style={{ height: "50vh", width: "30vw" }}>
                    <FileTree containerId={containerId} terminalTrigger={terminalTrigger} />
                </div>
            </div>
            <div style={{ height: "50vh" }}>
                <Terminal containerId={containerId} setTerminalTrigger={setTerminalTrigger} />
            </div>
        </div>
    );
};
