import { useEffect, useState } from 'react';
import { UseSocket } from '../../../Providers/SocketProvider';
import { useNavigate } from 'react-router-dom';
import { CONSTANTS } from '../../../Utils/CONSTANTS';

export const NewProject = () => {
    const { skt } = UseSocket();
    const [makingTemplate, setMakingTemplate] = useState(false);

    const navigate = useNavigate();

    function createProject({ name, runCommand }) {
        const title = prompt("Enter project's title...");
        if (title === null) return;
        skt.emit('CreateContainer', {
            Image: name,
            title,
            runCommand,
        });
        setMakingTemplate(true);
    }
    useEffect(() => {
        skt.on('CONTAINER_CREATED', ({ roomId }) => {
            navigate(`room/${roomId}`);
        });
        return () => {
            skt.removeListener('CONTAINER_CREATED');
        };
    }, [navigate, skt]);

    if (makingTemplate)
        return (
            <div className="w-full h-full flex items-center justify-center">
                Making your template...
            </div>
        );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
            <h2 className="text-2xl font-bold mb-6">
                Templates to choose from
            </h2>
            {CONSTANTS.TEMPLATES.map(({ name, description, runCommand }, i) => (
                <div
                    key={i}
                    className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer 
                           aspect-square flex flex-col items-center justify-center text-center
                           w-full max-w-[200px] mx-auto"
                    onClick={() => createProject({ name, runCommand })}
                >
                    <h3 className="text-lg font-semibold mb-2">{name}</h3>
                    <p className="text-gray-400 text-sm px-2">{description}</p>
                </div>
            ))}
        </div>
    );
};
