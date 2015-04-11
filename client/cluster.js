var map, geolocation, cluster;
var markers= [];
Template.cluster.rendered = function() {
  //地图初始化&向地图随机加点
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

  //add bounced marker
  var marker = new AMap.Marker({
    position:map.getCenter(),
    draggable:true, //点标记可拖拽
    cursor:'move'   //鼠标悬停点标记时的鼠标样式
  });
  marker.setMap(map);
  // marker.setAnimation('AMAP_ANIMATION_BOUNCE'); //设置点标记的动画效果，此处为弹跳效果

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

  // 随机向地图添加500个标注点
  var mapBounds = map.getBounds();
  var sw = mapBounds.getSouthWest();
  var ne = mapBounds.getNorthEast();
  var lngSpan = Math.abs(sw.lng - ne.lng);
  var latSpan = Math.abs(ne.lat - sw.lat);

  for (var i = 0; i < 500; i ++) {
    var markerPosition = new AMap.LngLat(sw.lng + lngSpan * (Math.random() * 1),ne.lat - latSpan * (Math.random() * 1));
    var marker = new AMap.Marker({
      //基点位置
      position:markerPosition,
      //marker图标，直接传递地址url
      icon:"http://developer.amap.com/wp-content/uploads/2014/06/marker.png",
      //相对于基点的位置
      offset:{x:-8, y:-34}
    });
    markers.push(marker);
  }
  addCluster(0);

  function addCluster(tag) {
    //添加点聚合
    if(cluster) {
      cluster.setMap(null);
    }
    if(tag==1) {
      var sts=[{url:"http://developer.amap.com/wp-content/uploads/2014/06/1.png", size:new AMap.Size(32,32),offset:new AMap.Pixel(-16,-30)},
      {url:"http://developer.amap.com/wp-content/uploads/2014/06/2.png", size:new AMap.Size(32,32),offset:new AMap.Pixel(-16,-30)},
      {url:"http://developer.amap.com/wp-content/uploads/2014/06/3.png", size:new AMap.Size(48,48),offset:new AMap.Pixel(-24,-45),textColor:'#CC0066'}];
      map.plugin(["AMap.MarkerClusterer"],function(){
        cluster = new AMap.MarkerClusterer(map,markers,{styles:sts});
      });
    }
    else {
      map.plugin(["AMap.MarkerClusterer"],function(){
        cluster = new AMap.MarkerClusterer(map,markers);
      });
    }
  }
};

Template.cluster.events({
  //获取当前位置信息
  'click #getCurrentPosition': function() {
    console.log("getCurrentPosition");
    geolocation.getCurrentPosition();
  },
  //监控当前位置并获取当前位置信息
  'click #watchPosition': function() {
    console.log("watchPosition");
    geolocation.watchPosition();
  }
});
