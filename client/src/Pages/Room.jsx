import { useParams } from "react-router-dom";
import { Terminal } from "../Components/Terminal";
import { FileTree } from "../Components/FileTree";
import { useState } from "react";
import { Editor } from "../Components/Editor";

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
            <div style={{ height: "70vh",display: "flex"}}>
                <div style={{ height: "100%", width: "30vw" }}>
                    <FileTree containerId={containerId} terminalTrigger={terminalTrigger} />
                </div>
                <div style={{ height: "100%", width: "70vw", border: "solid green" }}>
                    <Editor />
                </div>
            </div>
            <div style={{ height: "30vh" }}>
                <Terminal containerId={containerId} setTerminalTrigger={setTerminalTrigger} />
            </div>
        </div>
    );
};
