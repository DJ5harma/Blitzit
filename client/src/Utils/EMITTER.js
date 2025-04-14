import { toast } from 'react-toastify';

let skt = null;

export const EMITTER = {
    init(socket) {
        // socketProvider will call
        skt = socket;

        const msgs = [
            'ENTITY_DELETION_COMPLETE',
            'ENTITY_CREATION_COMPLETE',
            'FILE_SAVE_COMPLETE',
            'FILE_READ_COMPLETE',
            'MAIN_TERMINAL_OUTPUT',
            'ENTITY_RENAME_COMPLETE',
        ];
        msgs.forEach((msg) => {
            skt.on(msg, (op) => {
                toast(`${msg}: ${op.slice(0, 30)}...`);
            });
        });
    },

    callForTree() {
        console.log('Tree called');

        skt.emit('GET_FILE_TREE');
    },

    createEntity(isFile, path) {
        const entityName = prompt(`Enter ${isFile ? 'file' : 'folder'} name:`);
        if (!entityName) return;

        path = path + '/' + entityName;

        skt.emit('CREATE_ENTITY', JSON.stringify({ isFile, path }));
        EMITTER.callForTree();
    },

    runProject(commandToRun) {
        EMITTER.runMainTerminalCommand(commandToRun);
    },

    runMainTerminalCommand(commandToRun) {
        skt.emit('RUN_MAIN_TERMINAL_COMMAND', commandToRun);
    },

    deleteEntity(isFolder, path) {
        skt.emit('DELETE_ENTITY', JSON.stringify({ isFolder, path }));
        setTimeout(() => EMITTER.callForTree(), 500);
    },

    saveFile(content, path) {
        skt.emit('SAVE_FILE', JSON.stringify({ content, path }));
    },

    readFile(path) {
        skt.emit('READ_FILE', path);
    },

    renameEntity(oldPath, newPath) {
        skt.emit('RENAME_ENTITY', JSON.stringify({ oldPath, newPath }));

        setTimeout(() => {
            EMITTER.callForTree();
        }, 500);
    },
};
