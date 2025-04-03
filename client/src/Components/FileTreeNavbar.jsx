import React from 'react';
import { useRoom } from '../Providers/RoomProvider';
import { MdSave, MdShare } from 'react-icons/md';
import { useOpenFiles } from '../Providers/OpenFilesProvider';

export const FileTreeNavbar = () => {
    const { room, roomId } = useRoom();
    const { setSaveFlag } = useOpenFiles();

    const copyToClipboard = () => {
        if (!room) {
            console.error('Room details not available!');
            return;
        }
        const url = `${window.location.origin}/room/${roomId}`;
        console.log(url);
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert(`Url id copied share it with other people`);
            })
            .catch((err) => console.error('Copy failed:', err));
    };

    return (
        <div className="h-screen w-full flex flex-col py-3 gap-6 items-center [&>*]:w-full [&>*]:cursor-pointer">
            <MdShare onClick={copyToClipboard} size={24} />

            <MdSave
                title="Save currently opened file"
                onClick={() => setSaveFlag((p) => !p)}
                size={24}
            />
        </div>
    );
};
