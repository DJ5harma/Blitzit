import { Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Room } from './Pages/Room';
import { HomeProvider } from './Providers/HomeProvider';
function App() {
    return (
        <HomeProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </HomeProvider>
    );
}

export default App;
