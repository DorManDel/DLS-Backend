// src/controllers/questions.controller.js

/*
CONTROLLER - HTTP LOGIC 
- place that gets request and decides which response to return
- only manages the HTTP operation
[called to route] -> [checked DATA] -> [called STORE/SERVICE] -> [returned RESPONSE];

-  knows req/res.
-  decides HTTP status codes: 200, 201, 400, 404...
*/

const questionsStore = require("../data/questions.store");


/*
    GET /api/questions
    Return all questions.

    Optional filters from URL query:
    /api/questions?presentationId=demo
    /api/questions?page=2
    /api/questions?status=open
    /api/questions?search=algorithm

    Status:
    200 OK = questions loaded successfully
*/
function getQuestions(req, res) {
    const filters = {
        presentationId: req.query.presentationId,
        page: req.query.page,
        status: req.query.status,
        search: req.query.search
    };

    const questions = questionsStore.getAllQuestions(filters);

    res.status(200).json({
        success: true,
        message: "Questions loaded successfully",
        count: questions.length,
        data: questions
    });
}


/*
    GET /api/questions/:id
    Return one question by id.

    Status:
    200 OK = question found
    404 Not Found = question id does not exist
*/
function getQuestionById(req, res) {
    const questionId = req.params.id;

    const question = questionsStore.getQuestionById(questionId);

    if (!question) {
        return res.status(404).json({
            success: false,
            message: "Question not found",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "Question loaded successfully",
        data: question
    });
}


/*
    POST /api/questions
    Create a new question.

    Required body fields:
    - presentationId
    - page
    - x
    - y
    - text

    Optional body fields:
    - fileName
    - color
    - studentName
    - isAnonymous

    Status:
    201 Created = question created
    400 Bad Request = missing required data
*/
function createQuestion(req, res) {
    const {
        presentationId,
        fileName,
        page,
        x,
        y,
        text,
        color,
        studentName,
        isAnonymous
    } = req.body;

    /*
        Important:
        We check x/y with === undefined because 0 is a valid value.
        Ex.:
        x = 0 means left side of page.
        y = 0 means top side of page.

        If we used !x or !y, then 0 would be treated as false by mistake.
    */
    if (
        !presentationId ||
        page === undefined ||
        x === undefined ||
        y === undefined ||
        !text
    ) {
        return res.status(400).json({
            success: false,
            message: "presentationId, page, x, y and text are required",
            data: null
        });
    }

    const newQuestion = questionsStore.createQuestion({
        presentationId,
        fileName,
        page,
        x,
        y,
        text,
        color,
        studentName,
        isAnonymous
    });

    res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: newQuestion
    });
}


/*
    PUT /api/questions/:id
    Update an existing question.

    Can update:
    - text
    - status
    - color
    - page
    - x
    - y

    Status:
    200 OK = question updated
    404 Not Found = question id does not exist
*/
function updateQuestion(req, res) {
    const questionId = req.params.id;

    const updatedQuestion = questionsStore.updateQuestion(questionId, req.body);

    if (!updatedQuestion) {
        return res.status(404).json({
            success: false,
            message: "Question not found",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "Question updated successfully",
        data: updatedQuestion
    });
}


/*
    DELETE /api/questions/:id
    Delete one question by id.

    Status:
    200 OK = question deleted
    404 Not Found = question id does not exist
*/
function deleteQuestion(req, res) {
    const questionId = req.params.id;

    const deletedQuestion = questionsStore.deleteQuestion(questionId);

    if (!deletedQuestion) {
        return res.status(404).json({
            success: false,
            message: "Question not found",
            data: null
        });
    }

    res.status(200).json({
        success: true,
        message: "Question deleted successfully",
        data: deletedQuestion
    });
}


/*
    GET /api/questions/stats
    Return question statistics.

    Used for:
    - Dashboard
    - Summary
    - Heatmap
    - Hottest page

    Optional filter:
    /api/questions/stats?presentationId=demo

    Status:
    200 OK = stats loaded
*/
function getQuestionsStats(req, res) {
    const filters = {
        presentationId: req.query.presentationId
    };

    const stats = questionsStore.getQuestionsStats(filters);

    res.status(200).json({
        success: true,
        message: "Question statistics loaded successfully",
        data: stats
    });
}


/*
    DELETE /api/questions/debug/clear
    Debug helper for Postman testing.

    Important:
    - Clears all questions from memory.
    - Only for development.
    - Later remove it or protect it with admin permission.

    Status:
    200 OK = all questions cleared
*/
function clearQuestionsForDebug(req, res) {
    const result = questionsStore.clearAllQuestions();

    res.status(200).json({
        success: true,
        message: "All questions cleared successfully",
        data: result
    });
}


/*
    EXPORTS
    Allow routes file to use these controller functions.
*/

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsStats,
    clearQuestionsForDebug
};