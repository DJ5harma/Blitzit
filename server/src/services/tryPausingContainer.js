import { docker, redis } from "../main.js";

export function tryPausingContainer(containerId) {
	setTimeout(async () => {
		try {
			const online = await redis.GET(`${containerId}:CONTAINER_USERS_ONLINE`);
			if (online === "0") {
				const container = docker.getContainer(containerId);
				await container.pause();
			}
		} catch ({ message }) {
			console.log({ message });
		}
	}, 1000 * 10); // 5 mins
}
