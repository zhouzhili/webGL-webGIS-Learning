#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

float pct(float fy,float ry){
  return smoothstep(ry-.05,ry,fy)-smoothstep(ry,ry+.05,fy);
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  // x [-10,10]
  float x=st.x*20.-10.;
  float ry=st.y*20.-10.;
  
  // 正弦函数
  float fy=4.*sin(x)/x;
  //正弦函数取小数部分
  float fy2=-x+sin(x);
  
  float p=pct(fy,ry);
  
  float p2=pct(fy2,ry);
  
  gl_FragColor.rgb=p*vec3(1.,0.,0.)+p2*vec3(0.,1.,0.);
  gl_FragColor.a=1.;
}