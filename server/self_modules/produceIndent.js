/** 生产订单功能（目前暂时弃置）*/const produceIndent = (app,connection) =>{  var frontRequestUrl = "/produceMS";  // 获取所有点线面图形  app.get(frontRequestUrl+'/maporderdata/listAllMapData',function(req,res){      var parentID = req.query.service_id?req.query.service_id:'';      var startDataId = req.query.startDataId?req.query.startDataId:0;      var limit = req.query.limit?req.query.limit:10;      // 将字符串转为地理数据      var sqlQuest = 'select *,count(*) as dataLength,parentID as service_uuid,astext(geometry) as geom,pid as id from geom where parentID="'+parentID+'" and id > '+startDataId+' limit '+limit+'select count(*)  where parentID="'+parentID;      connection.query(sqlQuest,function(error,res1,fileds){          if(error){              console.log(error);          }else{              console.log(sqlQuest);              res.send(JSON.stringify({code:200,msg:'获取图形数据成功',results:res1}));          }      })  })  // 添加点线面图形  app.post(frontRequestUrl+'/tricyclicGIS/addMapPoint',function(req,res){      var parse = req.body;      // 处理地理数据的字符串为mysql需要的格式      var geometry  = parse.type+parse.geom.replace(/\[/g,'(').replace(/]/g,')').replace(/,/g,' ').replace(/\) \(/g,',').replace(/\(\(/g,'(').replace(/\)\)/g,')');      // console.log(geometry);      var geomID = 'G'+new Date().getTime();      var sqlQuest = "insert into geom(pid,parentID,name,char1,char2,char3,remark,geometry,type) values(?,?,?,?,?,?,?,geomfromtext(?),?)";      // 需要mysql语句处理的字段，可以不必拼接，直接放入下面的自动拼接语句里      var sqlParam = [geomID,parse.serviceUuid,verifyUse(parse.name),verifyUse(parse.char1),verifyUse(parse.char2),verifyUse(parse.char3),verifyUse(parse.remark),geometry,parse.type];      connection.query(sqlQuest,sqlParam,function(error,res1){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'添加图形失败'}));          }else{              res.send(JSON.stringify({code:200,'msg':'添加图形成功'}));          }      })  })  // 文件上传  app.post('/CDTGIS/maporderdata/analyzeUploadFile',function(req,res){      res.setHeader("500");      res.send(JSON.stringify({code:200,msg:'sucess'}));  })}module.exports = produceIndent;