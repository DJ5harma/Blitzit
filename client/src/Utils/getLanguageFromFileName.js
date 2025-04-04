export const getLanguageFromFileName = (fileName) => {
    const ext = fileName.split('.').pop();
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
            return 'c++';
        case 'cpp':
            return 'c++';
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
