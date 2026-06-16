// src/routes/questions.routes.js

/*
ROUTES :
- place that defines API addresses
- connects every URL to a controller function

Flow:
Client/Postman -> Route -> Controller -> Store -> Response

Base path comes from index.js:
app.use("/api/questions", questionsRoutes);

So inside this file:
"/"      means /api/questions
"/stats" means /api/questions/stats
"/:id"   means /api/questions/:id
*/

const express = require("express");
const questionsController = require("../controllers/questions.controller");

const router = express.Router();


/*
    IMPORTANT ROUTE ORDER
    Specific routes must come BEFORE dynamic routes.

    Good:
    /stats      -- ⚠️important order
    /debug/clear
    /:id
*/


/*
    GET /api/questions/stats   
    Get question statistics for dashboard / summary / heatmap.
*/
router.get("/stats", questionsController.getQuestionsStats);


/*
    DELETE /api/questions/debug/clear   
    Clear all questions from memory for testing.
    Development only.
*/
router.delete("/debug/clear", questionsController.clearQuestionsForDebug);


/*
    GET /api/questions   
    Get all questions.
    Supports query filters:
    ?presentationId=
    ?page=
    ?status=
    ?search=
*/
router.get("/", questionsController.getQuestions);


/*
    POST /api/questions    
    Create a new question.
*/
router.post("/", questionsController.createQuestion);


/*
    GET /api/questions/:id   
    Get one question by id.
*/
router.get("/:id", questionsController.getQuestionById);


/*
    PUT /api/questions/:id    
    Update one question by id.
*/
router.put("/:id", questionsController.updateQuestion);


/*
    DELETE /api/questions/:id    
    Delete one question by id.
*/
router.delete("/:id", questionsController.deleteQuestion);


/*
    EXPORT
    Allow index.js to connect these routes.
*/
module.exports = router;