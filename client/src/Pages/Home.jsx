import { CONSTANTS } from '../Utils/CONSTANTS';
import Navbar from '../Components/Home/Navbar';
import LeftSidebar from '../Components/Home/LeftSidebar';
import { HomeProvider } from '../Providers/HomeProvider';
import RightSidebar from '../Components/Home/RightSidebar';

const HomeContent = () => {
    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden h-full w-full">
                <LeftSidebar />
                <div className="flex-1 flex">
                    <RightSidebar />
                </div>

            </div>
        </div>
    );
};

export const Home = () => {
    return (
        <HomeProvider>
            <HomeContent />
        </HomeProvider>
    );
};
