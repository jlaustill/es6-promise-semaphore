"use strict";
module.exports.factory = input => {
    return new Promise((resolve /*, reject*/) => {
        setTimeout(function () {
            resolve(input);
        }, Math.floor(Math.random() * 5000));
    });
};

module.exports.factoryReject = input => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            reject(input);
        }, Math.floor(Math.random() * 5000));
    });
};