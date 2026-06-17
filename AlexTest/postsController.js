exports.postsController = {
    // GET localhost:8081/posts
    // async getPosts() {
    //     const { dbConnection } = require('./dbConnection.js');
    //     const connection = await dbConnection.createConnection();
    //     const [rows] = await connection.execute(`SELECT * FROM tbl_1_posts`);
    //     connection.end();
    //     return rows;
    // },

    // GET localhost:8080/posts/2
    async getallusers() {
        const { dbConnection } = require('./dbConnection.js');
        const connection = await dbConnection.createConnection();

        const [rows] = await connection.execute(`SELECT id, username, role FROM users;`);
        connection.end(); // Always close the connection
        return rows;
    },

}