import React from 'react';
import { useHomeContext } from '../../Providers/HomeProvider';

const Navbar = () => {
    const { setActiveTab } = useHomeContext();

    return (
        <nav className="bg-blue-900 text-white h-16 flex items-center justify-between px-8 border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <span className="text-xl font-bold">Code Editor</span>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setActiveTab('new')}
                >
                    New Project
                </button>
                <button
                    className="px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => console.log('Login clicked')}
                >
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
