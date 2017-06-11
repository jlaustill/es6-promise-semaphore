/*global describe, it*/
"use strict";
const assert = require("assert"),
    PromiseSemaphore = require("../index.js");

describe("different work types", function () {
    it("empty array should return empty array", function () {
        let promiseSemaphore = new PromiseSemaphore(5, true);

        let promises = [];

        return promiseSemaphore.execute(promises)
            .then((results) => {
                assert.deepEqual([], results);
            })
            .catch((error) => {
                console.log(error);
                throw new Error("This shouldn't fail");
            }); // promiseSemaphore.execute
    });
    it("non array should return array with the object", function () {
        let promiseSemaphore = new PromiseSemaphore(5, true);

        let promises = 1;

        return promiseSemaphore.execute(promises)
            .then((results) => {
                assert.deepEqual([1], results);
            })
            .catch((/*error*/) => {
                throw new Error("This should fail");
            }); // promiseSemaphore.execute
    });
});
