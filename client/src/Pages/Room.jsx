import { FileTree } from '../Components/FileTree/FileTree';
import { FileTreeNavbar } from '../Components/FileTree/FileTreeNavbar';
//
import { Editor } from '../Components/Editor/Editor';
import { EditorTabs } from '../Components/Editor/EditorTabs';
//
import { Terminal } from '../Components/Terminal';
//
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';
//
import { useCallback, useEffect, useRef, useState } from 'react';
//
import { useResizable } from 'react-resizable-layout';
//
import { BsTerminalFill } from 'react-icons/bs';
import { FaArrowUp } from 'react-icons/fa';

export const Room = () => {
    return (
        <RoomProvider>
            <OpenFilesProvider>
                <Component1 />
            </OpenFilesProvider>
        </RoomProvider>
    );
};

export default function Component1() {
    const { position, setPosition, separatorProps } = useResizable({
        axis: 'x',
        initial: 250,
    });

    const sideBarWidth = 70;

    return (
        <div className="flex h-screen w-screen overflow-x-hidden">
            <div
                style={{
                    width: sideBarWidth,
                    borderRight: 'solid 1px rgb(0, 120, 212)',
                }}
            >
                <FileTreeNavbar
                    setPosition={setPosition}
                    currentPosition={position}
                />
            </div>
            <div
                style={{
                    width: position,
                }}
            >
                <FileTree />
            </div>
            <div
                {...separatorProps}
                className="w-0.5 cursor-e-resize"
                style={{ backgroundColor: 'rgb(0, 120, 212)' }}
            />
            <div
                id="YE WALA"
                style={{
                    width: `calc(100% - ${sideBarWidth + position}px)`,
                }}
            >
                <Component2 />
            </div>
        </div>
    );
}

function Component2() {
    const containerRef = useRef(null);
    const { position, setPosition, separatorProps } = useResizable({
        axis: 'y',
        initial: 400,
    });
    const [isTerminalOpen, setIsTerminalOpen] = useState(true);

    const toggleTerminal = useCallback(() => {
        if (containerRef.current) {
            const containerHeight = containerRef.current.clientHeight;
            if (isTerminalOpen) {
                setPosition(containerHeight + 4);
            } else {
                setPosition(400);
            }
            setIsTerminalOpen(!isTerminalOpen);
        }
    }, [isTerminalOpen, setPosition]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                toggleTerminal();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [toggleTerminal]);

    return (
        <div ref={containerRef} className="flex flex-col h-screen w-full">
            <div
                style={{ height: position, width: '100%' }}
                className="flex flex-col text-white"
            >
                <EditorTabs />
                <Editor />
            </div>
            <div
                {...separatorProps}
                className="min-h-0.5 cursor-n-resize z-20 select-none"
                style={{ backgroundColor: 'rgb(0, 120, 212)' }}
            />
            <div
                className="w-full z-20 pl-2 pt-2 bg-black"
                style={{
                    height: `calc(100% - ${position - 4}px)`,
                }}
            >
                <Terminal />
                <button
                    className="z-20 fixed bottom-4 right-4 p-2 flex gap-2 items-center"
                    style={{
                        backgroundColor: 'rgb(10, 20, 120)',
                        border: 'solid rgb(0, 120, 212) 3px',
                    }}
                    onClick={toggleTerminal}
                    title={(isTerminalOpen ? 'Hide' : 'Show') + ' terminal'}
                >
                    <FaArrowUp
                        style={{ rotate: isTerminalOpen ? '180deg' : '0deg' }}
                    />
                    <BsTerminalFill size={40} />
                </button>
            </div>
        </div>
    );
}
