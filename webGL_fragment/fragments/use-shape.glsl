#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;

#include <lib/util.glsl>
#include <lib/shape.glsl>

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 color=vec3(0.);
  // 绘制圆
  float d=sCircle(st,vec2(.2,0.8),.1);
  color+=fill(d,vec3(1.));
  
  // 绘制弧线
  float sa=sArc(st,vec2(.2,0.5),.2,0.,PI);
  color+=stroke(sa,.01,rgb(0,204,102));
  
  // 绘制线段
  float l=sLine(st,vec2(.5,0.4),vec2(.9,.4));
  color+=stroke(l,.01,rgb(51,51,153));
  
  // 绘制扇形
  float p=sPie(st,vec2(.7),.3,0.,PI*1.2);
  color+=fill(p,rgb(153,51,102));
  
  // 正多边形
  float po=sPoly(st,vec2(.2),.2,5);
  color+=fill(po,rgb(255,153,102));

  float po2=sPoly(st,vec2(.6,0.2),.2,8);
  color+=fill(po2,rgb(0,153,51));
  
  gl_FragColor.rgb=color;
  gl_FragColor.a=1.;
}