export const CONSTANTS = {
    TEMPLATES: [
        { name: 'python-template', runCommand: "python /app/script.py" },
        { name: 'javascript-template', runCommand: "node /app/script.js" },
        { name: 'cpp-template', runCommand: "g++ /app/main.cpp -o /app/main && /app/main" },
        { name: 'java-template', runCommand: "java /app/App.java" },
    ],
    BACKEND_URL: 'http://localhost:4000', // Changed from server to localhost
    WEBRTC_SERVER_URL: 'ws://localhost:4444', // Changed from server to localhost
};
