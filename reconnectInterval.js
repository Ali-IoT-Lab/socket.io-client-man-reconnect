

function Backoff() {
  this.ms = 800;
  this.max = 10000;
  this.factor = 2;
  this.jitter = 0.1;
  this.attempts = 0;
}

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

module.exports = Backoff;
