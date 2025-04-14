import Navbar from '../Components/Home/Navbar';
import { LeftSidebar } from '../Components/Home/LeftSidebar';
import { UseHome } from '../Providers/HomeProvider';

export const Home = () => {
    const { currTabComponent } = UseHome();
    return (
        <div className="w-screen h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 overflow-hidden h-full w-full">
                <LeftSidebar />
                <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
                    {currTabComponent}
                </div>
            </div>
        </div>
    );
};
