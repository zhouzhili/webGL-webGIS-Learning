#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;

float edge(float st,float real){
  return smoothstep(st-.01,st,real)-smoothstep(st,st+.01,real);
}

// 日升日落
void main(){
  vec2 coord=gl_FragCoord.xy/uResolution;
  // 时间转换为[0,1]
  float tx=mod(uTime,10.)/10.;
  // 时间坐标转换为[-1,1]
  float rx=tx*2.-1.;
  // 根据时间坐标计算y值
  float y=1.-pow(rx,2.);
  vec2 center=vec2(tx,y);
  float dis=distance(center,coord.xy);
  
  vec3 sun=(1.-step(.05,dis))*vec3(1.,0.,0.);
  gl_FragColor.rgb=sun+vec3(0.);
  gl_FragColor.a=1.;
}