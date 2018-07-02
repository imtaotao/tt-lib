import tt from './build'

window.t = tt
window.m = tt.Matrix
window.b = tt.Buffer
file.onchange = e => {
  window.f = file.files[0]
  b.blobToAudioBuffer(file.files[0]).then(r => {      
    let encoder = new tt.e.Encoder()
    let arrayBuffer = encoder.execute(r);
    // let arrayBuffer = b.audioBufferToArrayBuffer(r)
    console.log(arrayBuffer)
    window.a = arrayBuffer
    // var a = b.audioBufferToArrayBuffer(r)
    // console.log(a)
    // t.Utils.download(b.arrayBufferToBlob(a, 'audio/mp3'), '笔墨稠.mp3')
  })
}
// const slideInstace = new tt.Slide({
//   dom  : imgOne,		// 绑定的dom元素
//   mode : 'circle',	// 轮播模式，'circle' 或 'rect'
//   // swap : true,		// 是否两张模式交替进行
//   mount: 20,			// 柱子数量或圆圈数量
//   time : 500,			// 图片切换间隔时间
//   speed: 10,
// },[
//   './img/1.jpg',
//   './img/2.jpg',
//   './img/3.jpg',
//   './img/4.png',
//   './img/5.jpg'
// ])


// slide.over = _ => {return true}	// 择机停止动画或者做其他的操作
// window.s = slideInstace
// slideInstace.start = _ => {}
// imgOne.onmouseenter = _ => slideInstace.stop()

// imgOne.onmouseleave = _ => slideInstace.continue()

// left.onclick = _ => slideInstace.preImg()

// right.onclick = _ => slideInstace.nextImg()

window.data = [1, 2, 3, {
  dd: 'tt',
  l: {
    name: 'ff'
  }
}]
tt.Utils.createResponseData(data, (newV, oldV, path, arrName) => {
  console.log(newV, oldV, path, arrName)
})