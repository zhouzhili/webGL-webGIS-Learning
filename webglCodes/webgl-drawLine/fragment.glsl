precision mediump float;

uniform vec2 uResolution;

float plot(float sy,float y){
  if(y-.01<sy&&sy<y+.01){
    return 1.;
  }else{
    return 0.;
  }
}

void main(){
  // gl_FragCoord是着色器当前位置的坐标值，xy范围为canvas的[0,width],[0,height]
  // 下面st将gl_FragCoord转为webgl坐标[0,1]
  vec2 st=gl_FragCoord.xy/uResolution;
  float PI=3.1415926;
  
  // x范围转到[0,2PI]
  float tx=st.x*2.*PI;
  // x范围转到[-1,1]
  float ty=(st.y*2.)-1.;
  
  // y = sin(x) 曲线
  float pct=plot(ty,sin(tx));
  vec3 color=pct*vec3(0.,1.,.0);
  
  // y=0 直线 ，即X轴
  float xPct=plot(ty,0.);
  vec3 xAxisColor=xPct*vec3(1.,0.,0.);
  
  // x=PI 直线，即 Y轴
  float yPct=plot(tx,PI);
  vec3 yAxisColor=yPct*vec3(0.,0.,1.);
  
  // 颜色相加即的得到要绘制的图形
  color+=xAxisColor+yAxisColor;
  
  gl_FragColor=vec4(color,1.);
}