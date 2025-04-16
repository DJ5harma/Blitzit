import { useEffect, useState } from 'react';
import { UseRoom } from '../../Providers/RoomProvider';
import { MdEdit, MdFileCopy, MdPlayArrow } from 'react-icons/md';
import { MdSave, MdShare } from 'react-icons/md';
import { SiZendesk } from 'react-icons/si';
import { BsTerminal } from 'react-icons/bs';
import { UseFiles } from '../../Providers/FilesProvider';
import { EMITTER } from '../../Utils/EMITTER';
import { toast } from 'react-toastify';
import { toggleF11 } from '../../Utils/toggleF11';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const FileTreeNavbar = ({ setHidden }) => {
    const { roomId, project } = UseRoom();
    const { saveFile } = UseFiles();

    const [commandToRun, setCommandToRun] = useState(project.runCommand);

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

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!e.ctrlKey) return;
            const key = e.key.toLowerCase();
            console.log({ key });

            if (key === 's') {
                e.preventDefault();
                saveFile();
            } else if (key === 'q') {
                e.preventDefault();
                EMITTER.runProject(commandToRun);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [commandToRun, saveFile]);

    const buttons = [
        {
            comp: <MdFileCopy size={25} />,
            title: 'Toggle file tree: Ctrl+B',
            onClick: () => setHidden((p) => ({ ...p, fileTree: !p.fileTree })),
        },
        {
            comp: <MdPlayArrow size={30} />,
            title: 'Run project: Ctrl+Q',
            onClick: () => EMITTER.runProject(commandToRun),
            className: 'bg-gray-800',
        },
        {
            comp: <MdEdit size={30} />,
            title: 'Edit command to run',
            onClick: editCommand,
            className: 'bg-gray-800',
        },
        {
            comp: <MdShare size={30} />,
            title: 'Share link and collaborate',
            onClick: copyToClipboard,
        },
        {
            comp: <MdSave size={30} />,
            title: 'Save focused file: Ctrl+S',
            onClick: saveFile,
        },
        {
            comp: <SiZendesk size={30} />,
            title: 'Toggle Fullscreen: F11',
            onClick: toggleF11,
        },
        {
            comp: <FaSearch size={30} />,
            title: 'Search in project',
            onClick: () => setHidden((p) => ({ ...p, search: !p.search })),
        },
        {
            comp: <BsTerminal size={30} />,
            title: 'Toggle terminal: Ctrl+`',
            onClick: () => setHidden((p) => ({ ...p, terminal: !p.terminal })),
        },
    ];

    return (
        <div className="button h-screen w-full bg-black flex flex-col py-2 items-center justify-between">
            <div className="flex flex-col items-center w-full gap-4">
                {buttons.map(({ comp, onClick, title, className }, i) => {
                    return (
                        <button
                            key={i}
                            title={title}
                            className={'size-8 p-1 ' + className || ''}
                            onClick={onClick}
                        >
                            {comp}
                        </button>
                    );
                })}
            </div>
            <Link to="/" title="Go Home" className="button">
                <FaHome size={40} className="p-1" />
            </Link>
        </div>
    );
};
