import React, { useState } from 'react';
import { UseRoom } from '../../Providers/RoomProvider';
import {
    MdEdit,
    MdFileCopy,
    MdPlayArrow,
    MdSave,
    MdShare,
} from 'react-icons/md';
import { SiZendesk } from 'react-icons/si';
import { BsTerminal } from 'react-icons/bs';
import { UseFiles } from '../../Providers/FilesProvider';
import { EMITTER } from '../../Utils/EMITTER';
import { toast } from 'react-toastify';
import { toggleF11 } from '../../Utils/toggleF11';
import { FaSearch } from 'react-icons/fa';

export const FileTreeNavbar = ({ setHidden }) => {
    const { roomId } = UseRoom();
    const { saveFile } = UseFiles();

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
        <div className="button h-screen w-full bg-black flex flex-col py-4 gap-5 items-center [&>*]:cursor-pointer [&>*]:p-1 [&>*]:size-8">
            <MdFileCopy
                title="Toggle file tree"
                size={25}
                className="button"
                onClick={() => {
                    setHidden((p) => ({ ...p, fileTree: !p.fileTree }));
                }}
            />
            <MdPlayArrow
                title="Run project"
                className="button bg-gray-800"
                onClick={() => EMITTER.runProject(commandToRun)}
                size={30}
            />
            <MdEdit
                title="Edit command to run"
                className="button bg-gray-800"
                onClick={editCommand}
                size={30}
            />
            <MdShare
                title="Share link and collaborate"
                onClick={copyToClipboard}
                size={30}
                className="button"
            />
            <MdSave
                title="Save currently opened file"
                className="button"
                onClick={saveFile}
                size={30}
            />
            <SiZendesk
                title="Toggle Fullscreen"
                onClick={toggleF11}
                className="button"
                size={30}
            />
            <FaSearch
                title="Search in project"
                onClick={() => {
                    setHidden((p) => ({ ...p, search: !p.search }));
                }}
                className="button"
                size={30}
            />
            <BsTerminal
                title="Toggle terminal"
                className="button"
                onClick={() => {
                    setHidden((p) => ({ ...p, terminal: !p.terminal }));
                }}
                size={40}
            />
        </div>
    );
};
