
function touchSlider(e) {
    //判断设备是否支持touch事件
  const slider = document.querySelectorAll(e);
  let isScrolling = 0;
  let startPos = {};
  let endPos = {};
  let touch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  for (var i = 0; i < slider.length; i++) {
      slider[i].childNodes[0].style.setProperty('margin-left', '0px', 'important');
    if (!!touch) {
      slider[i].addEventListener('touchstart',function(){
        handleEvent(event);
      },false);
    }
  }
  function handleEvent(event){
      if(event.type == 'touchstart'){
          start(event);
      }else if(event.type == 'touchmove'){
          move(event);
      }else if(event.type == 'touchend'){
          end(event);
      }
  };
  function start(event) {
      var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
      startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};
      //取第一个touch的坐标值
      isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
      event.target.addEventListener('touchmove',handleEvent,false);
      event.target.addEventListener('touchend',handleEvent,false);
  };
  function move(event) {
     let domEle = event.target
      //当屏幕有多个touch或者页面被缩放过，就不执行move操作
      if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
      let touch = event.targetTouches[0];
      endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
      isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;
      //isScrolling为1时，表示纵向滑动，0为横向滑动
      if(isScrolling === 0){
          event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
          if (domEle.getAttribute('class') === 'content userlist') {
            if (endPos.x < 0 && endPos.x > -202){
              domEle.parentNode.style.setProperty('margin-left', `${endPos.x / 20}rem`, 'important');
            } else if (endPos.x > 0) {
              domEle.parentNode.style.setProperty('margin-left', `0rem`, 'important');
            } else if (endPos.x < -202) {
              domEle.parentNode.style.setProperty('margin-left', `-10rem`, 'important');
            }
          }
      }
      // console.log(endPos);
  };
  function end(event) {
      var duration = +new Date - startPos.time;    //滑动的持续时间
      if(isScrolling === 0){   //当为水平滚动时

          if(Number(duration) > 10){
              //判断是左移还是右移，当偏移量大于10时执行
              if(endPos.x > 20){
                console.log('向右');
              }else if(endPos.x < -20){
                  console.log('向左');
              }
          }
      }
      //解绑事件
      event.target.removeEventListener('touchmove',handleEvent,false);
      event.target.removeEventListener('touchend',handleEvent,false);
  }
}

export {
  touchSlider
}
