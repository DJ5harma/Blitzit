// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { SocketProvider } from './Providers/SocketProvider.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <>
        <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastStyle={{
                backgroundColor: 'rgb(10, 40, 120)',
                color: 'white',
            }}
        />
        <SocketProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SocketProvider>
    </>
    // </StrictMode>
);
