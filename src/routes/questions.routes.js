// src/routes/questions.routes.js


const express = require("express");
const questionsController = require("../controllers/questions.controller");
const { create } = require("../models/User");

const router = express.Router();


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
    POST /api/questions    
    Create a new question.
*/
router.post("/", questionsController.createQuestion);


/*
    DELETE /api/questions/:id    
    Delete one question by id.
*/
router.delete("/:id", questionsController.deleteQuestion);


module.exports = {
    getQuestionById,
    createQuestion,
    deleteQuestion,
};