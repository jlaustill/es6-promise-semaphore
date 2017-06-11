/*global describe, it*/
"use strict";
const assert = require("assert"),
    PromiseSemaphore = require("../index.js"),
    factory = (require("./factories.js")).factory,
    factoryReject = (require("./factories.js")).factoryReject;

describe("Standard runs", function () {
    it("should return 100 results with 100 inputs", function () {
        this.timeout(0);
        let promiseSemaphore = new PromiseSemaphore(10);

        let promises = [];

        for (let i = 0; i < 100; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
        }

        return promiseSemaphore.execute(promises)
            .then((results) => {
                assert.equal(100, results.length);
            }).catch(() => {
                throw new Error("this shouldn't fail");
            }); // promiseSemaphore.execute
    }); // it
    it("should reject after error", function () {
        this.timeout(0);
        let promiseSemaphore = new PromiseSemaphore(10, true);

        let promises = [];

        for (let i = 0; i < 100; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
            if (c === 4) {
                promises.push(() => {
                    return factoryReject(c);
                });
            }
        }

        return promiseSemaphore.execute(promises)
            .then(() => {
                throw new Error("This should fail");
            }).catch((error) => {
                assert.notEqual(null, error);
            }); // promiseSemaphore.execute
    }); // it
    it("should gracefully handle a higher limit than input", function () {
        this.timeout(0);
        let promiseSemaphore = new PromiseSemaphore(10000);

        let promises = [];

        for (let i = 0; i < 100; i++) {
            let c = i;
            promises.push(() => {
                return factory(c);
            });
        }

        return promiseSemaphore.execute(promises)
            .then((results) => {
                assert.equal(100, results.length);
            }).catch(() => {
                throw new Error("this shouldn't fail");
            }); // promiseSemaphore.execute
    }); // it
}); // describe