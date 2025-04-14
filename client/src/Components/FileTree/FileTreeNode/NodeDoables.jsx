import { UseFiles } from '../../../Providers/FilesProvider';
import { FaFileUpload, FaFolderPlus } from 'react-icons/fa';
import { EMITTER } from '../../../Utils/EMITTER';
import { FaPencil } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';

export const NodeDoables = ({ path, isFolder, setIsEditing, deletable }) => {
    const { deleteEntity } = UseFiles();

    return (
        <div className="flex gap-1 items-center">
            {isFolder && (
                <>
                    <FaFileUpload
                        onClick={(e) => {
                            e.stopPropagation();
                            EMITTER.createEntity(true, path);
                        }}
                        className="button p-0.5"
                        size={26}
                    />
                    <FaFolderPlus
                        onClick={(e) => {
                            e.stopPropagation();
                            EMITTER.createEntity(false, path);
                        }}
                        className="button p-0.5"
                        size={26}
                    />
                </>
            )}
            <FaPencil
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="button p-1"
                size={27}
            />
            {deletable && (
                <MdDelete
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteEntity(isFolder, path);
                    }}
                    className="button p-0.5"
                    size={26}
                />
            )}
        </div>
    );
};
