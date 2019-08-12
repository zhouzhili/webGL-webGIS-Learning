const str = `#ifdef GL_ES
precision mediump float;
	#endif
	
attribute vec2 uPosition;
uniform vec2 uResolution;
varying vec2 aColor;

void main(){
	gl_Position=aPosition;
	gl_PointSize=1.;
}`

const reg = /(attribute|uniform|varying) (.*?);/g

const arr = []
let r = null
while ((r = reg.exec(str))) {
  const name = r[2].split(' ')
  arr.push({
    type: r[1],
    name: name[name.length - 1]
  })
}

console.log(arr)
