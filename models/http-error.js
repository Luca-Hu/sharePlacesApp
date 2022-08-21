class HttpError extends Error{ // instantiate this class and create a new object based on it.
    constructor(message, errorCode){
        super(message); // add a "message" property
        this.code = errorCode; // add a "code" property
    }
}

module.exports = HttpError;