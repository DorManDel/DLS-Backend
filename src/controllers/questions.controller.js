<<<<<<< HEAD
// src/routes/questions.controller.js

/*
CONTROLLER - HTTP LOGIC
- place that gets request and decides which response to return
- only manages the HTTP operation
[called to route] -> [checked DATA] -> [called DB] -> [returned RESPONSE]

-  knows req/res.
-  decides HTTP status codes: 200, 201, 400, 404...
-  calls socketManager.emitQuestionCreated(...) etc. to push realtime updates.

Note:
Questions are linked to a session by the session's "code" field
(the short human-readable code, e.g. "D71DDE") rather than a
Mongo ObjectId — this matches src/models/Questions.js.

The frontend (Api-dls.js) currently sends/filters this value under
the name "sessionId", so this controller accepts EITHER "sessionId"
or "code" from the client and stores it as "code" in the DB.
*/

const Question = require("../models/Questions");
const socketManager = require("../sockets/socket.manager");

/* Small helper: pull the session code out of either a query or a body,
   accepting "sessionId" (frontend's current name) or "code". */
function readSessionCode(source) {
    return source.sessionId || source.code || null;
}

/*
    GET /api/questions
    Return all questions, optionally filtered.

    Optional filters from URL query:
    /api/questions?sessionId=D71DDE
    /api/questions?sessionId=D71DDE&page=2
    /api/questions?sessionId=D71DDE&status=open
    /api/questions?sessionId=D71DDE&search=algorithm
    /api/questions?sessionId=D71DDE&studentId=...

    Status:
    200 OK = questions loaded successfully
    500    = unexpected server/DB error
*/
async function getQuestions(req, res) {
    try {
        const code = readSessionCode(req.query);

        const filter = {};

        if (code) {
            filter.code = code;
        }

        if (req.query.page !== undefined) {
            filter.page = Number(req.query.page);
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.studentId) {
            filter.studentId = req.query.studentId;
        }

        if (req.query.search) {
            filter.text = { $regex: req.query.search, $options: "i" };
        }

        const questions = await Question.find(filter).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Questions loaded successfully",
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error("Error loading questions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}

/*
    GET /api/questions/:id
    Return one question by id.

    Status:
    200 OK = question found
    404 Not Found = question id does not exist
    400 Bad Request = id is not a valid ObjectId
*/
async function getQuestionById(req, res) {
    try {
        const questionId = req.params.id;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Question loaded successfully",
            data: question
        });
    } catch (error) {
        console.error("Error loading question:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid question id",
            data: null
        });
    }
}

/*
    POST /api/questions
    Create a new question.

    Required body fields:
    - sessionId (or "code")
    - page
    - x
    - y
    - text

    Optional body fields:
    - fileName
    - studentId
    - status

    Status:
    201 Created = question created
    400 Bad Request = missing required data
*/
async function createQuestion(req, res) {
    try {
        const code = readSessionCode(req.body);

        const { fileName, page, x, y, text, studentId, status } = req.body;

        /*
            Important:
            We check x/y with === undefined because 0 is a valid value.
            Ex.: x = 0 means left side of page, y = 0 means top side of page.
            If we used !x or !y, then 0 would be treated as false by mistake.
        */
        if (!code || page === undefined || x === undefined || y === undefined || !text) {
            return res.status(400).json({
                success: false,
                message: "sessionId, page, x, y and text are required",
                data: null
            });
        }

        const newQuestion = await Question.create({
            code,
            fileName: fileName || null,
            page: Number(page),
            x: Number(x),
            y: Number(y),
            text,
            status: status || "open",
            studentId: studentId || null
        });

        /* SOCKET EVENT = Notify everyone in this session's room. */
        socketManager.emitQuestionCreated(newQuestion);

        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            data: newQuestion
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}

/*
    PUT /api/questions/:id
    Update an existing question.

    Can update:
    - text
    - status
    - page
    - x
    - y

    Status:
    200 OK = question updated
    404 Not Found = question id does not exist
*/
async function updateQuestion(req, res) {
    try {
        const questionId = req.params.id;

        const allowedUpdates = {};
        const { text, status, page, x, y } = req.body;

        if (text !== undefined) allowedUpdates.text = text;
        if (status !== undefined) allowedUpdates.status = status;
        if (page !== undefined) allowedUpdates.page = Number(page);
        if (x !== undefined) allowedUpdates.x = Number(x);
        if (y !== undefined) allowedUpdates.y = Number(y);

        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            allowedUpdates,
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null
            });
        }

        /* SOCKET EVENT = Notify everyone in this session's room. */
        socketManager.emitQuestionUpdated(updatedQuestion);

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion
        });
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid question id or update data",
            data: null
        });
    }
}
=======
const Question = require("../models/Questions"); 
const socketManager = require("/sockets/socket.manager");

