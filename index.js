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