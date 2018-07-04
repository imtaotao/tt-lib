import { AudioCtx, platform, logError } from './utils'

export declare const Buffer:any

export function bufferToArraybuffer (buffer:Buffer) : ArrayBuffer {
  const arraybuffer = new ArrayBuffer(buffer.length)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < view.length; i++) {
    view[i] = buffer[i]
  }

  return arraybuffer
}

export function arraybufferToBuffer (arraybuffer:ArrayBuffer) : Buffer {
  if (platform.browser || platform.build) {
    logError('Buffer utils', '[ arrayBufferToBuffer ] method Must be used in "node" or "electron"', true)
  }

  const buffer = new Buffer(arraybuffer.byteLength)
  const view = new Uint8Array(arraybuffer)

  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = view[i]
  }

  return buffer
}

export function arraybufferToAudiobuffer (arraybuffer:ArrayBuffer) : Promise<AudioBuffer> {
  const ac = AudioCtx
  return ac.decodeAudioData(arraybuffer)
  .then(audioBuffer => audioBuffer)
  .catch(error => error)
}

export function blobToArraybuffer (blob:Blob) : Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader
    reader.readAsArrayBuffer(blob)
    reader.onload = () => resolve(reader.result)
  })
}

export function blobToAudiobuffer (blob:Blob) : Promise<AudioBuffer> {
  return new Promise((resolve) => {
    const ac = AudioCtx
    const reader = new FileReader
    reader.readAsArrayBuffer(blob)
    reader.onload = () => {
      ac.decodeAudioData(reader.result , ab => resolve(ab))
    }
  })
}

export function arraybufferToBlob (arraybuffer:ArrayBuffer, mimeType:string) : Blob {
  return new Blob([arraybuffer], {type: mimeType})
}

export function audiobufferToArraybuffer (audioBuffer:AudioBuffer) : ArrayBuffer {
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

export function arraybufferToAcResource (ac:AudioContext, arraybuffer:ArrayBuffer, volume = 1) : Promise<AudioBufferSourceNode> {
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

export function mergeAduiobuffer(buffers:AudioBuffer[]) : AudioBuffer {
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

export function cloneBuffer (buffer:Buffer, isDeep?:boolean) : Buffer {
  if (isDeep) return buffer.slice()

  const length = buffer.length
  const result = platform.node || platform.electron
    ? Buffer.allocUnsafe(length)
    : new (<any>buffer).constructor(length)

  buffer.copy(result)

  return result
}

export function cloneArraybuffer (arrayBuffer:ArrayBuffer) : ArrayBuffer {
  const result = new (<any>arrayBuffer).constructor(arrayBuffer.byteLength)
  new Uint8Array(result).set(new Uint8Array(arrayBuffer))

  return result
}

export function cloneDataView (dataView:DataView, isDeep?:boolean) : DataView {
  const buffer = isDeep
    ? cloneArraybuffer(dataView.buffer)
    : dataView.buffer

  return new (<any>dataView).constructor(buffer, dataView.byteOffset, dataView.byteLength)
}