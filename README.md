## Blitzit: Scalable, Containerized & Collaborative IDE

Too lazy to configure your local machine? 
Try our ready-to-go online code environment...

- Built A Replit clone using React, Node.js, Socket.IO, and Redis PUB/SUB.
- Isolated project execution via Docker container orchestration to simulate isolated coding environments.
- Added modern file-tree, terminal and editor simulation for intuitive UX at frontend.
- Designed a scalable backend with Redis for event broadcasting and MongoDB for persistence.
- Collaboration in real-time with peers using WebRTC to enhance overall project workflows.
- Tech Stack: Redis, Dockerode, Docker, Socket.io, WebRTC, React.js, Javascript, Node.js, Mongoose, MongoDB.


![Blitzit Flow](https://github.com/user-attachments/assets/d563bb83-68f4-46d7-ad4f-a1f53e0c809e)

-------------------------------

![Blitzit SS1](https://github.com/user-attachments/assets/3be28b2d-baf3-4a60-9b5e-d626d694ff3c)

-------------------------------

![Blitzit SS2](https://github.com/user-attachments/assets/e0e6d27e-e371-45e6-93a0-548484fbe9c2)


### To run locally,

ensure docker and run `docker compose up`

Wait and it'll automatically run these: 

- The Webrtc server runs on port : `4444`
- The main server runs on port : `4000`
- The client react runs on port : `3000`
- The redis server runs on port : `6379`
- The mongoDB server runs on port : `27017`

After auto setup, go to `localhost:3000` on any browser
