export function getFileTree(rawOutput) {
    const lines = rawOutput.trim().split('\n').filter(Boolean);
    const tree = {};

    function addToTree(fullPath, isFile) {
        const parts = fullPath.split('/').filter(Boolean);
        let current = tree;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            if (!current[part]) {
                current[part] = isLast && isFile ? null : {};
            }
            current = current[part];
        });
    }

    lines.forEach((line) => {
        const isDir = line.endsWith('/');
        addToTree(line, !isDir);
    });

    return JSON.parse(JSON.stringify(tree, null, 2));
}

// usage
// let rawOutput =
//     '/app/\n/app/test/\n/app/test/testfile.txt\n/app/hello/\n/app/script.py\n';

// console.log(getFileTree(rawOutput));
