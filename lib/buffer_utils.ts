import { platform, logError } from './utils';

export function bufferToArrayBuffer (buffer:Buffer) : ArrayBuffer {
  const arraybuffer = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < view.length; i++) {
    view[i] = buffer[i]
  }

  return arraybuffer
}

export function arrayBufferToBuffer (arraybuffer:ArrayBuffer) : Buffer {
  if (platform.browser) {
    logError('Audio', 'platform must "node" or "electron"', true)
  }

  const buffer = new Buffer(arraybuffer.byteLength)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = view[i]
  }

  return buffer
}

export function audioBufferToArrayBuffer (audioBuffer:AudioBuffer, channel = 2) : ArrayBuffer {
  if (channel !== 1 && channel !== 2) {
    throw Error('Channel must 1 or 2.')
  }

  if (channel === 1) {
    return audioBuffer.getChannelData(0).buffer
  }

  function collect (buffers) {
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
      if (!buffers[i]) {
        buffers[i] = []
      }
      buffers[i].push(audioBuffer.getChannelData(i))
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

export function mergeAduioBuffer(ac:AudioContext, buffers:AudioBuffer[]) : AudioBuffer {
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