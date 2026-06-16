
---
# TDL:
----

```txt
[] express - for RESTAPI build
[] CORS - client can call server from other domain ( Cross Origin Resource Sharing ) - to allow 2 AJAX connections between 2 domains
[] dotenv - load env vars from .env
[] sockect.io - realtime updates w/o refresh
[] nodemon - for ctrl+s to save while not production
```
---

### test connect locally:
http://localhost:3000/signup

---

### Github Link: https://github.com/YuutamW/WEB-project-No.-2

---

## FOUNDATION:

| FILENAME       | EXPLAINATION                 |
------------------------------------------------
|index.js        |= connects teh WHOLE server   |
|routes/         |= API Addresses               |
|controllers/    |= Logic for each REQUEST      |
|data/           |= save in mem temp            |

---

## QUESTIONS API:

```txt
POST   /api/questions          Create question
GET    /api/questions          Read all questions
GET    /api/questions/:id      Read one question
PUT    /api/questions/:id      Update question
DELETE /api/questions/:id      Delete question
GET    /api/questions/stats    Questions statistics
```

---

## CORRECT SPLIT LOGIC:

### Route = which add. API called

### Controller = what to do with request(req) + what to respond (res)

### Store = how store / call / update data

---