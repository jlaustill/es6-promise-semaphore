function notExecutingMax(ps) {
  return ps.executing <= ps.limit;
}

function workRemaining(ps) {
  return ps.promises.length > 0;
}

function errored(ps) {
  return ps.errors.length > 0;
}

class PromiseSemaphore {
  constructor(limit) {
    this.limit = limit;
    this.executing = 0;
    this.results = [];
    this.errors = [];
  }

 executeNext() {
   if (errored(this)) {
     this.reject(this.errors);
   } else if (notExecutingMax(this) && workRemaining(this)) {
     let n = this.promises.shift();
     this.executing++;
     n()
     .then(result => {
       this.executing--;
       console.log("result? -> " + result + ": executing -> " + this.executing);
       this.results.push(result);
       this.executeNext();
     })
     .catch(error => {
       this.errors.push(error);
     });
    } else if (this.promises.length === 0 && this.executing <= 0) {
      this.resolve(this.results);
     }
  }

    execute(work) {
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
        this.promises = work;
        while (notExecutingMax(this)) {
          this.executeNext();
        }
      });
    }
}

module.exports = PromiseSemaphore;
