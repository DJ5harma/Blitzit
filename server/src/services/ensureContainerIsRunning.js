import { docker } from "../main.js";

export async function ensureContainerIsRunning(containerId) {
	const container = docker.getContainer(containerId);

	const isRunning = (await container.inspect()).State.Status === "running";
	if (!isRunning) await container.unpause();
}
