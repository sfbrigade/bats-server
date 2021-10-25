import PropTypes from 'prop-types';

class User {

    constructor(payload) {
        this.payload = payload || {};
        this.payload.firstName = this.payload.firstName || '';
        this.payload.lastName = this.payload.lastName || '';
        this.payload.email = this.payload.email || '';
        this.payload.password = this.payload.password || '';
        // this.payload.userType = this.payload.userType || {};
    }

    get firstName() {
        return this.payload.firstName;
    }

    set firstName(newValue) {
        this.payload.firstName = newValue;
    }

    get lastName() {
        return this.payload.lastName;
    }

    set lastName(newValue) {
        this.payload.lastName = newValue;
    }

    get email() {
        return this.payload.email;
    }

    set email(newValue) {
        this.payload.email = newValue;
    }
    
    get password() {
        return this.payload.password;
    
    }

    set password(newValue) {
        this.payload.password = newValue;
    }

    // get isAdmin() {
    //     return this.payload.userType.isAdmin;
    // }

    // set isAdmin(newValue) {
    //     this.payload.userType.isAdmin = newValue;
    // }

    // get isOperational() {
    //     return this.payload.userType.isOperational;
    // }

    // set isOperational(newValue) {
    //     this.payload.userType.isOperational = newValue;
    // }

    get isUserValid () {
        return (
            this.firstName !== null &&
            this.firstName !== '' &&
            this.lastName !== null && 
            this.lastName !== '' &&
            this.email !== null &&
            this.email !== '' &&
            this.password !== null &&
            this.password !== '' 
            // this.isAdmin !== null &&
            // this.isAdmin !== '' &&
            // this.isOperational !== null &&
            // this.isOperational !== '' 
        );
    }
    
    toJson() {
        return this.payload
    }
}

export default User;