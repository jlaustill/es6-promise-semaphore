const assert = require("assert"),
      PromiseSemaphore = require("../index.js");

const factory = input => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(input);
        }, Math.floor(Math.random() * 5000));
    });
}

const factoryReject = input => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            reject(input);
        }, Math.floor(Math.random() * 5000));
    });
}

describe("es6-promise-semaphore", function () {
    describe("run", function () {
        it("should return 100 results with 100 inputs", function () {
            this.timeout(0);
            promiseSemaphore = new PromiseSemaphore(10);

            let promises = [];

            for (i = 0; i < 100; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            return promiseSemaphore.execute(promises)
            .then((results) => {
                assert.equal(100, results.length);
            }).catch((error) => {
                throw new Error("this shouldn't fail");
            }); // promiseSemaphore.execute
        }); // it
        it("should reject after error", function () {
            this.timeout(0);
            promiseSemaphore = new PromiseSemaphore(10, true);

            let promises = [];

            for (i = 0; i < 100; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
                if (c === 4) {
                    promises.push(() => {return factoryReject(c);});
                }
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    throw new Error("This should fail");
                }).catch((error) => {
                    assert.notEqual(null, error);
                }); // promiseSemaphore.execute
        }); // it

        it("should resolve any input, not just promises", function () {
            this.timeout(0);
            promiseSemaphore = new PromiseSemaphore(10);

            let promises = [];

            for (i = 0; i < 100; i++) {
                let c = i;
                if (2 % c === 0) {
                    promises.push(() => {return c;});
                } else {
                    promises.push(() => { return factory(c);});
                }
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    assert.equal(100, results.length);
                }).catch((error) => {
                    throw new Error("this shouldn't fail");
                }); // promiseSemaphore.execute
        }); // it

        it("should gracefully handle a higher limit than input", function () {
            this.timeout(0);
            promiseSemaphore = new PromiseSemaphore(10000);

            let promises = [];

            for (i = 0; i < 100; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    assert.equal(100, results.length);
                }).catch((error) => {
                    throw new Error("this shouldn't fail");
                }); // promiseSemaphore.execute
        }); // it
    }); // describe

    describe("non-numeric input", function () {
        it("should reject text limit", function () {
            this.timeout(0);

            promiseSemaphore = new PromiseSemaphore("error", true);

            let promises = [];

            for (i = 0; i < 10; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    throw new Error("This should fail");
                })
                .catch((error) => {
                    assert.notEqual(null, error);
                }); // promiseSemaphore.execute
        });
        it("should reject float limit", function () {
            this.timeout(0);

            promiseSemaphore = new PromiseSemaphore(1.1, true);

            let promises = [];

            for (i = 0; i < 10; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    throw new Error("This should fail");
                })
                .catch((error) => {
                    assert.notEqual(null, error);
                }); // promiseSemaphore.execute
        });

        it("should reject object limit", function () {
            this.timeout(0);

            promiseSemaphore = new PromiseSemaphore({limit: 1});

            let promises = [];

            for (i = 0; i < 10; i++) {
                let c = i;
                promises.push(() => { return factory(c);});
            }

            return promiseSemaphore.execute(promises)
                .then((results) => {
                    throw new Error("This should fail");
                })
                .catch((error) => {
                    assert.notEqual(null, error);
                }); // promiseSemaphore.execute
        });
    });
}) // describe