import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";

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
        const parts = fullPath.split("/").filter(Boolean);
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] =
                    index === parts.length - 1 && isFile ? null : {};
            }
            current = current[part];
        });
    }

    dirOutput.forEach((dir) => addToTree(dir, false));
    fileOutput.forEach((file) => addToTree(file, true));
    return JSON.parse(JSON.stringify(tree, null, 2));
}

export const FileTree = ({ containerId, terminalTrigger }) => {
    const { skt } = useSocket();

    const [output, setOutput] = useState({ fileOutput: null, dirOutput: null });

    const [terminalId, setTerminalId] = useState(null);

    function callForTree() {
        setTimeout(() => {
            skt.emit("connectFileTerminal -i1", { input: "find /app -type d" });
        }, 400);
        setTimeout(() => {
            skt.emit("connectFileTerminal -i1", { input: "find /app -type f" });
        }, 800);
    }

    useEffect(() => {
        if (!terminalId) return;
        callForTree();
    }, [terminalTrigger, terminalId]);

    useEffect(() => {
        if (terminalId) return;
        skt.on("createFileTerminal -o1", ({ execId }) => {
            setTerminalId(execId);
            console.log("fsexec: ", execId);
        });
        skt.emit("createFileTerminal", { containerId });

        return () => {
            skt.removeListener("createFileTerminal -o1");
        };
    }, [terminalId]);

    useEffect(() => {
        if (!terminalId) return;

        skt.emit("connectFileTerminal", { execId: terminalId });

        setTimeout(() => {
            callForTree();
        }, []);

        skt.on("connectFileTerminal -o1", ({ data }) => {
            data.replace(/\n/g, "\r\n");
            console.log({ tree: data });
            setOutput((p) => {
                if (!p.dirOutput) return { ...p, dirOutput: data };
                if (!p.fileOutput) return { ...p, fileOutput: data };
                return { dirOutput: data, fileOutput: null };
            });
        });

        return () => {
            skt.removeListener("connectFileTerminal -o1");
        };
    }, [terminalId]);

    console.log(output);

    if (!output.dirOutput || !output.fileOutput) return null;

    return (
        <div style={{ border: "solid red", paddingLeft: 10 }}>
            <Dir
                obj={getFileTree(output.dirOutput, output.fileOutput)}
                marginLeft={0}
            />
        </div>
    );
};

const Dir = ({ obj, marginLeft }) => {
    // console.log({ obj, marginLeft });

    if (!obj) return null;

    return Object.keys(obj).map((key, i) => {
        return (
            <div key={i} style={{ paddingLeft: marginLeft }}>
                <p>{key}</p>
                <div>
                    <Dir obj={obj[key]} marginLeft={marginLeft + 10} />
                </div>
            </div>
        );
    });
};
