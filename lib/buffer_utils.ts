import { AudioCtx, platform, logError } from './utils'

export declare const Buffer:any

export function bufferToArrayBuffer (buffer:Buffer) : ArrayBuffer {
  const arraybuffer = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < view.length; i++) {
    view[i] = buffer[i]
  }

  return arraybuffer
}

export function arrayBufferToBuffer (arraybuffer:ArrayBuffer) : Buffer {
  if (platform.browser || platform.webpack) {
    logError('Buffer utils', '[ Buffer\'s arrayBufferToBuffer ] method Must be used in "node" or "electron"', true)
  }

  const buffer = new Buffer(arraybuffer.byteLength)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = view[i]
  }

  return buffer
}

export function arrayBufferToAudioBuffer (arraybuffer:ArrayBuffer) : Promise<AudioBuffer> {
  const ac = AudioCtx
  return ac.decodeAudioData(arraybuffer)
  .then(audioBuffer => audioBuffer)
  .catch(error => error)
}

export function blobToArrayBuffer (blob:Blob) : Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader
    reader.readAsArrayBuffer(blob)
    reader.onload = () => resolve(reader.result)
  })
}

export function blobToAudioBuffer (blob:Blob) : Promise<AudioBuffer> {
  return new Promise((resolve) => {
    const ac = AudioCtx
    const reader = new FileReader
    reader.readAsArrayBuffer(blob)
    reader.onload = () => {
      ac.decodeAudioData(reader.result , ab => resolve(ab))
    }
  })
}

export function arrayBufferToBlob (arraybuffer:ArrayBuffer, mimeType:string) : Blob {
  return new Blob([arraybuffer], {type: mimeType})
}
 
export function audioBufferToArrayBuffer (audioBuffer:AudioBuffer) : ArrayBuffer {
  const channel = audioBuffer.numberOfChannels

  function collect (buffers) {
    if (buffers.length < 2) return buffers[0]
    
    let length = buffers[0].length + buffers[1].length
    let result = new Float32Array(length)
    let index = 0
    let inputIndex = 0

    // merge left channel and right channel.
    while (index < length) {
      result[index++] = buffers[0][inputIndex]
      result[index++] = buffers[1][inputIndex]
      inputIndex++
    }

    return result
	}

  function getFloat32Array () {
    const buffers:any = []
    for (let i = 0; i < channel; i++) {
      buffers.push(audioBuffer.getChannelData(i))
    }
    return buffers
  }

  const buffers = getFloat32Array()
	return collect(buffers).buffer
}

export function arrayBufferToAcResource (ac:AudioContext, arraybuffer:ArrayBuffer, volume = 1) : Promise<AudioBufferSourceNode> {
  return ac.decodeAudioData(arraybuffer)
  .then(audioBuffer => {
    const source = ac.createBufferSource()
    const gainNode = ac.createGain()

    gainNode.connect(ac.destination)
    source.connect(gainNode)
    source.buffer = audioBuffer

    gainNode.gain.value = volume

    return source
  })
  .catch(error => error)
}

export function mergeArraybuffer (buffers:ArrayBuffer[]) : ArrayBuffer {
  if (buffers.length === 1) return buffers[0]

  return buffers.reduce((collectBuffer, buffer, i) => {
    let tmp = new Uint8Array(collectBuffer.byteLength + buffer.byteLength)
    tmp.set(new Uint8Array(collectBuffer), 0)
    tmp.set(new Uint8Array(buffer), collectBuffer.byteLength)

    return tmp.buffer
  }, buffers[0])
}

export function mergeAduioBuffer(buffers:AudioBuffer[]) : AudioBuffer {
  const ac = AudioCtx
  const channels = 2
  function getLength () {
    let length = 0
    for (let i = 0; i < buffers.length; i++) {
      length += buffers[i].length
    }
    return length
  }

  function getConcatBuffer (newAudioBuffer) {
    const newBuffers = []
    for (let i = 0; i < channels; i++) {
      (<any>newBuffers)[i] = newAudioBuffer.getChannelData(i)
    }
    return newBuffers
  }

  const frameCount = getLength()
  const audioBuffer = ac.createBuffer(channels, frameCount, ac.sampleRate)
  const newBuffers = getConcatBuffer(audioBuffer)

  for (let i = 0; i < newBuffers.length; i++) {
    const newBuffer = newBuffers[i]
    let size = 0

    for (const buffer of buffers) {
      const data = buffer.getChannelData(i)
      for (let j = 0; j < data.length; j++) {
        newBuffer[size++] = data[j]
      }
    }
  }

  return audioBuffer
}

export function to (input:AudioBuffer) {
  const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var bytes = (input.length/4) * 3;
  var ab = new ArrayBuffer(bytes);
  decode(input, ab);

  function removePaddingChars(input){
      var lkey = keyStr.indexOf(input.charAt(input.length - 1));
      if(lkey === 64){
        return input.substring(0,input.length - 1);
      }
      return input;
  }

  function decode (input, arrayBuffer) {
      //get last chars to see if are valid
      input = removePaddingChars(input);
      input = removePaddingChars(input);

      var bytes = parseInt(<any>((input.length / 4) * 3), 10);
      
      var uarray;
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      var j = 0;
      
      if (arrayBuffer) {
          uarray = new Uint8Array(arrayBuffer);
      } else {
          uarray = new Uint8Array(bytes);
      }

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
      
      for (i = 0; i < bytes; i += 3) {    
          //get the 3 octects in 4 ascii chars
          enc1 = keyStr.indexOf(input.charAt(j++));
          enc2 = keyStr.indexOf(input.charAt(j++));
          enc3 = keyStr.indexOf(input.charAt(j++));
          enc4 = keyStr.indexOf(input.charAt(j++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          uarray[i] = chr1;            
          if (enc3 != 64) uarray[i+1] = chr2;
          if (enc4 != 64) uarray[i+2] = chr3;
      }

      return uarray;    
  }

  return ab;
}