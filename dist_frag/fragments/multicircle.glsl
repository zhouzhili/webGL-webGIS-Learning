#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  // st 范围为[-1,1]
  st=st*2.-1.;
  // 取绝对值之后 st 的范围就是[0,1]，dis的范围是[0.5,0.7071]
  float dis=length(abs(st)-.5);
  // 乘以10后取余
  dis=fract(dis*10.);
  gl_FragColor.rgb=dis*vec3(1.);
  gl_FragColor.a=1.;
}