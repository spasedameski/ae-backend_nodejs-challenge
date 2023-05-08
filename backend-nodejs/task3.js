const _promise = Promise.reject(new Error("BOOOM"));
_promise.then(() => console.log(".then"));
_promise.catch(console.log);
//The issue with this code is that the promise is immediately rejected with an error using Promise.reject(new Error("BOOOM")), so the .then() method will never be called. Instead, the .catch() method will be called with the error message "BOOOM". Therefore, the console will only log the error message, but not the ".then" string.
