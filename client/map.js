var map, geolocation;
//加载地图，调用浏览器定位服务
map = new AMap.Map("mapContainer",{
  resizeEnable: true,
  //二维地图显示视口
  view: new AMap.View2D({
    center:new AMap.LngLat(116.397428, 39.90923),
    zoom:13
  })

});

map.plugin('AMap.Geolocation', function () {
  geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,//是否使用高精度定位，默认:true
    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    showButton: true,        //显示定位按钮，默认：true
    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
  });
  map.addControl(geolocation);
  AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
  AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
});
//获取当前位置信息
function getCurrentPosition () {
  geolocation.getCurrentPosition();
};
//监控当前位置并获取当前位置信息
function watchPosition () {
  geolocation.watchPosition();
};
//解析定位结果
function onComplete (data) {
  var str = '<div>定位成功</div>';
  str += '<div>经度：' + data.position.getLng() + '</div>';
  str += '<div>纬度：' + data.position.getLat() + '</div>';
  str += '<div>精度：' + data.accuracy + ' 米</div>';
  str += '<div>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</div>';
  result.innerHTML = str;
};
//解析定位错误信息
function onError (data) {
  var str = '<p>定位失败</p>';
  str += '<p>错误信息：'
  switch(data.info) {
    case 'PERMISSION_DENIED':
      str += '浏览器阻止了定位操作';
      break;
    case 'POSITION_UNAVAILBLE':
      str += '无法获得当前位置';
      break;
    case 'TIMEOUT':
      str += '定位超时';
      break;
    default:
      str += '未知错误';
      break;
  }
  str += '</p>';
  result.innerHTML = str;
};
