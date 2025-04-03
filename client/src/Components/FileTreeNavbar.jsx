import React, { useState } from 'react';
import { useRoom } from '../Providers/RoomProvider';
import { useSocket } from '../Providers/SocketProvider';
import { MdEdit, MdPlayArrow, MdSave, MdShare } from 'react-icons/md';
import { useOpenFiles } from '../Providers/OpenFilesProvider';

export const FileTreeNavbar = () => {
    const { room, roomId } = useRoom();
    const { setSaveFlag } = useOpenFiles();
    const { skt } = useSocket();

    const [commandToRun, setCommandToRun] = useState('python script.py');

    const copyToClipboard = () => {
        if (!room) {
            console.error('Room details not available!');
            return;
        }
        const url = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert(`Url id copied, share it with other people`);
            })
            .catch((err) => console.error('Copy failed:', err));
    };

    const runCommand = () => {
        if (!skt) {
            console.error('Socket not available!');
            return;
        }

        skt.emit('connectMainTerminal -i1', {
            input: commandToRun + '\n',
            isDirectlyCalled: true,
        });
    };

    const editCommand = () => {
        const newCommand = window.prompt('Edit Command:', commandToRun);
        if (newCommand !== null) {
            setCommandToRun(newCommand);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col py-3 gap-5 items-center [&>*]:w-full [&>*]:cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-4 py-2 bg-neutral-700">
                <MdPlayArrow
                    title="Run project"
                    onClick={runCommand}
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
                onClick={() => setSaveFlag((prev) => !prev)}
                size={30}
            />
        </div>
    );
};
