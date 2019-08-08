#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

#include <lib/util.glsl>
#include <lib/shape.glsl>
#include <lib/color.glsl>

vec2 grid2(in vec2 st,in float row,in float col){
  vec2 p=vec2(st.x*col,st.y*row);
  // mod(p.y,2.0):除4取余
  float m=mod(uTime,4.);
  
  // 奇数行偏移正的,偶数偏移负的
	// 前2秒横向后2秒纵向移动
  p.x+=step(0.,2.01-m)*step(1.,mod(p.y,2.))*m;
  p.x-=step(0.,2.01-m)*(1.-step(1.,mod(p.y,2.)))*m;
  
  p.y+=step(0.,m-2.01)*step(1.,mod(p.x,2.))*m;
  p.y-=step(0.,m-2.01)*(1.-step(1.,mod(p.x,2.)))*m;
  
  return fract(p);
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color=WHITE;
  st=grid2(st,20.,20.);
  float d=sCircle(st,vec2(.5),.3);
  
  gl_FragColor.rgb=mix(color,AZUR,fill(d));
  gl_FragColor.a=1.;
}