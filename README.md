<p align="center">
  <a href="https://dls-backend-uelx.onrender.com/">
    <img src="noZip/docs/img/logo/dls-logo.svg" alt="DLS Logo" width="120" />
  </a>
</p>

<h1 align="center">DLS Backend — Dynamic Lecture System Server</h1>

<p align="center">
  REST + realtime backend for the Dynamic Lecture System project:
  users, sessions, PDF handling, live Q&A, and Socket.IO lecture rooms.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Multer-PDF_Upload-7C3AED" alt="Multer" />
  <img src="https://img.shields.io/badge/Postman-Tested-FF6C37?logo=postman&logoColor=white" alt="Postman" />
  <img src="https://img.shields.io/badge/Status-Live_Prototype-2563EB" alt="Status" />
</p>

<p align="center">
  <a href="https://dls-backend-uelx.onrender.com/">
    <img src="https://img.shields.io/badge/Live_Backend-Render-46E3B7?logo=render&logoColor=black" alt="Live Backend" />
  </a>
  <a href="https://github.com/DorManDel/DLS-Backend/tree/V1-Sessions_and_Questions_db_integrations">
    <img src="https://img.shields.io/badge/Production_Branch-V1--Sessions--and--Questions--db--integrations-22C55E?logo=github&logoColor=white" alt="Backend Production Branch" />
  </a>
  <a href="https://yuutamw.github.io/WEB-project-No.-2/">
    <img src="https://img.shields.io/badge/Live_Frontend-GitHub_Pages-181717?logo=github&logoColor=white" alt="Live Frontend" />
  </a>
  <a href="https://github.com/YuutamW/WEB-project-No.-2/tree/dashboard-core-layout-refactor">
    <img src="https://img.shields.io/badge/Frontend_Branch-dashboard--core--layout--refactor-22C55E?logo=github&logoColor=white" alt="Frontend Production Branch" />
  </a>
  <a href="https://www.figma.com/design/9i2kHP9lS4gbiZunjcRXXg/DLS---Dynamic-Lecture-System?node-id=0-1&p=f&t=apUaMVJGVwu2voGb-0">
    <img src="https://img.shields.io/badge/Figma-Design-F24E1E?logo=figma&logoColor=white" alt="Figma Design" />
  </a>
  <a href="https://github.com/users/DorManDel/projects/2/views/2">
    <img src="https://img.shields.io/badge/GitHub_Project-Board-181717?logo=github&logoColor=white" alt="Project Board" />
  </a>
  <a href="https://wntrb1st-6589366.postman.co/workspace/yotam-wntrb%27s-Workspace~e10001c2-2a1d-4108-8b48-55d61a2c34a4/request/54631479-644eec6d-7064-43f7-baaf-0398f8db7ab8?tab=params">
    <img src="https://img.shields.io/badge/Postman-API_Workspace-FF6C37?logo=postman&logoColor=white" alt="Postman Workspace" />
  </a>
  <a href="https://github.com/DorManDel/DLS-Backend/blob/V1-Sessions_and_Questions_db_integrations/ListOfModulesAndApis.md">
    <img src="https://img.shields.io/badge/Modules_%26_APIs-Backend_Map-7C3AED?logo=github&logoColor=white" alt="Modules and APIs" />
  </a>
</p>

---

> [!WARNING]
> **Demo environment only.** Do not use real passwords, private tokens, API keys, private files, or sensitive personal information in this project demo.

---

## Overview

This repository contains the backend server for **DLS — Dynamic Lecture System**.

The backend receives requests from the frontend, manages users and sessions, handles uploaded PDF presentations, stores questions, and broadcasts realtime lecture events through Socket.IO.

The frontend does not connect directly to MongoDB.  
All persistent data is handled through this backend API.

---

## Live Links

