export const getLanguageFromFilePath = (path) => {
    const ext = path.substring(path.lastIndexOf('.') + 1);
    switch (ext) {
        case 'js':
            return 'javascript';
        case 'ts':
            return 'typescript';
        case 'py':
            return 'python';
        case 'html':
            return 'html';
        case 'htm':
            return 'html';
        case 'css':
            return 'css';
        case 'c++':
            return 'cpp';
        case 'cpp':
            return 'cpp';
        case 'java':
            return 'java';
        case 'rs':
            return 'rust';
        case 'go':
            return 'go';
        default:
            return 'plaintext';
    }
};
