import { Terminal } from '../Components/Terminal';
import { FileTree } from '../Components/FileTree';
import { Editor } from '../Components/Editor';
import { OpenFilesProvider } from '../Providers/OpenFilesProvider';
import { RoomProvider } from '../Providers/RoomProvider';

export const Room = () => {
    return (
        <OpenFilesProvider>
            <RoomProvider>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100vw',
                        height: '100vh',
                    }}
                >
                    <div style={{ height: '70vh', display: 'flex' }}>
                        <div style={{ height: '100%', width: '20vw' }}>
                            <FileTree />
                        </div>
                        <div
                            style={{
                                height: '100%',
                                width: '80vw',
                                border: 'solid green',
                            }}
                        >
                            <Editor />
                        </div>
                    </div>
                    <div
                        style={{
                            height: '30vh',
                            width: "100vw",
                        }}
                    >
                        <Terminal />
                    </div>
                </div>
            </RoomProvider>
        </OpenFilesProvider>
    );
};
