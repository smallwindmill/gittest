/** 工时功能*/function verifyUse(str){    if(str){        return str;    }else{        return '';    }}const workhour = (app,connection) =>{  var frontRequestUrl = "/produceMS";  // 权数管理  // 上传excel文件新增订单  app.post(frontRequestUrl+'/queryFactorByDate',function(req,res){      var parse = req.body;      console.log('file:',parse);      /*var sqlQuest0 = "select * from user where userID = '"+parse.userID+"'";      connection.query(sqlQuest0,function(error,res0){        if(error){          console.log(error);return;        }        if(res0.length!=0){           res.send(JSON.stringify({code:500,'msg':'该工号已存在，请重新设置'}));        }else{          // 新增订单          var sqlQuest = "insert into user(userID, userName,type,pwd) values(?, ?, ?, ?)";          var sqlParam = [parse.userID, parse.userName, parse.type, parse.pwd];          connection.query(sqlQuest,sqlParam,function(error,res1){              if(error){                  console.log(error);                  res.send(JSON.stringify({code:500,'msg':'新增订单失败'}));              }else{                  connection.query("select * from user where uid = ?",[res1.insertId],function(error,res2){                      if(error){                          console.log(error);                          res.send(JSON.stringify({code:500,'msg':'新增订单失败'}));                      }else{                          console.log(res1);                          res.send(JSON.stringify({code:200,'msg':'新增订单成功', results: res2[0]}));                      }                  })              }          })        }      })*/  })  // 删除订单信息  app.post(frontRequestUrl+'/deleteSystemUser',function(req,res){      var parse = req.body;      var sqlQuest = "delete from user where userID = '"+parse.userID+"'";      connection.query(sqlQuest,function(error,res1){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'删除订单失败'}));          }else{              res.send(JSON.stringify({code:200,'msg':'删除订单成功'}));          }      })  })  // 获取所有订单列表(根据时间段查询)  app.get([frontRequestUrl+'/queryFactorByDate', frontRequestUrl+'/listSystemUserByName'],function(req,res){      var startTime = req.query.startTime?req.query.startTime:'';      var endTime = req.query.endTime?req.query.endTime:'';      var sqlQuest = 'select * from user where userName like "%'+userName+'%"';      connection.query(sqlQuest,function(error,res1,fileds){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单数据失败',results:res1}));          }else{              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单数据成功',results:res1}));              }else{                  res.send(JSON.stringify({code:500,msg:'无该订单信息',results:res1}));              }          }      })  })  // 更新订单信息  app.post(frontRequestUrl+'/updateFactor',function(req,res){      var parse = req.body;      var sqlQuest = "update userPower set login=?,handleIndent=?,handleWorkhour=?,listIndent=?,captain=? where userID = ?";      // 需要mysql语句处理的字段，可以不必拼接，直接放入下面的自动拼接语句里      var sqlParam = [parse.login, parse.handleIndent, parse.handleWorkhour, parse.listIndent, parse.captain, parse.userID];      connection.query(sqlQuest,sqlParam,function(error,res1){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'更新订单失败'}));          }else{              res.send(JSON.stringify({code:200,'msg':'更新订单成功'}));          }      })  })  // 工时操作  // 获取所有工时列表(根据时间段查询)  app.get([frontRequestUrl+'/queryWorkHourByDate', frontRequestUrl+'/listSystemUserByName'],function(req,res){      var startTime = req.query.startTime?req.query.startTime:'';      var endTime = req.query.endTime?req.query.endTime:'';      var sqlQuest = 'select * from user where userName like "%'+userName+'%"';      connection.query(sqlQuest,function(error,res1,fileds){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单数据失败',results:res1}));          }else{              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单数据成功',results:res1}));              }else{                  res.send(JSON.stringify({code:500,msg:'无该订单信息',results:res1}));              }          }      })  })  // 文件上传  app.post('/CDTGIS/maporderdata/analyzeUploadFile',function(req,res){      res.setHeader("500");      res.send(JSON.stringify({code:200,msg:'sucess'}));  })}module.exports = workhour;