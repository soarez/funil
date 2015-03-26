var util = require('util');
var Readable = require('stream').Readable;
var Funil = require('./');

util.inherits(Repeat, Readable);
function Repeat(v) {
  if (!this instanceof Repeat)
    return new Repeat(v);

  this.v = v;
  Readable.call(this, { });
}

Repeat.prototype._read = read;
function read() {
  if (! this.interval)
    this.interval = setInterval(this.generate.bind(this), 1000);
}

Repeat.prototype.generate = generate;
function generate() {
  this.push(this.v);
}

Repeat.prototype.stop = stop;
function stop() {
  clearInterval(this.interval);
  this.push(null);
}

var repeats = [
  new Repeat('a\n'),
  new Repeat('b\n'),
  new Repeat('c\n'),
  new Repeat('d\n')
];

var f = new Funil();
repeats.forEach(function(s) { f.add(s); });
f.pipe(process.stdout);
f.once('end', function() { console.log('Funil ended'); });

var interval = setInterval(stopOne, 2e3);

function stopOne() {
  var theOne = repeats[Math.floor(Math.random() * repeats.length)];
  var id = theOne.v.trim();
  console.log('stopping', id);
  theOne.once('end', function() { console.log('stopped', id); });
  theOne.stop();

  repeats.splice(repeats.indexOf(theOne), 1);
  if (!repeats.length)
    clearInterval(interval);
}