| Resource | Link |
|---|---|
| Backend API | [Live Backend – Render](https://dls-backend-uelx.onrender.com/) |
| Production Branch | [Backend Production Branch](https://github.com/DorManDel/DLS-Backend/tree/V1-Sessions_and_Questions_db_integrations) |
| Frontend | [Live Frontend – GitHub Pages](https://yuutamw.github.io/WEB-project-No.-2/) |
| Frontend Production Branch | [Frontend Branch](https://github.com/YuutamW/WEB-project-No.-2/tree/dashboard-core-layout-refactor) |
| Figma | [DLS Design File](https://www.figma.com/design/9i2kHP9lS4gbiZunjcRXXg/DLS---Dynamic-Lecture-System?node-id=0-1&p=f&t=apUaMVJGVwu2voGb-0) |
| GitHub Project Board | [DLS Project Board](https://github.com/users/DorManDel/projects/2/views/2) |
| Postman | [DLS API Workspace](https://wntrb1st-6589366.postman.co/workspace/yotam-wntrb%27s-Workspace~e10001c2-2a1d-4108-8b48-55d61a2c34a4/request/54631479-644eec6d-7064-43f7-baaf-0398f8db7ab8?tab=params) |
| Backend Modules & APIs | [ListOfModulesAndApis.md](https://github.com/DorManDel/DLS-Backend/blob/V1-Sessions_and_Questions_db_integrations/ListOfModulesAndApis.md) |

---

<details open>
<summary><strong>Backend Responsibilities</strong></summary>

<br>

The DLS backend is responsible for:

| Area | Responsibility |
|---|---|
| Users | Signup, login, update and delete user data |
| Sessions | Create live sessions, join sessions, load recent sessions and end sessions |
| PDFs | Receive uploaded PDF files and serve session PDFs back to the frontend |
| Questions | Save, load, filter and broadcast student questions |
| Realtime | Manage Socket.IO rooms for live lecture sessions |
| Dashboard Data | Provide data for lecturer and student dashboards |
| Summary Data | Support question summary and session review flows |
| Security Foundation | Environment variables and future authentication hardening |

</details>

---

<details open>
<summary><strong>Core Backend Flow</strong></summary>

<br>

| Step | Layer | What happens |
|---:|---|---|
| 1 | Frontend / Postman | Sends HTTP request or Socket.IO event |
| 2 | Express App | Receives request and applies middleware |
| 3 | Route | Maps URL to the correct controller |
| 4 | Controller | Validates input and coordinates the action |
| 5 | Model / Database | Reads or writes data using Mongoose / MongoDB |
| 6 | Socket Manager | Emits realtime events when needed |
| 7 | Response | Sends JSON response or PDF file back to the client |

```txt
Frontend / Postman
→ Express App
→ Route
→ Controller
→ Model / MongoDB
→ Optional Socket.IO Emit
→ JSON / File Response
```

</details>

---

<details open>
<summary><strong>Backend Tech Stack</strong></summary>

<br>

| Layer | Technologies | Role |
|---|---|---|
| Runtime | <img src="https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white" alt="Node.js" /> | Runs the backend JavaScript server |
| HTTP API | <img src="https://img.shields.io/badge/Express-REST_API-000000?logo=express&logoColor=white" alt="Express" /> | Defines API routes and HTTP request handling |
| Database | <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" alt="MongoDB" /> | Stores users, sessions, questions and file metadata |
| ODM | <img src="https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white" alt="Mongoose" /> | Defines schemas and models for MongoDB data |
| Realtime | <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socketdotio&logoColor=white" alt="Socket.IO" /> | Manages live rooms and realtime Q&A events |
| File Upload | <img src="https://img.shields.io/badge/Multer-Upload_Middleware-7C3AED" alt="Multer" /> | Receives multipart/form-data PDF uploads |
|  Optional File Streaming | <img src="https://img.shields.io/badge/GridFS-Prepared_File_Streaming-4F46E5" alt="GridFS" /> | Installed / prepared for MongoDB file streaming; verify active usage before claiming it as the main PDF storage flow  |
| Config | <img src="https://img.shields.io/badge/dotenv-Environment_Config-ECD53F" alt="dotenv" /> | Loads local environment variables from `.env` |
| Auth Foundation | <img src="https://img.shields.io/badge/JWT-Prepared_Auth-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" /> | Installed / prepared for token-based authentication; current auth flow should be verified before marking JWT as active | 
| API Testing | <img src="https://img.shields.io/badge/Postman-API_Workspace-FF6C37?logo=postman&logoColor=white" alt="Postman" /> | Tests and documents backend requests |
| Deployment | <img src="https://img.shields.io/badge/Render-Live_Backend-46E3B7?logo=render&logoColor=black" alt="Render" /> | Hosts the live backend service |

</details>

---

<details>
<summary><strong>External NPM Modules</strong></summary>

<br>

| Package | Version | Status | Role |
|---|---:|---|---|
| `express` | `^5.2.1` | Active | Creates the REST API server and routes |
| `cors` | `^2.8.6` | Active | Allows frontend/backend communication across origins |
| `dotenv` | `^17.4.2` | Active | Loads `.env` variables into `process.env` |
| `mongoose` | `^9.7.1` | Active | Defines schemas/models such as User, Session and Question |
| `mongodb` | `^7.3.0` | Active / dependency | Native MongoDB driver used by MongoDB tooling |
| `multer` | `^2.2.0` | Active | Handles multipart/form-data PDF uploads |
| `socket.io` | `^4.8.3` | Active | Manages live rooms, question events and session updates |
| `jsonwebtoken` | `^9.0.3` | Prepared / verify usage | JWT authentication foundation if token auth is enabled |
| `gridfs-stream` | `^1.1.1` | Prepared / verify usage | Optional MongoDB GridFS file streaming support |
| `nodemon` | `^3.1.14` | Dev only | Restarts the server automatically during development |

</details>

---

<details open>
<summary><strong>API Summary</strong></summary>

<br>

Main frontend-facing routes:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/users/signup` | Create a new user |
| `POST` | `/api/users/login` | Login user |
| `PUT` | `/api/users/:id` | Update user details |
| `DELETE` | `/api/users/:id` | Delete user |
| `POST` | `/api/sessions` | Create a live lecture session |
| `GET` | `/api/sessions/recent` | Load recent sessions |
| `GET` | `/api/sessions/:code` | Load session by room code |
| `POST` | `/api/sessions/:code/join` | Join an existing live session |
| `GET` | `/api/sessions/:code/pdf` | Fetch the session PDF file |
| `POST` | `/api/sessions/:code/end` | End a live session |
| `POST` | `/api/questions` | Create a new question |
| `GET` | `/api/questions` | Load questions with optional filters |

</details>

---

## Workflows

<details open>
<summary><strong>Session Workflow</strong></summary>

<br>

```txt
Lecturer starts a live lecture
→ Frontend sends POST /api/sessions with PDF data
→ Backend creates a session code
→ Backend stores session metadata
→ Backend receives/stores the uploaded PDF
→ Backend returns session data to the lecturer
→ Lecturer and students join Socket.IO room
→ Students join using room code / QR
```

Session data is used by both dashboards and the presentation viewer.

</details>

<details open>
<summary><strong>PDF Upload and Fetch Workflow</strong></summary>

<br>

```txt
Lecturer selects PDF
→ Frontend builds FormData
→ Frontend sends upload request to backend
→ Multer receives the PDF file
→ Backend stores or serves the uploaded PDF according to the current session file implementation
→ Student joins the session
→ Frontend requests GET /api/sessions/:code/pdf
→ Backend sends the PDF file
→ Frontend converts response to Blob
→ PDF.js renders the PDF in the browser
```

Important distinction:

| Part | Owned By | Role |
|---|---|---|
| `FormData` | Frontend | Sends the selected PDF file |
| `Multer` | Backend | Receives multipart file uploads |
| Session PDF storage | Backend | Keeps the uploaded PDF available for the session |
| `fetch(...).blob()` | Frontend | Converts file response into a browser Blob |
| `PDF.js` | Frontend | Renders PDF pages |

</details>

<details open>
<summary><strong>Question Workflow</strong></summary>

<br>

```txt
Student creates a question on a slide
→ Frontend sends POST /api/questions
→ Backend validates the question payload
→ Backend saves question data with page + relative x/y
→ Backend emits question:created to the Socket.IO room
→ Lecturer and students receive the update
→ Q&A drawer and markers refresh
```

Question object example:

```json
{
  "code": "90C56A",
  "sessionId": "90C56A",
  "fileName": "demo.pdf",
  "page": 2,
  "x": 0.42,
  "y": 0.31,
  "text": "Can you explain this part?",
  "status": "open",
  "color": "#ff3b6b",
  "studentName": "Anonymous",
  "isAnonymous": true
}
```

</details>

<details open>
<summary><strong>Socket.IO Workflow</strong></summary>

<br>

Each live lecture session uses a dedicated Socket.IO room.

```txt
Room format:
presentation:<sessionCode>
```

Example:

```txt
presentation:90C56A
```

Realtime flow:

```txt
Client connects to Socket.IO
→ Client joins presentation:<sessionCode>
→ Backend confirms room join
→ Question is created through REST API
→ Backend emits question:created to the room
→ Connected lecturer/student clients receive the event
```

Main events:

| Event | Direction | Purpose |
|---|---|---|
| `presentation:join` | Client → Server | Join a live presentation room |
| `presentation:joined` | Server → Client | Confirm socket room connection |
| `question:created` | Server → Clients | Broadcast a new question |
| `session:participantsUpdated` | Server → Clients | Update participant count/list |
| `session:ended` | Server → Clients | Notify clients that a lecture session ended |
| `presentation:page-changed` | Client ↔ Server | Foundation for follow lecturer page sync |

</details>

---

<details>
<summary><strong>Environment Variables</strong></summary>

<br>

Create a local `.env` file in the backend project root.

Example:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_local_demo_secret
CLIENT_ORIGIN=http://127.0.0.1:5500
```

> [!IMPORTANT]
> The real `.env` file must not be uploaded to GitHub.  
> Use `.env.example` for public documentation.

</details>

---

<details>
<summary><strong>Health Check</strong></summary>

<br>

Request:

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "DLS server is running",
  "data": {
    "port": 3000,
    "environment": "development"
  }
}
```

</details>

---

<details>
<summary><strong>Postman Tests</strong></summary>

<br>

The API was tested with Postman.

[Open DLS API Workspace](https://wntrb1st-6589366.postman.co/workspace/yotam-wntrb%27s-Workspace~e10001c2-2a1d-4108-8b48-55d61a2c34a4/request/54631479-644eec6d-7064-43f7-baaf-0398f8db7ab8?tab=params)


</details>

---

<details>
<summary><strong>HTTP Response Guide</strong></summary>

<br>

Common status codes:

| Status | Meaning | Used When |
|---:|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | New resource created |
| `400` | Bad Request | Missing or invalid client data |
| `401` | Unauthorized | Authentication is missing or invalid |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate or conflicting data |
| `500` | Server Error | Unexpected server problem |

</details>

---

<details open>
<summary><strong>Current Status</strong></summary>

<br>

DLS Backend is currently a working live prototype connected to the frontend.

Implemented / integrated areas:

- Users API
- Sessions API
- Questions API
- PDF upload/fetch flow
- MongoDB / Mongoose data layer
- Socket.IO live room foundation
- Postman testing workflow
- Render deployment

Still in progress:

- Production-level authentication hardening
- Complete old-session replay mode
- Full annotation / layer persistence
- More detailed role permissions
- Stronger error standardization
- Expanded automated tests

</details>

---

<details>
<summary><strong>Team Workflow</strong></summary>

<br>

Work is tracked through the project board:

[DLS GitHub Project Board](https://github.com/users/DorManDel/projects/2/views/2)

General workflow:

```txt
Create branch
→ Implement small backend feature/fix
→ Test locally with frontend and Postman
→ Commit
→ Push
→ Deploy to Render
→ Verify live frontend/backend behavior
```

</details>

---

## Security & Demo Notice

> [!IMPORTANT]
> DLS Backend is part of an academic live prototype.

> [!WARNING]
> Do not use real passwords, private tokens, API keys, personal documents, or sensitive information in demo environments.

For testing, use only demo users, demo PDFs and non-sensitive lecture materials.

Production hardening should include:

- Password hashing
- Authentication tokens / sessions
- Input validation
- Permission checks
- Protected admin/debug routes
- Secure environment variable handling
- Database access rules
- Upload size/type validation

---

## Thank you for reading :)
