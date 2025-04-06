import React, { useState } from 'react';
import { UseRoom } from '../../Providers/RoomProvider';
import {
    MdEdit,
    MdFileCopy,
    MdPlayArrow,
    MdSave,
    MdShare,
} from 'react-icons/md';
import { BsTerminal } from 'react-icons/bs';
import { UseOpenFiles } from '../../Providers/OpenFilesProvider';
import { EMITTER } from '../../Utils/EMITTER';
import { toast } from 'react-toastify';
import { toggleF11 } from '../../Utils/toggleF11';

export const FileTreeNavbar = ({ setHidden }) => {
    const { roomId } = UseRoom();
    const { saveFile } = UseOpenFiles();

    const [commandToRun, setCommandToRun] = useState('python /app/script.py');

    const copyToClipboard = () => {
        const url = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success(`Url id copied, share it with other people`);
            })
            .catch((err) => console.error('Copy failed:', err));
    };

    const editCommand = () => {
        const newCommand = window.prompt('Edit Command:', commandToRun);
        if (newCommand !== null) {
            setCommandToRun(newCommand);
        }
    };

    return (
        <div className="h-screen w-full bg-black flex flex-col pt-5 gap-5 items-center [&>*]:w-full [&>*]:cursor-pointer">
            <MdFileCopy
                title="Toggle file tree"
                size={25}
                onClick={() => {
                    setHidden((p) => ({ ...p, fileTree: !p.fileTree }));
                }}
            />
            <div className="flex flex-col items-center justify-center gap-4 py-2 bg-neutral-700">
                <MdPlayArrow
                    title="Run project"
                    onClick={() => EMITTER.runProject(commandToRun)}
                    size={30}
                />
                <MdEdit
                    title="Edit command to run"
                    onClick={editCommand}
                    size={30}
                />
            </div>
            <MdShare onClick={copyToClipboard} size={30} />
            <MdSave
                title="Save currently opened file"
                onClick={() => {
                    if (focusedPaths.left) saveFile('left');
                    if (focusedPaths.right) saveFile('right');
                }}
                size={30}
            />
            <button
                title="Toggle Fullscreen"
                onClick={toggleF11}
                className="font-extrabold p-2 select-none"
            >
                Zen
            </button>
            <BsTerminal
                title="Toggle terminal"
                onClick={() => {
                    setHidden((p) => ({ ...p, terminal: !p.terminal }));
                }}
                size={40}
            />
        </div>
    );
};
