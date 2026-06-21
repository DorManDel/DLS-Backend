module.exports = {
    
    isregisterFieldEmpty(firstName, lastName, email, password, role) { 
        return !firstName || !lastName || !password || !role || !email ||
               firstName.trim() === "" || lastName.trim() === "" ||
               password.trim() === "" || role.trim() === "" || !email.includes(`@`); 
    },
};