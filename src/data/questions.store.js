// src/data/questions.store.js

/*
    QUESTIONS STORE - DATA LOGIC
    Temporary in-memory data layer for lecture questions.

    ⚠️
    - This is NOT a real database yet.
    - Data is saved only while the server is running.
    - Later - replace this file with MongoDB / SQL / JSON DB or other DB accordingly.
*/


/* TEMP DATABASE -- replace later arr w/ DB_QUARIES */
const questions = [];


/* HELPERS -- only inside this file */

/* Create a simple unique id. -- Example: q_1781570000000_123 */
function createQuestionId() {
    return `q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}


/* Normalize text for simple search. -- [any value = lowercase text] */
function normalizeText(value) {
    return String(value || "").toLowerCase().trim();
}


/* CREATE QUESTION -- save in arr */
/*
FORMAT:
    Input:
    {
        presentationId,
        fileName,
        page,
        x,
        y,
        text,
        color,
        studentName,
        isAnonymous
    }

    Notes:
    - x and y are relative positions. Ex.: x = 0.42, y = 0.31
      This means the point works even if PDF scale changes.
*/
function createQuestion(questionData) {
    const newQuestion = {
        id: createQuestionId(),

        presentationId: questionData.presentationId,
        fileName: questionData.fileName || null,

        page: Number(questionData.page),
        x: Number(questionData.x),
        y: Number(questionData.y),

        text: questionData.text,
        status: questionData.status || "open",

        color: questionData.color || "#ff2f6d",

        studentName: questionData.studentName || "Anonymous",
        studentId: questionData.studentId || null,
        studentEmail: questionData.studentEmail || null,

        isAnonymous: questionData.isAnonymous !== false,

        /* created time in united format -- ex. 2026-06-16T02:19:09.122Z
        used for JSON easy save, easy API transfer, sort by time,
        easy to convert to lacal time in Browser, independent
        - Params:
           T    - split between Date -T- Time 
           .122 - time in ms
           Z    - UTC / WorldTimeZOne   
        */
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    questions.push(newQuestion);

    return newQuestion;
}


/* READ ALL QUESTIONS -- return questions + opt. filter */
/*
    Supported filters:
    - presentationId
    - page
    - status
    - search

    Ex.:
    getAllQuestions()
    getAllQuestions({ page: 2 })
    getAllQuestions({ presentationId: "demo-presentation" })
    getAllQuestions({ status: "open" })
*/
function getAllQuestions(filters = {}) {
    let result = [...questions];

    if (filters.presentationId) {
        result = result.filter(
            (question) => question.presentationId === filters.presentationId
        );
    }

    if (filters.page) {
        result = result.filter(
            (question) => question.page === Number(filters.page)
        );
    }

    if (filters.status) {
        result = result.filter(
            (question) => question.status === filters.status
        );
    }

    if (filters.search) {
        const searchValue = normalizeText(filters.search);

        result = result.filter((question) => {
            return normalizeText(question.text).includes(searchValue);
        });
    }

    /* Added students filtering by studentId and studentEmail */
    if (filters.studentId) {
        result = result.filter(function (question) {
            return question.studentId === filters.studentId;
        });
    }

    if (filters.studentEmail) {
        result = result.filter(function (question) {
            return question.studentEmail === filters.studentEmail;
        });
    }

    return result;
}

/* READ 1 QUEWSTION BY ID -- found? returns q.obj; 
notFound? undefined , controller decide if 404 */
function getQuestionById(questionId) {
    return questions.find((question) => question.id === questionId);
}


/* UPDATE QUESTION -- update fields by ID */
/*
    Used for:
    - Change question text
    - Change status from open to answered
    - Change color
    - Move marker position

    If question exists:
    returns updated question

    If question does not exist:
    returns null
*/
function updateQuestion(questionId, updateData) {
    const question = getQuestionById(questionId);

    if (!question) {
        return null;
    }

    if (updateData.text !== undefined) {
        question.text = updateData.text;
    }

    if (updateData.status !== undefined) {
        question.status = updateData.status;
    }

    if (updateData.color !== undefined) {
        question.color = updateData.color;
    }

    if (updateData.page !== undefined) {
        question.page = Number(updateData.page);
    }

    if (updateData.x !== undefined) {
        question.x = Number(updateData.x);
    }

    if (updateData.y !== undefined) {
        question.y = Number(updateData.y);
    }

    question.updatedAt = new Date().toISOString();

    return question;
}


/* DELETE QUESTION -- delete 1 Q by ID - remove from arr */
function deleteQuestion(questionId) {
    // find the index in arr of Q:
    const questionIndex = questions.findIndex(
        (question) => question.id === questionId
    );

    if (questionIndex === -1) {
        return null;
    }

    /* splice = Removes elems from an arr 
    + if needs, inserts new elements in their place,
    return the dltd elems. */
    const deletedQuestions = questions.splice(questionIndex, 1);

    return deletedQuestions[0];
}


/* QUESTIONS STATS -- Simple Stats. for Dashboard / Heatmap / Summary */
/*
    Returns:
    - total questions
    - open questions
    - answered questions
    - questions by page
    - hottest page
*/
function getQuestionsStats(filters = {}) {
    const filteredQuestions = getAllQuestions(filters);

    const questionsByPage = {};

    filteredQuestions.forEach((question) => {
        if (!questionsByPage[question.page]) {
            questionsByPage[question.page] = 0;
        }

        questionsByPage[question.page]++;
    });

    let hottestPage = null;
    let hottestPageCount = 0;

    Object.keys(questionsByPage).forEach((page) => {
        if (questionsByPage[page] > hottestPageCount) {
            hottestPage = Number(page);
            hottestPageCount = questionsByPage[page];
        }
    });

    return {
        totalQuestions: filteredQuestions.length,
        openQuestions: filteredQuestions.filter(
            (question) => question.status === "open"
        ).length,
        answeredQuestions: filteredQuestions.filter(
            (question) => question.status === "answered"
        ).length,
        questionsByPage,
        hottestPage,
        hottestPageCount
    };
}

/* DEBUG TEST HELPER */
/*
Clear All Questions from mem.
for postman testing.
REMOVE LATER!
*/
function clearAllQuestions() {
    questions.length = 0;

    return {
        cleared: true,
        totalQuestions: questions.length
    };
}

/* EXPORTS */

module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getQuestionsStats,
    clearAllQuestions
};