import Navbar from '../Components/Home/Navbar';
import { LeftSidebar } from '../Components/Home/LeftSidebar';
import { RightSection } from '../Components/Home/RightSection';

export const Home = () => {
    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden h-full w-full">
                <LeftSidebar />
                <div className="flex-1 flex">
                    <RightSection />
                </div>
            </div>
        </div>
    );
};
