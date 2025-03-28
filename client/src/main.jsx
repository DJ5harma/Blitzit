import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SocketProvider } from "./Providers/SocketProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { FilesProvider } from "./Providers/FilesProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <FilesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FilesProvider>
    </SocketProvider>
  </StrictMode>
);
