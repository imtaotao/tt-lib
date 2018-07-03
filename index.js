import tt from './build'

window.t = tt
window.b = tt.Buffer
file.onchange = e => {
  window.f = file.files[0]
  b.blobToAudioBuffer(file.files[0]).then(r => {
    const arrayBuffer = to(r)
    console.log(arrayBuffer)
    window.a = arrayBuffer
    download(arrayBuffer)
  })
}

function to (audio) {
  return b.audioBufferToArrayBuffer(audio)
}

function download (arrayBuffer) {
  const bolb = t.Buffer.arrayBufferToBlob(arrayBuffer, 'audio/mp3')
  t.Utils.download(bolb, 'test.mp3')
}

function fptest () {
  const fp = tt.FP

  var curry = require('lodash').curry;

  var match = curry(function(what, str) {
    return str.match(what);
  });

  console.log(match)
  var r1 = match(/\s+/g, "hello world")
  var r2 = match(/\s+/g)("hello world")
  console.log(r1, r2)
}

fptest()

function createCurry(func, bitmask, arity) {
  var Ctor = createCtor(func);

  function wrapper() {
    var length = arguments.length,
        args = Array(length),
        index = length,
        placeholder = getHolder(wrapper);

    while (index--) {
      args[index] = arguments[index];
    }
    var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
      ? []
      : replaceHolders(args, placeholder);

    length -= holders.length;
    if (length < arity) {
      return createRecurry(
        func, bitmask, createHybrid, wrapper.placeholder, undefined,
        args, holders, undefined, undefined, arity - length);
    }
    var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
    return apply(fn, this, args);
  }
  return wrapper;
}