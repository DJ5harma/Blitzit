import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../Providers/SocketProvider";
import { Terminal } from "../Components/Terminal";
import { FileTree } from "../Components/FileTree";

export const Room = () => {
    const { roomId : containerId } = useParams();
    const { skt } = useSocket();

    const [terminalId, setTerminalId] = useState("");

    useEffect(() => {
        if (terminalId) return;
        skt.on("createTerminal -o1", ({ execId }) => {
            setTerminalId(execId);
        });
        skt.emit("createTerminal", { containerId });

        return () => {
            skt.removeListener("createTerminal -o1");
        };
    }, [terminalId]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div
                style={{ height: "80vh", border: "solid red" }}
            >
                <div style={{height: "80vh", width: "30vw"}}>
                    <FileTree />
                </div>
            </div>
            <div style={{ height: "20vh" }}>
                {terminalId && <Terminal terminalId={terminalId} />}
            </div>
        </div>
    );
};
