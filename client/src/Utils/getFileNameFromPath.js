export function getFileNameFromPath(path) {
    return path.substring(path.lastIndexOf('/') + 1);
}
