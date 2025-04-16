import { Socket } from "socket.io";
import { docker } from "../main.js";
import { ROOM } from "../database/ROOM.js";
import { execConfig } from "../utils/execConfig.js";
import { streamConfig } from "../utils/streamConfig.js";
import { redis, subscriber } from "../main.js";
import { tryPausingContainer } from "../services/tryPausingContainer.js";

const images = [
	"python-template",
	"javascript-template",
	"cpp-template",
	"java-template",
];

export const terminalId_to_stream = {};

/**
 * Description
 *
 * @function
 * @name createContainer
 * @kind variable
 * @param {Socket} skt
 * @returns {void}
 * @exports
 */

export const createContainer = (skt) => {
	skt.on("CreateContainer", async ({ Image, title, runCommand }) => {
		try {
			if (!images.includes(Image)) return;

			const container = await docker.createContainer({
				Image,
				Tty: true,
				AttachStdin: true,
				AttachStdout: true,
				AttachStderr: true,
				OpenStdin: true,
				StdinOnce: false,
				Cmd: ["/bin/sh"],
				HostConfig: {
					AutoRemove: true,
					NetworkMode: "blitzit_blitzit-net", // Match your compose project name
				},
			});

			await container.start();
			console.log("Container created");
			const containerId = container.id;

			const MainTerminalExec = await container.exec(execConfig);
			const GetFileTreeTerminalExec = await container.exec(execConfig);
			const DeleteEntityTerminalExec = await container.exec(execConfig);
			const SaveFileTerminalExec = await container.exec(execConfig);
			const ReadFileTerminalExec = await container.exec(execConfig);
			const CreateEntityTerminalExec = await container.exec(execConfig);
			const RenameEntityTerminalExec = await container.exec(execConfig);

			const MainTerminalId = MainTerminalExec.id;
			const GetFileTreeTerminalId = GetFileTreeTerminalExec.id;
			const DeleteEntityTerminalId = DeleteEntityTerminalExec.id;
			const SaveFileTerminalId = SaveFileTerminalExec.id;
			const ReadFileTerminalId = SaveFileTerminalExec.id;
			const CreateEntityTerminalId = CreateEntityTerminalExec.id;
			const RenameEntityTerminalId = RenameEntityTerminalExec.id;

			const MainTerminalStream = await MainTerminalExec.start(streamConfig);
			const GetFileTreeTerminalStream = await GetFileTreeTerminalExec.start(
				streamConfig
			);
			const DeleteEntityTerminalStream = await DeleteEntityTerminalExec.start(
				streamConfig
			);
			const SaveFileTerminalStream = await SaveFileTerminalExec.start(
				streamConfig
			);
			const ReadFileTerminalStream = await ReadFileTerminalExec.start(
				streamConfig
			);
			const CreateEntityTerminalStream = await CreateEntityTerminalExec.start(
				streamConfig
			);

			const RenameEntityTerminalStream = await RenameEntityTerminalExec.start(
				streamConfig
			);

			const arr = [
				{
					TERMINAL_ID: MainTerminalId,
					INPUT_ENDPOINT: `RUN_MAIN_TERMINAL_COMMAND`,
					OUTPUT_ENDPOINT: `MAIN_TERMINAL_OUTPUT`,
					Stream: MainTerminalStream,
					onSignal: (cmd) => {
						console.log("main treminla cmd: ", cmd);
						MainTerminalStream.write(cmd + "\n");
					},
				},
				{
					TERMINAL_ID: GetFileTreeTerminalId,
					INPUT_ENDPOINT: `GET_FILE_TREE`,
					OUTPUT_ENDPOINT: `FILE_TREE_DATA`,
					Stream: GetFileTreeTerminalStream,
					onSignal: () => {
						GetFileTreeTerminalStream.write(
							`find /app -type d -printf "%T@ %p/\n" -o -type f -printf "%T@ %p\n" | sort -n | cut -d' ' -f2-\n`
						);
					},
				},
				{
					TERMINAL_ID: DeleteEntityTerminalId,
					INPUT_ENDPOINT: `DELETE_ENTITY`,
					OUTPUT_ENDPOINT: `ENTITY_DELETION_COMPLETE`,
					Stream: DeleteEntityTerminalStream,
					onSignal: (ip) => {
						if (!ip) return;
						const { isFolder, path } = JSON.parse(ip);
						if (!path || isFolder === undefined) return;
						DeleteEntityTerminalStream.write(
							(isFolder ? "rm -r " : "rm ") + path + "\n"
						);
					},
				},
				{
					TERMINAL_ID: SaveFileTerminalId,
					INPUT_ENDPOINT: `SAVE_FILE`,
					OUTPUT_ENDPOINT: `FILE_SAVE_COMPLETE`,
					Stream: SaveFileTerminalStream,
					onSignal: (ip) => {
						if (!ip) return;

						try {
							const { content, path } = JSON.parse(ip);
							if (!path) return;
							SaveFileTerminalStream.write(
								`cat << 'EOF' > ${path}\n${content}\nEOF\n`
							);
							SaveFileTerminalStream.write(`echo ${path}\n`);
						} catch ({ message }) {
							console.error({ message });
						}
					},
					chunkManipulator: async (data) => {
						if (data.length > 8) data = data.slice(8).toString();
						data = data.substring(data.indexOf("/"), data.length - 1);
						return data;
					},
				},
				{
					TERMINAL_ID: ReadFileTerminalId,
					INPUT_ENDPOINT: `READ_FILE`,
					OUTPUT_ENDPOINT: `FILE_READ_COMPLETE`,
					Stream: ReadFileTerminalStream,
					onSignal: async (path) => {
						if (!path) return;

						await redis.LPUSH(ReadFileTerminalId, path);
						ReadFileTerminalStream.write("cat " + path + "\n");
					},
					chunkManipulator: async (data) => {
						if (data.length > 8) data = data.slice(8).toString(); // Skip first 8 bytes
						const filePath = await redis.LPOP(ReadFileTerminalId);
						return JSON.stringify({
							data,
							filePath,
						});
					},
				},
				{
					TERMINAL_ID: CreateEntityTerminalId,
					INPUT_ENDPOINT: `CREATE_ENTITY`,
					OUTPUT_ENDPOINT: `ENTITY_CREATION_COMPLETE`,
					Stream: CreateEntityTerminalStream,
					onSignal: (ip) => {
						if (!ip) return;
						try {
							const { isFile, path } = JSON.parse(ip);
							if (!path || isFile === undefined) return;
							CreateEntityTerminalStream.write(
								(isFile ? `echo "Empty file" > ` : "mkdir ") + path + "\n"
							);
						} catch ({ message }) {
							console.error(message);
						}
					},
				},
				{
					TERMINAL_ID: RenameEntityTerminalId,
					INPUT_ENDPOINT: `RENAME_ENTITY`,
					OUTPUT_ENDPOINT: `ENTITY_RENAME_COMPLETE`,
					Stream: RenameEntityTerminalStream,
					onSignal: (ip) => {
						if (!ip) return;
						try {
							const { oldPath, newPath } = JSON.parse(ip);
							if (!oldPath || !newPath) return;
							RenameEntityTerminalStream.write(`mv ${oldPath} ${newPath}\n`);
						} catch ({ message }) {
							console.error(message);
						}
					},
				},
			];

			arr.forEach(
				async ({
					INPUT_ENDPOINT,
					OUTPUT_ENDPOINT,
					Stream,
					onSignal,
					TERMINAL_ID,
					chunkManipulator,
				}) => {
					Stream.on("data", async (data) => {
						if (chunkManipulator) data = await chunkManipulator(data);
						else data = data.toString();

						console.log(INPUT_ENDPOINT, "Stream data: ", { data });

						await redis.PUBLISH(`${OUTPUT_ENDPOINT}:${TERMINAL_ID}`, data);
					});
					await subscriber.SUBSCRIBE(
						`${INPUT_ENDPOINT}:${TERMINAL_ID}`,
						onSignal
					);
				}
			);

			const newRoom = await ROOM.create({
				containerId,
				MainTerminalId,
				GetFileTreeTerminalId,
				DeleteEntityTerminalId,
				SaveFileTerminalId,
				ReadFileTerminalId,
				CreateEntityTerminalId,
				RenameEntityTerminalId,
				title: title || `Untitled-${Date.now()}`,
				Image,
				runCommand,
			});

			skt.emit("CONTAINER_CREATED", {
				roomId: newRoom._id,
			});

			tryPausingContainer(containerId);
		} catch ({ message }) {
			console.error({ message });
		}
	});
};
