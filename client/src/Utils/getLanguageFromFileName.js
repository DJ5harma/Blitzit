export const getLanguageFromFileName = (fileName) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
        case 'js':
            return 'javascript';
        case 'py':
            return 'python';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        default:
            return 'plaintext';
    }
};
