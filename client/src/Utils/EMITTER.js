let skt = null;

export const EMITTER = {
    init(socket) {
        // socketProvider will call
        skt = socket;
    },
    callForTree() {
        skt.emit('connectFileTreeTerminal -i1', {
            input: `find /app -type d -printf "%p/\n" -o -type f -printf "%p\n"`,
        });
    },
    createEntity(isFile, path) {
        const entityName = prompt(`Enter ${isFile ? 'file' : 'folder'} name:`);
        if (!entityName) return;

        const fullPath = path + '/' + entityName;

        const command = (isFile ? `echo "Empty file" > ` : 'mkdir ') + fullPath;
        skt.emit('connectFileTreeTerminal -i1', { input: command });
        EMITTER.callForTree();
    },

    saveFileEmitter(content, path) {
        skt.emit('connectEditorTerminal -i2', {
            input: `echo '${content}' > ` + path,
        });
    },
    runProject(commandToRun) {
        skt.emit('connectMainTerminal -i1', {
            input: commandToRun + '\n',
            isDirectlyCalled: true,
        });
    },
    runMainTerminalCommand(commandToRun) {
        skt.emit('connectMainTerminal -i1', {
            input: commandToRun + '\n',
            isDirectlyCalled: false,
        });
    },
    deleteEntity(isFolder, path) {
        skt.emit('connectFileTreeTerminal -i1', {
            input: (isFolder ? 'rm -r ' : 'rm ') + path,
        });
        EMITTER.callForTree();
    },
    readFile(path) {
        skt.emit('connectEditorTerminal -i1', {
            input: 'cat ' + path,
            filePath: path,
        });
    },
};
