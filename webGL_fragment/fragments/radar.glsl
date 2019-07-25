#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;

// 绘制圆圈
vec3 circle(vec2 st,vec2 center,float radius,float innerStep,float outStep,vec3 color){
  float len=length(st-center);
  float pct=smoothstep(len-innerStep,len,radius)-smoothstep(len,len+outStep,radius);
  return pct*color;
}

// 输入坐标 st,绘制线段 ab
vec3 sdLine(in vec2 p,in vec2 a,in vec2 b,vec3 color)
{
  vec2 pa=p-a,ba=b-a;
  float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  float len=length(pa-ba*h);
  return smoothstep(len-.002,len,.0005)*color;
}

// 输入坐标 st, 原点 c，半径 r 绘制扇形
float sdPie(in vec2 p,in vec2 c,in float r)
{
  p.x=abs(p.x);
  float l=length(p)-r;
  float m=length(p-c*clamp(dot(p,c),0.,r));// c = sin/cos of the aperture
  return max(l,m*sign(c.y*p.x-c.x*p.y));
}

// 闪烁点
vec3 npc(vec2 st,vec2 center){
  vec3 red=vec3(1.,.2,.2);
  // 外圈
  float radius=mod(uTime,1.5)/10.;
  vec3 out_circle=circle(st,center,radius,.01,radius/3.,red);
  // 内圈
  vec3 inner_circle=circle(st,center,.02,.005,.005,red);
  // 内圆
  float len=length(st-center);
  float pct=mod(uTime,.2);
  vec3 inner=step(pct,.1)*step(len,.01)*red;
  return out_circle+inner_circle+inner;
}

// 背景圆圈
vec3 bg(vec2 st){
  vec3 white=vec3(.4,.6,.8);
  vec3 bg_circle;
  for(int i=0;i<6;i+=1){
    bg_circle+=circle(st,vec2(.5),.1*float(i),.005,.002,white);
  }
  return bg_circle;
}

// 分割线
vec3 splitLine(vec2 st){
  vec3 line;
  for(int i=0;i<4;i++){
    float rad=radians(float(i)*90.+45.);
    line+=sdLine(st,vec2(.5),vec2(cos(rad)*.5+.5,sin(rad)*.5+.5),vec3(.4));
  }
  return line;
}

// 将坐标st，旋转 _angle度
vec2 rotate2d(vec2 st,float _angle){
  float rad=radians(_angle);
  // 旋转矩阵
  mat2 rotateMat=mat2(cos(rad),-sin(rad),
  sin(rad),cos(rad));
  st*=rotateMat;
  return st;
}

// 扇形扫描区
vec3 rotatePie(vec2 st){
  float rad=radians(30.);
  // 旋转
  vec2 st2=st-vec2(.5);
  st2=rotate2d(st2,uTime*30.);
  // 扇形
  float len=sdPie(st2,vec2(sin(rad),cos(rad)),.5);
  vec3 pie=(1.-sign(len))*vec3(0.,.6,.4)*sin(st2.x);
  // 边缘线
  vec2 st3=st2+vec2(.5);
  vec3 line=sdLine(st3,vec2(.5),vec2(cos(rad*2.)*.5+.5,sin(rad*2.)*.5+.5),vec3(0.,.6,.4));
  return pie+line;
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  vec3 bg_circle=bg(st);
  vec3 split=splitLine(st);
  vec3 point=npc(st,vec2(.6,.7));
  vec3 pie=rotatePie(st);
  gl_FragColor.rgb=bg_circle+split+point+pie;
  gl_FragColor.a=1.;
}