import { toast } from 'react-toastify';

let skt = null;

export const EMITTER = {
    init(socket) {
        // socketProvider will call
        skt = socket;

        skt.on('ENTITY_DELETION_COMPLETE', (op) => {
            toast.success('Entity deletion complete, ' + op);
            // EMITTER.callForTree();
        });
        skt.on('ENTITY_CREATION_COMPLETE', (op) => {
            toast.success('Entity creation complete, ' + op);
        });
        skt.on('FILE_SAVE_COMPLETE', (op) => {
            toast.success('File save complete, ' + op);
        });
        skt.on('FILE_READ_COMPLETE', (op) => {
            toast.success('File read complete, ' + op);
        });
        skt.on('MAIN_TERMINAL_OUTPUT', (op) => {
            toast.success('Main terminal output: , ' + op);
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

        // const command = (isFile ? `echo "Empty file" > ` : 'mkdir ') + fullPath;
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
        // TODO
        // skt.emit(
        //     'connectFileTreeTerminal -i1',
        //     JSON.stringify({ oldPath, newPath })
        // );
        // setTimeout(() => {
        //     EMITTER.callForTree();
        // }, 500);
    },
};
