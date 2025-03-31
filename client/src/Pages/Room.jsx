import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { Editor } from '../Components/Editor';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';

export const Room = () => {
    return (
        <OpenFilesProvider>
            <RoomProvider>
                <div className="flex flex-col w-screen h-screen">
                    <div className="flex h-2/3">
                        <div className="h-full w-1/5">
                            <FileTree />
                        </div>
                        <div className="h-full w-4/5 border border-green-600">
                            <Editor />
                        </div>
                    </div>
                    <div className="h-1/3 w-screen">
                        <Terminal />
                    </div>
                </div>
            </RoomProvider>
        </OpenFilesProvider>
    );
};
