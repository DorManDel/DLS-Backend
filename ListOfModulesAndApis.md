External modules declared in 
package.json
 (and therefore used in the project)

Dependency	    Version     Typical role in the project
cors	        ^2.8.6	    Enables Cross‑Origin Resource Sharing for the Express API.
dotenv	        ^17.4.2	    Loads environment variables from a .env file.
express	        ^5.2.1	    Web framework that creates the HTTP server and routes.
gridfs-stream	^1.1.1	    Streams files to/from MongoDB GridFS (used for file uploads).
jsonwebtoken	^9.0.3	    Generates & verifies JWTs for authentication.
mongodb	        ^7.3.0	    Native MongoDB driver (often used alongside Mongoose).

mongoose	    ^9.7.1	    ODM for defining schemas/models (User, Session, Question).
multer	        ^2.2.0	    Middleware for handling multipart/form-data (file uploads).
socket.io	    ^4.8.3	    Real‑time bidirectional communication (WebSocket fallback) – core of socket.manager.js.
Dev‑dependency		
nodemon	        ^3.1.14	    Development tool that restarts the server on file changes (npm run dev).

These are the external NPM packages the project relies on to provide its API, database access, authentication, file handling, and real‑time socket functionality.

The following API's are used in this project: 
File/Location	            API/Service	                                        How it’s used (brief description)
js/Api-dls.js	            DLS Backend API (custom REST API)	                All data operations (questions, sessions, PDFs, etc.) are wrapped in fetch calls via DLS_API.

js/auth.js	               (/api/users/signup, /api/users/login)	            Registers and logs‑in users with POST requests.

js/dashboard.js	           Dashboard endpoints                                  Updates user settings, retrieves dashboard data.
js/presentation-manager.js                  Session PDF endpoint(GET /api/sessions/:code/pdf)	Downloads a PDF blob for the current presentation.
js/dashboard.html/student-dashboard.html	Google Calendar embed (https://calendar.google.com/calendar/embed?...)	Embedded iframe showing a Google Calendar for demo purposes.
HTML files (index.html, login.html, easteregg.html, etc.)	Google Fonts (https://fonts.googleapis.com/...)	Loads the “Heebo” font family via <link href="https://fonts.googleapis.com/…">.
js/... (any fetch usage)	Fetch API (browser built‑in)	Standard fetch() calls to the above services.
Summary

The primary external service is the custom DLS backend API (REST endpoints for users, sessions, questions, PDFs, etc.).
A Google Calendar iframe is embedded for demonstration.
Google Fonts are loaded for styling.
All network communication uses the browser’s native Fetch API.


POSTMAN LINK:

https://wntrb1st-6589366.postman.co/workspace/yotam-wntrb's-Workspace~e10001c2-2a1d-4108-8b48-55d61a2c34a4/request/54631479-644eec6d-7064-43f7-baaf-0398f8db7ab8?tab=params