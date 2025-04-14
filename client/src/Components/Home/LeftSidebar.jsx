import { UseHome } from '../../Providers/HomeProvider';

export const LeftSidebar = () => {
    const { activeTab, setActiveTab, tabNames } = UseHome();
    return (
        <div className="w-64 bg-gray-900 border-r border-gray-700 h-full p-4 flex flex-col gap-2">
            {tabNames.map((name) => {
                return (
                    <button
                        key={name}
                        onClick={() => setActiveTab(name)}
                        className={`p-3 text-left rounded-md transition-colors ${
                            activeTab === name
                                ? 'bg-gray-700'
                                : 'hover:bg-gray-800'
                        }`}
                    >
                        {name[0].toUpperCase() + name.slice(1)}
                    </button>
                );
            })}
        </div>
    );
};
