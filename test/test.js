const assert = require("assert"),
      promiseSemaphore = new (require("../index.js"))(10);

describe("es6-promise-semaphore", () => {
    describe("run", () => {
        it("should return 100 results with 100 inputs", () => {
            let factory = input => {
                return new Promise((resolve, reject) => {
                    setTimeout(function () {
                        resolve(input);
                    }, Math.floor(Math.random() * 5000));
                });
            }

            let promises = [];

            for (i = 0; i < 1000; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            promiseSemaphore.execute(promises)
            .then((results) => {
                assert.equal(100, results.length);
                done();
            }).catch((error) => {
                done(error);
            }); // promiseSemaphore.execute
        }); // it
    }) // describe
}) // describe