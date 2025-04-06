import React, { useEffect, useState } from 'react';
import { useHomeContext } from '../../Providers/HomeProvider';
import { useSocket } from '../../Providers/SocketProvider';
import { useNavigate } from 'react-router-dom';
import { CONSTANTS } from '../../Utils/CONSTANTS';

const RightSidebar = () => {
    const { activeTab } = useHomeContext();
    const { skt } = useSocket();
    const [makingTemplate, setMakingTemplate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        skt.on('createContainer -o1', ({ roomId }) => {
            navigate(`room/${roomId}`);
        });
        return () => {
            skt.removeListener('createContainer -o1');
        };
    }, [navigate, skt]);

    if (makingTemplate)
        return (
            <div className="w-full h-full flex items-center justify-center">
                Making your template...
            </div>
        );

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        Your Projects
                    </div>
                )}

                {activeTab === 'new' && (
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {CONSTANTS.TEMPLATES.map(
                                ({ name, description }, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer 
                           aspect-square flex flex-col items-center justify-center text-center
                           w-full max-w-[200px] mx-auto"
                                        onClick={() => {
                                            skt.emit('createContainer', {
                                                Image: name,
                                            });
                                            setMakingTemplate(true);
                                        }}
                                    >
                                        <h3 className="text-lg font-semibold mb-2">
                                            {name}
                                        </h3>
                                        <p className="text-gray-400 text-sm px-2">
                                            {description}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">
                            User Profile
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightSidebar;
