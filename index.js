var util = require('util');
var Readable = require('stream').Readable;

util.inherits(Funil, Readable);
module.exports = Funil;
function Funil() {
  if (!this instanceof Funil)
    return new Funil(v);

  Readable.call(this, { });

  this.started = false;
  this.streams = [];
}

Funil.prototype._read = read;
function read() {
  if (!this.started)
    this.streams.forEach(this._readFrom.bind(this));

  this.started = true;
}

Funil.prototype.add = add;
function add(s) {
  this.streams.push(s);

  if (this.started)
    this.readFrom(s);
}

Funil.prototype._readFrom = readFrom;
function readFrom(s) {
    s.on('readable', this.readStream.bind(this, s));
    s.once('end', this._stopReadingFrom.bind(this, s));
}

Funil.prototype.readStream = readStream;
function readStream(s) {
  var chunk;
  while (null !== (chunk = s.read())) {
    this.push(chunk);
  }
}

Funil.prototype._stopReadingFrom = stopReadingFrom;
function stopReadingFrom(s) {
  this.streams.splice(this.streams.indexOf(s), 1);
  if (!this.streams.length)
    this.push(null);
}
