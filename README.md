[![Build Status](https://travis-ci.org/jlaustill/es6-promise-semaphore.svg?branch=master)](https://travis-ci.org/jlaustill/es6-promise-semaphore)
[![Coverage Status](https://coveralls.io/repos/github/jlaustill/es6-promise-semaphore/badge.svg?branch=master)](https://coveralls.io/github/jlaustill/es6-promise-semaphore?branch=master)

# es6-promise-semaphore
1. [Introduction](#1-introduction)
2. [Quick Start](#2-quick-start)


# 1. Introduction
An ES6 semaphore for executing promises in a limited fashion.  Promise.all will execute an array of promises and return
to you an array of results.  This is great, but what happens when you have 10k promises in your array, and can only
execute 10 at a time?  I had this requirement and couldn't find an acceptable library for this purpose, so I wrote this
one.  My requirements were as follows.

* Purely ES6 (no typescript etc)
* No dependencies (except for testing)
* Follow the same pattern as Promise.all
* Non blocking
* execute in order, but execute next promise when any other promise finishes
* Simple, and this one is important


# 2. Quick Start

### Installation
`npm install --save es6-promise-semaphore`

### Basic Example
```javascript
const promiseSemaphore = new (require("es6-promise-semaphore"))(10);

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
    console.log(results);
}).catch((error) => {
    console.log(error);
}); // promiseSemaphore.execute
```

This same example with standard Promise.all looks like this
```javascript
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
    promises.push(factory(c));
}

Promise.all(promises)
.then((results) => {
    console.log(results);
}).catch((error) => {
    console.log(error);
}); // promiseSemaphore.execute
```

You only need to change two pieces of code.
```javascript
promises.push(factory(c));
```
You need to wrap your promise call in a function so it doesn't execute.
```javascript
promises.push(() => { return factory(c);});
```
And you need to replace Promise.all with promiseSemaphore.execute.  That's it!