// find -type d
let dirOutput =
    "\u0001\u0000\u0000\u0000\u0000\u0000\u00009.\n./testFolder1\n./testFolder2\n./testFolder2/nestedFolder\n";

// find -type f
let fileOutput =
    "\u0001\u0000\u0000\u0000\u0000\u0000\u0000;./testFolder1/file2.js\n./testFolder1/file1.txr\n./script.py\n";

function getFileTree(dirOutput, fileOutput) {
    // Process directory output
    dirOutput = dirOutput
        .substring(dirOutput.indexOf(".") + 1)
        .trim()
        .split("\n");
    fileOutput = fileOutput
        .substring(fileOutput.indexOf(";") + 1)
        .trim()
        .split("\n");

    const tree = {};

    function addToTree(fullPath, isFile) {
        const parts = fullPath.split("/").filter(Boolean); // Handle paths in frontend
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] =
                    index === parts.length - 1 && isFile ? null : {};
            }
            current = current[part];
        });
    }

    dirOutput.forEach((dir) => addToTree(dir, false));
    fileOutput.forEach((file) => addToTree(file, true));

    return tree;
}
console.log(
    JSON.parse(JSON.stringify(getFileTree(dirOutput, fileOutput), null, 2))
);
