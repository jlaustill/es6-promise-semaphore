"use strict";

function notExecutingMax (ps) {
    return ps.executing <= ps.limit && ps.promises.length > 0;
}

function workRemaining (ps) {
    return ps.promises.length > 0;
}

function errored (ps) {
    return ps.errors.length > 0;
}

function workIsDone (ps) {
    return ps.promises.length === 0 && ps.executing <= 0;
}

function debugOut (ps, text) {
    if (ps.debug === true) {
        console.log(text);
    }
}

function ensureWork (work, ps) {
    // If it's an empty array, resolve empty array
    // If it's an array just return it
    // If it's not an array, return an array with it as the contents
    if (work.length === 0) {
        ps.resolve(work);
    } else if (work.length > 0) {
        return work;
    } else {
        return [() => {return work;}];
    }
    return work;
}

class PromiseSemaphore {
    constructor (limit, debug) {
        this.limit = limit;
        this.executing = 0;
        this.results = [];
        this.errors = [];
        this.count = 0;
        this.debug = debug === true;
    }

    executeNext () {
        if (errored(this) && this.executing <= 0) {
            this.reject(this.errors);
        } else if (notExecutingMax(this) && workRemaining(this) && !errored(this)) {
            let n = this.promises.shift();
            this.executing++;
            n()
                .then(result => {
                    this.executing--;
                    debugOut(this, "result " + this.count++ + ": Currently executing -> " + this.executing + " promises.");
                    this.results.push(result);
                    this.executeNext();
                })
                .catch(error => {
                    this.executing--;
                    this.errors.push(error);
                    this.executeNext();
                });
        } else if (workIsDone(this)) {
            this.resolve(this.results);
        }
    }

    execute (work) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.promises = ensureWork(work, this);

            if (! Number.isInteger(this.limit)) {
                reject("contructor only excepts integers.");
            } else {
                while (notExecutingMax(this)) {
                    this.executeNext();
                }
            }
        });
    }
}

module.exports = PromiseSemaphore;
