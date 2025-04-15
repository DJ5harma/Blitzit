import { useState } from 'react';
import { UseRoom } from '../../Providers/RoomProvider';
import { MdEdit, MdFileCopy, MdPlayArrow } from 'react-icons/md';
import { MdSave, MdShare } from 'react-icons/md';
import { SiZendesk } from 'react-icons/si';
import { BsTerminal } from 'react-icons/bs';
import { LuSquareSplitHorizontal } from "react-icons/lu";
import { UseFiles } from '../../Providers/FilesProvider';
import { EMITTER } from '../../Utils/EMITTER';
import { toast } from 'react-toastify';
import { toggleF11 } from '../../Utils/toggleF11';
import { FaHome, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const FileTreeNavbar = ({ setHidden }) => {
    const { roomId, project } = UseRoom();
    const { saveFile ,createNewEditor , editorStates , activeEditorIndex } = UseFiles();

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

    const handleSplitTerminal = () => {
        const currentState = editorStates[activeEditorIndex];
        console.log(currentState);
        
        createNewEditor({
            openPaths: [...currentState.openPaths],
            focusedPath: currentState.focusedPath
        });

    }

    const buttons = [
        {
            comp: <MdFileCopy size={20} />,
            title: 'Toggle file tree',
            onClick: () => setHidden((p) => ({ ...p, fileTree: !p.fileTree })),
        },
        {
            comp: <MdPlayArrow size={25} />,
            title: 'Run project',
            onClick: () => EMITTER.runProject(commandToRun),
            className: 'bg-gray-800',
        },
        {
            comp: <MdEdit size={25} />,
            title: 'Edit command to run',
            onClick: editCommand,
            className: 'bg-gray-800',
        },
        {
            comp: <MdShare size={25} />,
            title: 'Share link and collaborate',
            onClick: copyToClipboard,
        },
        {
            comp: <MdSave size={25} />,
            title: 'Save currently opened file',
            onClick: saveFile,
        },
        {
            comp: <SiZendesk size={25} />,
            title: 'Toggle Fullscreen',
            onClick: toggleF11,
        },
        {
            comp: <FaSearch size={25} />,
            title: 'Search in project',
            onClick: () => setHidden((p) => ({ ...p, search: !p.search })),
        },
        {
            comp: <BsTerminal size={25} />,
            title: 'Toggle terminal',
            onClick: () => setHidden((p) => ({ ...p, terminal: !p.terminal })),
        },
        {
            comp: <LuSquareSplitHorizontal size={25} />,
            title : 'Split Editor',
            onClick : handleSplitTerminal,
            className: editorStates.length > 1 ? 'text-blue-500' : '',
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
                            className={`size-8 p-1 flex items-center justify-center ${className || ''}`}
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
