import { terminalId_to_stream } from "../listeners/createContainer.js";
import { docker } from "../main.js";
import { execConfig } from "./execConfig.js";
import { streamConfig } from "./streamConfig.js";

export const getStream = async (containerId, terminalId) => {
    let stream = terminalId_to_stream[terminalId];
    if (!stream) {
        const exec = await docker.getContainer(containerId).exec(execConfig);

        stream = await exec.start(streamConfig);
        terminalId_to_stream[terminalId] = stream;
    }

    return stream;
};
