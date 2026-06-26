const Question = require("../models/Questions"); // Use your actual Mongoose model
const socketManager = require("../sockets/socket.manager");


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




    /* SOCKET EVENT = Notify teacher/dashboard/frontend that new question was created. */
    socketManager.emitQuestionCreated(newQuestion);

    /* HTTP RESPONSE = Return normal REST response to Postman / frontend. */
    res.status(201).json({
        success: true,
        message: "Question created successfully",
        data: newQuestion
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
    const questionId = req.body

    const deletedQuestion = questionsStore.deleteQuestion(questionId);

    if (!deletedQuestion) {
        return res.status(404).json({
            success: false,
            message: "Question not found",
            data: null
        });
    }

    /* SOCKET EVENT = Notify frontend that question was deleted. */
    socketManager.emitQuestionDeleted(deletedQuestion);

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