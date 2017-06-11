/*global describe, it*/
"use strict";
const assert = require("assert"),
    PromiseSemaphore = require("../index.js"),
    factory = (require("./factories.js")).factory;

describe("non-numeric input", function () {
    it("should reject text limit", function () {
        this.timeout(0);

        let promiseSemaphore = new PromiseSemaphore("error", true);

        let promises = [];

        for (let i = 0; i < 10; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
        }

        return promiseSemaphore.execute(promises)
            .then(() => {
                throw new Error("This should fail");
            })
            .catch((error) => {
                assert.notEqual(null, error);
            }); // promiseSemaphore.execute
    });
    it("should reject float limit", function () {
        this.timeout(0);

        let promiseSemaphore = new PromiseSemaphore(1.1, true);

        let promises = [];

        for (let i = 0; i < 10; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
        }

        return promiseSemaphore.execute(promises)
            .then(() => {
                throw new Error("This should fail");
            })
            .catch((error) => {
                assert.notEqual(null, error);
            }); // promiseSemaphore.execute
    });

    it("should reject object limit", function () {
        this.timeout(0);

        let promiseSemaphore = new PromiseSemaphore({limit: 1});

        let promises = [];

        for (let i = 0; i < 10; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
        }

        return promiseSemaphore.execute(promises)
            .then(() => {
                throw new Error("This should fail");
            })
            .catch((error) => {
                assert.notEqual(null, error);
            }); // promiseSemaphore.execute
    });
});