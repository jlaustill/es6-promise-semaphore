[![Build Status](https://api.travis-ci.com/jlaustill/es6-promise-semaphore.svg?branch=master)](https://travis-ci.com/github/jlaustill/es6-promise-semaphore)
[![Coverage Status](https://coveralls.io/repos/github/jlaustill/es6-promise-semaphore/badge.svg?branch=master)](https://coveralls.io/github/jlaustill/es6-promise-semaphore?branch=master)
[![npm version](https://badge.fury.io/js/es6-promise-semaphore.svg)](https://badge.fury.io/js/es6-promise-semaphore)
<span class="badge-npmdownloads"><a href="https://www.npmjs.com/package/es6-promise-semaphore" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/es6-promise-semaphore.svg" alt="NPM downloads" /></a></span>

# es6-promise-semaphore
1. [Introduction](#1-introduction)
2. [Quick Start](#2-quick-start)
3. [Deeper Dive](#3-deeper-dive)
4. [Contributing](#4-contributing)


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

# 3. Deeper Dive

If you aren't already familiar with what a semaphore is and the above example doesn't give you everything you need to get started then I'll try to explain in a bit more detail here.  First off, a semaphore is a way to execute processes in a limited fashion.  In other words, 2 at a time, or 5 at a time.  In the example above, 10 at a time.  

When you create the promiseSemaphore, you pass in the number of processes/promises that you want executed at a time as an integer.  Like this:

```javascript
const PromiseSemaphore = require("es6-promise-semaphore"),
      promiseSemaphore = new PromiseSemaphore(5); // <- the number is how many to execute at once.
```

PromiseSemaphore also excepts a second parameter to turn on debug mode.  This will display a message after each promise finishes with console.log.  I don't recommend using it in production, but it may come in handy for debugging your code.

```javascript
const PromiseSemaphore = require("es6-promise-semaphore"),
      promiseSemaphore = new PromiseSemaphore(5, true);
```

Passing anything but true will be ignored.

Once you have this created, you use it just like Promise.All.  I went out of my way to keep this as simple to use as possible.  You simply pass in an array of promises and it will execute them X at a time.  If this doesn't make sense open an issue and I will do my best to address your question further.

# 4. Contributing

I welcome any and all contributions!  Be it code, tests, or documentation.  Simply fork this repo and do a pull request with your contribution.  The only warning I have is that I won't accept code that isn't tested and passing the build.

Have a great day!
