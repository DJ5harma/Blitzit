import { useNavigate } from "react-router-dom";
import { UseHome } from "../../../Providers/HomeProvider";
import { formatDate } from "../../../Utils/formatDate";
import { toast } from 'react-toastify';

export const YourProjects = () => {
    const { projects, setProjects } = UseHome();
    const navigate = useNavigate();
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
            <button
                onClick={() => {
                    localStorage.removeItem('projects');
                    setProjects([]);
                    toast('Deleted');
                }}
            >
                Delete localdata
            </button>
            {projects.map(({ title, roomId, createdAt }, i) => (
                <div
                    key={i}
                    className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer 
                       aspect-square flex flex-col items-center justify-center text-center
                       w-full max-w-[200px] mx-auto"
                    onClick={() => {
                        navigate(`room/${roomId}`);
                    }}
                >
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm px-2">{roomId}</p>
                    <p className="text-gray-400 text-sm px-2">
                        {formatDate(createdAt)}
                    </p>
                </div>
            ))}
        </div>
    );
};
