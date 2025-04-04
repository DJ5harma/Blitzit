import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { Editor } from '../Components/Editor';
import { FileTreeNavbar } from '../Components/FileTreeNavbar';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';
import { useResizable } from 'react-resizable-layout';

export const Room = () => {
    return (
        <OpenFilesProvider>
            <RoomProvider>
                <Component1 />
            </RoomProvider>
        </OpenFilesProvider>
    );
};

export default function Component1() {
    const { position, separatorProps } = useResizable({
        axis: 'x',
        initial: 250,
        min: 50,
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
                <FileTreeNavbar />
            </div>
            <div
                className="p-2.5"
                style={{
                    width: position, // 10
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
    const { position, separatorProps } = useResizable({
        axis: 'y',
        initial: 400,
    });

    return (
        <div className="flex flex-col h-screen w-full">
            <div
                style={{
                    height: position,
                    width: '100%',
                }}
            >
                <Editor />
            </div>
            <div
                {...separatorProps}
                className="min-h-0.5 cursor-n-resize z-20 select-none"
                style={{ backgroundColor: 'rgb(0, 120, 212)' }}
            />
            <div
                style={{
                    height: `calc(100% - ${position - 4}px)`,
                    width: '100%',
                    zIndex: 20,
                }}
            >
                <Terminal />
            </div>
        </div>
    );
}
