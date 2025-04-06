import Navbar from '../Components/Home/Navbar';
import LeftSidebar from '../Components/Home/LeftSidebar';
import RightSidebar from '../Components/Home/RightSidebar';

export const Home = () => {
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