>>>>>>> e3b2d2af28ad1e49b95b50f38cfc8b6adee45d1e

/*
    DELETE /api/questions/:id
    Delete one question by id.
<<<<<<< HEAD

=======
>>>>>>> e3b2d2af28ad1e49b95b50f38cfc8b6adee45d1e
    Status:
    200 OK = question deleted
    404 Not Found = question id does not exist
*/
<<<<<<< HEAD
async function deleteQuestion(req, res) {
    try {
        const questionId = req.params.id;

        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null
            });
        }

        /* SOCKET EVENT = Notify everyone in this session's room. */
        socketManager.emitQuestionDeleted(deletedQuestion);

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully",
            data: deletedQuestion
        });
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(400).json({
            success: false,
            message: "Invalid question id",
            data: null
        });
    }
}

/*
    GET /api/questions/stats
    Return question statistics for a session.

    Optional filter:
    /api/questions/stats?sessionId=D71DDE

    Status:
    200 OK = stats loaded
*/
async function getQuestionsStats(req, res) {
    try {
        const code = readSessionCode(req.query);

        const filter = code ? { code } : {};

        const questions = await Question.find(filter);

        const stats = {
            totalQuestions: questions.length,
            openQuestions: 0,
            answeredQuestions: 0,
            questionsByPage: {},
            hottestPage: null,
            hottestPageCount: 0
        };

        questions.forEach((question) => {
            if (question.status === "open") {
                stats.openQuestions += 1;
            } else {
                stats.answeredQuestions += 1;
            }

            if (!stats.questionsByPage[question.page]) {
                stats.questionsByPage[question.page] = 0;
            }

            stats.questionsByPage[question.page] += 1;
        });

        Object.keys(stats.questionsByPage).forEach((page) => {
            if (stats.questionsByPage[page] > stats.hottestPageCount) {
                stats.hottestPage = Number(page);
                stats.hottestPageCount = stats.questionsByPage[page];
            }
        });

        return res.status(200).json({
            success: true,
            message: "Question statistics loaded successfully",
            data: stats
        });
    } catch (error) {
        console.error("Error loading question stats:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}

=======
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


>>>>>>> e3b2d2af28ad1e49b95b50f38cfc8b6adee45d1e
/*
    DELETE /api/questions/debug/clear
    Debug helper for Postman testing.

    Important:
<<<<<<< HEAD
    - Clears ALL questions in the database for ALL sessions.
    - Only for development.
    - Later remove it or protect it with admin permission.

    Optional filter:
    /api/questions/debug/clear?sessionId=D71DDE  (clear just one session)

    Status:
    200 OK = questions cleared
*/
async function clearQuestionsForDebug(req, res) {
    try {
        const code = readSessionCode(req.query);
        const filter = code ? { code } : {};

        const result = await Question.deleteMany(filter);

        return res.status(200).json({
            success: true,
            message: "Questions cleared successfully",
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error("Error clearing questions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsStats,
    clearQuestionsForDebug
};
=======
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
>>>>>>> e3b2d2af28ad1e49b95b50f38cfc8b6adee45d1e
