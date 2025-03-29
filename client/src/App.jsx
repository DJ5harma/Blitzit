import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Room } from './Pages/Room';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </>
    );
}

export default App;
