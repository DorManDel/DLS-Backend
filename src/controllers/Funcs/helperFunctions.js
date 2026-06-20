module.exports = {
    
    isregisterFieldEmpty(firstName, email, lastName, username, password, role) { 
        return !firstName || !lastName || !username || !password || !role || !email
               firstName.trim() === "" || lastName.trim() === "" ||
               username.trim() === "" || password.trim() === "" || role.trim() === "" || !email.includes(`@`); 
    }
};