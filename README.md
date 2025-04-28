## Blitzit: Scalable, Containerized & Collaborative IDE

Too lazy to configure your local machine? 
Try our ready-to-go online code environment...

- Built A Replit clone using React, Node.js, Socket.IO, and Redis PUB/SUB.
- Isolated project execution via Docker container orchestration to simulate isolated coding environments.
- Added modern file-tree, terminal and editor simulation for intuitive UX at frontend.
- Designed a scalable backend with Redis for event broadcasting and MongoDB for persistence.
- Collaboration in real-time with peers using WebRTC to enhance overall project workflows.
- Tech Stack: Redis, Dockerode, Docker, Socket.io, WebRTC, React.js, Javascript, Node.js, Mongoose, MongoDB.

### To run locally,

ensure docker and run `docker compose up`


The Webrtc server runs on port : 4444
The main server runs on port : 4000
The client react runs on port: 3000
The redis server runs on port: 6379
The mongoDB server runs on port: 27017