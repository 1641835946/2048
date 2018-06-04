
window.onload=function () {
  for(var i=0; i<4; i++) {
    $("#bg").append("<div id=i"+i+'></div>');
    for(var j=0; j<4; j++) {
      $("#i"+i).append('<div id=i'+i+'j'+j+' class="square num0"></div>');
    }
  }
  //游戏刚刚开始，随机出现两个方块
  randomNum();
  randomNum();
  show();
}

document.onkeydown=function(){
  switch(isFull){
  //游戏结束提示
    case 0:
      alert("Game Over!");
      return;
    case 1:
      alert("Congratulation!");
      return;
    case 2:
      break;
  }
  switch(event.keyCode){
    case 37: //左键
      if(canLeft()) {
        moveLeft();
      }
      break;
    case 38: //向上键
      if(canUp()) {
        moveUp();
      }
      break;
    case 39: //右键
      if(canRight()) {
        moveRight();
      }
      break;
    case 40: //向下键
      if(canDown()) {
        moveDown();
      }
      break;
    default:
      return;
  }
  randomNum();
  show();
}
var panelContent=[
                  [0,0,0,0],
                  [0,0,0,0],
                  [0,0,0,0],
                  [0,0,0,0] ];
var randomNum=function(){
  var blankNum=0;
  for(var i=0; i<4; i++) {
    for(var j=0; j<4; j++) {
      if(panelContent[i][j]==0) {
        blankNum++;
      }
    }
  }  
  var numZ=Math.round(Math.random()*blankNum);
  if(numZ==0) numZ=1;
  if(Math.random()<0.7) {//加入2
    addNum(2,numZ);
  } else {//加入4
    addNum(4,numZ);
  }
}
var addNum=function(num,numZ){
  var z=0;
  for(var i=0; i<4; i++) {
    for(var j=0; j<4; j++) {
      if(panelContent[i][j]==0) {
        z++;
        if(z==numZ) {
          panelContent[i][j]=num;
          appear(i, j);
        }
      }
    }
  }
}

