const Question = require("../models/Questions"); 
const socketManager = require("/sockets/socket.manager");


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
    res.status(200).json({
        success: true,
        message: "Question deleted successfully",
        data: deletedQuestion
    });
}


/*
    GET /api/questions/stats
    Return question statistics.

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

module.exports = {
    deleteQuestion,
    getQuestionsStats,
    clearQuestionsForDebug
};