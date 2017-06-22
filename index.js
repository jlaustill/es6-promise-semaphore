"use strict";
const PromiseSemaphore = function (_limit, _debug) {
    const $$ = {},
        debug = _debug === true,
        limit = _limit;
    let executing = 0,
        promises = [],
        results = [],
        errors = [],
        count = 0,
        resolve = null,
        reject = null;

    let notExecutingMax = () => {
        return executing <= limit && promises.length > 0;
    };

    let workRemaining = () => {
        return promises.length > 0;
    };

    let erred = () => {
        return errors.length > 0;
    };

    let workIsDone = () => {
        return promises.length === 0 && executing <= 0;
    };

    let debugOut = (_text) => {
        if (debug === true) {
            console.log(_text);
        }
    };

    let ensureWork = (_work) => {
        // If it's an empty array, resolve empty array
        // If it's an array just return it
        // If it's not an array, return an array with it as the contents
        if (_work.length === 0) {
            return resolve(_work);
        } else if (_work.length > 0) {
            return _work;
        } else {
            return [() => {
                return _work;
            }];
        }
    };

    let executeNext = () => {
        if (erred() && executing <= 0) {
            reject(errors);
        } else if (notExecutingMax() && workRemaining() && !erred()) {
            let nextPromise = promises.shift()();
            executing++;
            Promise.resolve(nextPromise)
                .then(_result => {
                    executing--;
                    debugOut("result " + count++ + ": Currently executing -> " + executing + " promises.");
                    results.push(_result);
                    executeNext();
                })
                .catch(_error => {
                    executing--;
                    errors.push(_error);
                    executeNext();
                });
        } else if (workIsDone()) {
            resolve(results);
        }
    };

    $$.execute = (_work) => {
        return new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
            promises = ensureWork(_work);

            if (! Number.isInteger(limit)) {
                reject("Constructor only excepts integers.");
            } else {
                while (notExecutingMax()) {
                    executeNext();
                }
            }
        });
    };

    return $$;
};

module.exports = PromiseSemaphore;