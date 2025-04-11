export const CONSTANTS = {
    TEMPLATES: [
        { name: 'python-template', runCommand: "python /app/script.py" },
        { name: 'javascript-template', runCommand: "node /app/script.js" },
        { name: 'cpp-template', runCommand: "g++ app.cpp -o app && ./app" },
    ],
    BACKEND_URL: 'http://localhost:4000', // Changed from server to localhost
    WEBRTC_SERVER_URL: 'ws://localhost:4444', // Changed from server to localhost
};
