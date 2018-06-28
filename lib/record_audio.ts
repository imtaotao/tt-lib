import { AudioCtx, download, inlineWorker, logError } from './utils'

// inline worker
function workerBody () {
  const _self = this
  const config = {
    bufferLen: 4096,
    numChannels: 2,
    mime_type: 'audio/wav',
  }
  let recordBuffer:any[] = []

  _self.onmessage = (e) => {
    switch(e.data.command) {
      case 'record':
        recordData(e.data.val)
        break
      case 'exportWAV':
        exportWAV()
        break
    }
  }

  function recordData (inputBuffer:Float32Array[]) {
    const numChannels = config.numChannels

      for (let i = 0; i < numChannels; i++) {
        if (!recordBuffer[i]) {
          recordBuffer[i] = []
        }
        recordBuffer[i].push(inputBuffer[i])
      }
  }

  function exportWAV () {
    const collectRecord = collect()
    const audioBlob = createAudioBlob(collectRecord)

    recordBuffer = []

    _self.postMessage({
      command: 'exportWAV',
      val: audioBlob,
    })
  }

  function createAudioBlob (collectRecord:Float32Array) {
    const { numChannels, mime_type } = config
    const interleaveData = encodeWAV(44100, numChannels, collectRecord)

    return [
      new Blob([interleaveData], { type: mime_type }),
      interleaveData,
    ]
  }

  function collect () {
    let buffers:any = []

    for (let i = 0; i < config.numChannels; i++) {
      buffers.push(mergeBuffers(recordBuffer[i]))
    }

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

  function mergeBuffers (buffers:Float32Array[]) {
    let result = new Float32Array(config.bufferLen * buffers.length)
    let offset = 0

    for (let i = 0; i < buffers.length; i++) {
      result.set(buffers[i], offset)
      offset += buffers[i].length
    }
    return result
  }

  function encodeWAV(sampleRate:number, numChannels:number, samples:Float32Array) {
    const dataLength = samples.length * numChannels
    const buffer = new ArrayBuffer(dataLength + 44)
    const view = new DataView(buffer)

    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)
    floatTo16BitPCM(view, 44, samples)

    return view
  }

  function floatTo16BitPCM(output:DataView, offset:number, input:Float32Array) {
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]))
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    }
  }

  function writeString(view:DataView, offset:number, string:string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
}

export class Record {
  public context = AudioCtx
  public filename:string
  public volume = 1
  private successFn:Function
  private errorFn = Record.logError
  private worker = Record.inlineWorker(workerBody)
  private recording = false
  private playing = false
  private audio:HTMLAudioElement | null
  private audioBlob:Blob | null
  private interleaveData:ArrayBuffer
  private recorder:ScriptProcessorNode
  private audioInput:MediaStreamAudioSourceNode
  private config = {
    bufferLen: 4096,
    numChannels: 2,
  }

  constructor (filename, successFn, errorFn) {
    this.filename = filename || 'record'
    this.successFn = successFn || (() => {})
    this.errorFn = errorFn
    this.listenerWorker()
    this.createEnv()
  }

  listenerWorker () {
    this.worker.onmessage = (e) => {
      switch(e.data.command) {
        case 'exportWAV':
          this.recordEnded(e.data.val)
          break
      }
    }
    this.worker.onerror = this.errorFn
  }

  recordEnded ([audioBlob, interleaveData]) {
    this.audioBlob = audioBlob
    this.interleaveData = interleaveData.buffer
    this.audio = null
    this.recording = false
    this.successFn()
  }

  createEnv () {
    this.connectDevice()
    .then(stream => {
      const { context } = this
      const { bufferLen, numChannels } = this.config
      this.recorder = context.createScriptProcessor(bufferLen, numChannels, numChannels)

      // stream origin
      this.audioInput = context.createMediaStreamSource(stream)

      this.recorder.onaudioprocess = (e) => {
        const buffer:Float32Array[] = []

        for (let channel = 0; channel < numChannels; channel++) {
          buffer.push(e.inputBuffer.getChannelData(channel))
        }

        this.worker.postMessage({
          command: 'record',
          val: buffer,
        })
      }
    })
  }

  connectDevice () {
    return navigator.mediaDevices.getUserMedia({audio: true})
    .then(stream => stream)
    .catch(<any>this.errorFn)
  }

  startRecord () {
    if (this.recording) {
      return this.errorFn(`In recording`)
    }

    const connect = () => {
      const { audioInput, recorder, context } = this
        if (!audioInput) {
          setTimeout(connect)
          return
        }

        this.recording = true
        this.audioBlob = null
        audioInput.connect(recorder)
        recorder.connect(context.destination)
    }
    connect()
  }

  stopRecord () {
    if (!this.recording) {
      return this.errorFn(`No recording`)
    }

    this.recorder.disconnect()
    this.worker.postMessage({
      command: 'exportWAV'
    })
  }

  play () {
    if (this.playing) return this.errorFn('Is playing')
    if (!this.audioBlob && !this.audio) {
      return this.errorFn(`No audio resources`)
    }

    this.playing = true

    if (!this.audio) {
      this.audio = Record.createAudioEl(this.audioBlob)
      this.audio.volume = this.volume
      this.audio.onended = (e) => {
          this.playing = false
        }
    }

    this.audio.play()
  }

  pause () {
    if (!this.playing) {
      return this.errorFn('Not playing')
    }

    (<HTMLAudioElement>this.audio).pause()
    this.playing = false
  }

  download () {
    if (this.recording) return this.errorFn(`In recording`)
    if (!this.audioBlob) return this.errorFn(`Audio blob is [${this.audioBlob}]`)

    Record.download(this.audioBlob, this.filename + '.wav')
  }

  static
  logError (infor:string, isErr?:boolean) {
    logError('Record', infor, isErr)
  }

  static
  inlineWorker (func) {
    return inlineWorker(func)
  }

  static
  download (blob:Blob, filename:string) {
    download(blob, filename)
  }

  static
  createAudioEl (blob) {
    const url = window.URL.createObjectURL(blob)
    const audio = document.createElement('audio')
    audio.src = url

    return audio
  }
}