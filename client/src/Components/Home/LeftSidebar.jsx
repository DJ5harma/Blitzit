import React from 'react';
import { useHomeContext } from '../../Providers/HomeProvider';

const LeftSidebar = () => {
    const { activeTab, setActiveTab } = useHomeContext();
    return (
        <div>
            <div className="w-64 bg-gray-900 border-r border-gray-700 h-full p-4 flex flex-col gap-2">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`p-3 text-left rounded-md transition-colors ${
                        activeTab === 'new'
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-800'
                    }`}
                >
                    New Project
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`p-3 text-left rounded-md transition-colors ${
                        activeTab === 'projects'
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-800'
                    }`}
                >
                    Your Projects
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`p-3 text-left rounded-md transition-colors ${
                        activeTab === 'profile'
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-800'
                    }`}
                >
                    Profile
                </button>
            </div>
        </div>
    );
};

export default LeftSidebar;
