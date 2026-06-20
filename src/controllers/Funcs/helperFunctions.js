module.exports = {
    
    isregisterFieldEmpty(firstName, email, lastName, password, role) { 
        return !firstName || !lastName || !password || !role || !email
               firstName.trim() === "" || lastName.trim() === "" ||
               username.trim() === "" || password.trim() === "" || role.trim() === "" || !email.includes(`@`); 
    },
};