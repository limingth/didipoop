  var cluster;
  var markers= [];
  //地图初始化&向地图随机加点
  var map = new AMap.Map("mapContainer",{
    resizeEnable: true,
    //二维地图显示视口
    view: new AMap.View2D({
      center:new AMap.LngLat(116.397428, 39.90923),
      zoom:13
    })

  });

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
Template.cluster.helpers({
  addCluster: function(tag) {
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

});
