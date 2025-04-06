import React from 'react';
import { UseHome } from '../../Providers/HomeProvider';

const arr = [
    { heading: 'New Project', activeTabName: 'new' },
    { heading: 'Your Projects', activeTabName: 'projects' },
    { heading: 'Profile', activeTabName: 'profile' },
];

export const LeftSidebar = () => {
    const { activeTab, setActiveTab } = UseHome();
    return (
        <div className="w-64 bg-gray-900 border-r border-gray-700 h-full p-4 flex flex-col gap-2">
            {arr.map(({ heading, activeTabName }, i) => {
                return (
                    <button
                        key={i}
                        onClick={() => setActiveTab(activeTabName)}
                        className={`p-3 text-left rounded-md transition-colors ${
                            activeTab === activeTabName
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-800'
                        }`}
                    >
                        {heading}
                    </button>
                );
            })}
        </div>
    );
};
