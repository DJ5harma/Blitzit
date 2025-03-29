// dirOutput
// :
// "\u0001\u0000\u0000\u0000\u0000\u0000\u0000\"/app\n/app/testFolder\n/app/folder2\n"
// fileOutput
// :
// "\u0001\u0000\u0000\u0000\u0000\u0000\u0000,/app/testFolder/testFile.txt\n/app/script.py\n"

export const getFileTree = (dirOutput, fileOutput) => {
    // Process directory output
    dirOutput = dirOutput
        .substring(dirOutput.indexOf('/')) // Start from first /
        .trim()
        .split('\n')
        .filter(Boolean);

    fileOutput = fileOutput
        .substring(fileOutput.indexOf('/')) // Start from first /
        .trim()
        .split('\n')
        .filter(Boolean);

    const tree = {};

    function addToTree(fullPath, isFile) {
        const parts = fullPath.split('/').filter(Boolean); // Handle paths in frontend
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] =
                    index === parts.length - 1 && isFile ? null : {};
            }

            if (index === parts.length - 1 && isFile) {
                current[part] = null; // Ensure files are set to null
            }

            current = current[part];
        });
    }

    dirOutput.forEach((dir) => addToTree(dir, false));
    fileOutput.forEach((file) => addToTree(file, true));
    return JSON.parse(JSON.stringify(tree, null, 2));
};