var isFull=function(){
  if(canLeft()||canUp()||canRight()||canDown()) {
    return 0;
  } else if(reach2048()) {
    return 1;
  } else {
    return 2;
  }
}
//*************************************************************************************************************************
var reach2048=function(){
  return false;
}
var canLeft=function(){
//是否可以向左合并或向左移动，成功返回true，失败返回false。
  for(var i=0; i<4; i++) {
    for(var j=3; j>0; j--) {
      if(panelContent[i][j]>0) {
        if(panelContent[i][j-1]==0 || panelContent[i][j]==panelContent[i][j-1]) {
          return true;
        }
      }
    }
  }
  return false;
}
var canUp=function(){
  for(var j=0; j<4; j++) {
    for(var i=3; i>0; i--) {
      if(panelContent[i][j]>0) {
        if(panelContent[i-1][j]==0 || panelContent[i][j]==panelContent[i-1][j]) {
          return true;
        }
      }
    } 
  }
  return false;
}
var canRight=function(){
  for(var i=0; i<4; i++) {
    for(var j=0; j<3; j++) {
      if(panelContent[i][j]>0) {
        if(panelContent[i][j+1]==0 || panelContent[i][j]==panelContent[i][j+1]) {
          return true;
        }
      }
    }
  }
  return false;
}
var canDown=function(){
  for(var j=0; j<4; j++) {
    for(var i=0; i<3; i++) {
      if(panelContent[i][j]>0) {
        if(panelContent[i+1][j]==0 || panelContent[i][j]==panelContent[i+1][j]) {
          return true;
        }
      }
    }
  }
  return false;
}
var turnLeft=function(i, j){
  //向左滑动
}
var turnRight=function(i, j){
  //向右滑动
}
var turnUp=function(i, j){
  //向上滑动
}
var turnDown=function(i, j){
  //向下滑动
}
var emphasize=function(i, j){//需修改
  //放大动画
  $("#i"+i+"j"+j).addClass("emphasize");
  window.setTimeout("shrink("+i+","+j+")", 100);
}
var shrink=function(i, j){
  //缩小动画
  $("#i"+i+"j"+j).addClass("shrink");
  window.setTimeout("removeEmphasize("+i+","+j+")", 100);
}
var removeEmphasize=function(i, j){
  //动画结束后移除产生动画的样式
  $("#i"+i+"j"+j).removeClass("emphasize");
  $("#i"+i+"j"+j).removeClass("shrink");  
}
var appear=function(i, j){
  //随机出现方块的动画
  $("#i"+i+"j"+j).addClass("appear");
  $("#i"+i+"j"+j).removeClass("appear");
}
var removeSquBg=function(i, j){
  $("#i"+i+"j"+j).removeClass("num"+panelContent[i][j]);
  $("#i"+i+"j"+j).addClass("num0");
}
var leftAnimate=function(i, j, m){
  // 滑出的动画，去掉底色
  turnLeft(i, m);
  removeSquBg(i, m);
  removeSquBg(i, j);
}
var upAnimate=function(i, m, j){
  turnUp(m, j);
  removeSquBg(m, j);
  removeSquBg(i, j);
}
var rightAnimate=function(i, j, m){
  turnRight(i, m);
  removeSquBg(i, m);
  removeSquBg(i, j);
}
var downAnimate=function(i, m, j){
  turnDown(m, j);
  removeSquBg(m, j);
  removeSquBg(i, j);
}
var moveLeft=function(){
  //一共三种动画，放大出现、移动消失、合并（移动消失+扩放出现）
  // 从最左侧开始，为0则移动到此位置，相同则合并，直到不能合并为止。然后到下一个方块检测移动，检测是否可以合并。
  for(var i=0; i<4; i++) {
    for(var j=0; j<3; j++) {
      var hasNum=false;
      //移动
      if(panelContent[i][j]==0){
        //为0时，panelContent[i][x]>0，则移动数字
        for(var x=j+1; x<4; x++) {
          if(panelContent[i][x]>0) {
            leftAnimate(i, j, x);
            panelContent[i][j]=panelContent[i][x];
            panelContent[i][x]=0;
            hasNum=true;
            break;
          }
        }
      }else{
        //不为0时，可能发生合并。
        hasNum=true;
      }
      //合并
      if(hasNum) {
        for(var z=j+1; z<4; z++) {
          if(panelContent[i][z]>0) {
            if(panelContent[i][j]==panelContent[i][z]) {
              leftAnimate(i, j, z);
              panelContent[i][j]=2*panelContent[i][j];
              panelContent[i][z]=0;
              emphasize(i, j);
              break;//只合并一次
            } else{
              break;//不等，不用再比较后面的是否相同
            }
          } else {//为0，就不必合并了
          }
        }
      }
    }
  }
}
var moveUp=function(){
  for(var j=0; j<4; j++) {
    for(var i=0; i<3; i++) {
      var hasNum=false;
      //移动
      if(panelContent[i][j]==0){
        for(var x=i+1; x<4; x++) {
          if(panelContent[x][j]>0) {
            upAnimate(i, x, j);
            panelContent[i][j]=panelContent[x][j];
            panelContent[x][j]=0;
            hasNum=true;
            break;
          }
        }
      }else{hasNum=true;}
      //合并
      if(hasNum) {
        for(var z=i+1; z<4; z++) {
          if(panelContent[z][j]>0) {
            if(panelContent[i][j]==panelContent[z][j]) {
              upAnimate(i, z, j);
              panelContent[i][j]=2*panelContent[i][j];
              panelContent[z][j]=0;
              emphasize(i, j);
              break;
            } else {
                break;//有数但不等，停止合并
            }
          }
        }
      }
    }
  }
}
var moveRight=function(){
  for(var i=0; i<4; i++) {
    for(var j=3; j>0; j--) {
      var hasNum=false;
      //移动
      if(panelContent[i][j]==0){
        for(var x=j-1; x>=0; x--) {
          if(panelContent[i][x]>0) {
            rightAnimate(i, j, x);
            panelContent[i][j]=panelContent[i][x];
            panelContent[i][x]=0;
            hasNum=true;
            break;
          }
        }
      }else{hasNum=true;}
      //合并
      if(hasNum) {
        for(var z=j-1; z>=0; z--) {
          if(panelContent[i][z]>0) {
            if(panelContent[i][j]==panelContent[i][z]) {
              rightAnimate(i, j, z);
              panelContent[i][j]=2*panelContent[i][j];
              panelContent[i][z]=0;
              emphasize(i, j);
              break;
            } else {
              break;
            }
          } 
        }
      }
    }
  }
}
var moveDown=function(){
  for(var j=0; j<4; j++) {
    for(var i=3; i>0; i--) {
      var hasNum=false;
      //移动
      if(panelContent[i][j]==0){
        for(var x=i-1; x>=0; x--) {
          if(panelContent[x][j]>0) {
            downAnimate(i, x, j);
            panelContent[i][j]=panelContent[x][j];
            panelContent[x][j]=0;
            hasNum=true;
            break;
          }
        }
      }else{hasNum=true;}
      //合并
      if(hasNum) {
        for(var z=i-1; z>=0; z--) {
          if(panelContent[z][j]>0) {
            if(panelContent[i][j]==panelContent[z][j]) {
              downAnimate(i, z, j);
              panelContent[i][j]=2*panelContent[i][j];
              panelContent[z][j]=0;
              emphasize(i, j);
              break;
            } else {
              break;
            }
          } 
        }
      }
    }
  }
}

var show=function(){
  for(var i=0; i<4; i++) {
    for(var j=0; j<4; j++) {
      if(panelContent[i][j]>0) {
        $("#i"+i+"j"+j).text(""+panelContent[i][j]);
      } else {
        $("#i"+i+"j"+j).text("");
      }
      $("#i"+i+"j"+j).addClass("num"+panelContent[i][j]);
    }
  }
}
