#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
uniform float uTime;

// 平滑边缘
float smoothstepEdge(float ft,float st){
  return smoothstep(ft,ft+0.001,st);
}

vec3 plot_Rect(vec2 st,vec2 center,float width,float height,vec3 color){
  float left=smoothstepEdge(center.x-width/2.,st.x);
  float right=smoothstepEdge(1.-(center.x+width/2.),1.-st.x);
  float bottom=smoothstepEdge(center.y-height/2.,st.y);
  float top=smoothstepEdge(1.-(center.y+height/2.),1.-st.y);
  return vec3(left*right*bottom*top)*color;
}

// 通过画2个矩形组合成十字
vec3 plot_cross(vec2 st,vec2 center,vec2 size,vec3 color){
  vec3 rect1=plot_Rect(st,center,size.x,size.y/3.,color);
  vec3 rect2=plot_Rect(st,center,size.x/3.,size.y,color);
  return rect1+rect2;
}

// 将坐标st 平移dis,返回新的坐标
vec2 translate2d(vec2 st,vec2 dis){
  return st+dis;
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

vec2 scale2d(vec2 st,vec2 scale){
  return mat2(scale.x,0.0,0.0,scale.y)*st;
}

void main(){
  vec2 st=gl_FragCoord.xy/uResolution;
  /**
   *平移可以直接移动，旋转与缩放需要先将元素移动到原点
   *处理完成后再移动到原来的位置
  **/
  st = translate2d(st,vec2(-0.5));
  // 缩放
  //st = scale2d(st,vec2(sin(uTime)));
  // 旋转
  st = rotate2d(st,uTime*60.0);
  st = translate2d(st,vec2(0.5));
  // 画一个白色的十字
  vec3 corss1=plot_cross(st,vec2(.5),vec2(.2),vec3(1.));
  gl_FragColor=vec4(corss1,1.);
}