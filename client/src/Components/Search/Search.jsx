import { useState } from 'react';
import { UseFiles } from '../../Providers/FilesProvider';

export const Search = ({ hidden, hide }) => {
    const [searchType, setSearchType] = useState('FILE'); // FILE or FILE_CONTENT
    const [input, setInput] = useState('');

    const { fileTreeData, openFile } = UseFiles();

    const SearchFileNode = ({ name, value, path }) => {
        const isFolder = value !== null;

        const directChildren = isFolder ? Object.keys(value) : [];

        return (
            <>
                {!isFolder && name.includes(input) && (
                    <button
                        onClick={() => {
                            openFile(path);
                            hide();
                        }}
                        className="p-2"
                    >
                        {path}
                    </button>
                )}
                {directChildren.map((key, i) => {
                    return (
                        <SearchFileNode
                            key={i}
                            path={path + '/' + key}
                            name={key}
                            value={value[key]}
                        />
                    );
                })}
            </>
        );
    };

    if (hidden) return null;
    return (
        <div
            className="w-screen h-screen absolute left-0 top-0 flex flex-col justify-center items-center z-20"
            onClick={hide}
            style={{
                backgroundColor: 'rgb(0,0,0,0.5)',
            }}
        >
            <div
                className="flex flex-col gap-4 justify-center items-center bg-neutral-800 p-3 border"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-5 justify-center [&>button]:p-4 [&>button]:bg-black">
                    <button
                        onClick={() => setSearchType('FILE')}
                        className={searchType === 'FILE' ? 'animate-pulse' : ''}
                    >
                        FILE
                    </button>
                    <button
                        onClick={() => setSearchType('FILE_CONTENT')}
                        className={
                            searchType === 'FILE_CONTENT' ? 'animate-pulse' : ''
                        }
                    >
                        FILE CONTENT
                    </button>
                </div>
                <p>Search for {searchType.toLowerCase()}</p>
                <div className="">
                    <input
                        type="text"
                        className="border py-2 px-4 bg-black rounded-xl"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            searchType === 'FILE'
                                ? 'Enter file name'
                                : 'Enter content'
                        }
                    />
                </div>
                {searchType === 'FILE' && (
                    <SearchFileNode
                        name={'app'}
                        path={'/app'}
                        value={fileTreeData['app']}
                    />
                )}
                {searchType === 'FILE_CONTENT' && 'TO IMPLEMENT'}
            </div>
        </div>
    );
};
