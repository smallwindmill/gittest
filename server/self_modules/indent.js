/** 订单功能*/const indent = (app,multipartMiddleware,fs,moment,connection,uploadFile, xlsx, countFactor) =>{  var frontRequestUrl = "/produceMS";  // 上传excel文件新增订单  app.post(frontRequestUrl+'/uploadExcelForAddIndent', multipartMiddleware,function(req,res){      var file = req.files.file;      var userID = req.body.id;      // console.log(file,req.body);      var nextFun = (file_path) =>{          var sheets = xlsx.parse(file_path);//获取到所有sheet          var sheet = sheets[0];          var total=success=fail=0;//数据统计          var importDataLen = sheet['data'].length - 1;          var totalError = {type:0, data:[], message:'的模板不存在'};          sheet['data'] = sheet['data'].filter(self=>{return self.length!=0});          for(let rowId in sheet['data']){              var row=sheet['data'][rowId];              if(rowId==0)continue;              var procedure = duty ='';              if(row.length){                // console.log(rowId, row);                var row_dir = row;                //var sqlQuest0 = "select * from template where id = '"+row[row.length-1]+"'";                var sqlQuest0 = "select * from template where id = '"+row[7]+"'";                // 查询对应的模板是否存在              (function(row){                connection.query(sqlQuest0,function(error,res0){                  console.log('1',row);                  // row = row_dir;                  // console.log(row);                  if(error){                    console.log(error);totalError.data.push(row[row.length-1]);return;                  }                  if(res0.length){                    total++;                    // console.log(res0[0].duty.split(' '));                    var procedureArr = res0[0].procedure.split(' ');                    var userArr = res0[0].duty.split(' ');                    // 添加订单记录                    var sqlQuest2 = "start transaction;insert into indent(name,erp, materialCode,materialName,planNum,planFinishDate,priority,ifNew,remark,templateID,status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";                    // var sqlQuest2 = "insert into indent(name,erp, materialCode,materialName,planNum,planFinishDate,planOnline,actualStart,priority,ifNew,remark,templateID,procedure,duty,ifOutsource,feedback,status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";                    //var sqlParam2 = [res0.name, row[0], row[1], row[2], row[3], row[4].replace(/-/g,'.'), row[5].replace(/-/g,'.'), row[6].replace(/-/g,'.'), row[7].replace(/-/g,'.'), row[8], row[9], row[10],0];                    console.log( row[0] );                    var sqlParam2 = [res0.name, row[2], row[3], row[4], row[6], row[0].replace(/\/|-/g,'.'), row[8], row[9], row[5], row[7], 0];                    // 根据订单开始时间设置权重                      //countFactor(row[6].replace(/-/g,'.'));                      countFactor(row[0].replace(/\/|-/g,'.'));                      connection.query(sqlQuest2,sqlParam2,function(error,res1){                        if(error){                          console.log(error);connection.query('rollback;commit');                        }else{                            // 添加流程记录                            // 方法一（暂废）                            /*for(let i = 0,len = procedureArr.length;i < len;i++){                              let dealProcedure = (function(rowId){                                var sqlQuest3 = "insert into `procedure`(indentID, name, materialCode,materialName,duty,status) values(?, ?, ?, ?, ?, ?)";                                // var sqlParam3 = [res1.insertId, procedureArr[i], row[2], row[3], userArr[i], 0];                                //var sqlParam3 = [res1.insertId, procedureArr[i], row[1], row[2], userArr[i], 0];                                console.log(res1);                                var sqlParam3 = [res1.insertId, procedureArr[i], row[3], row[4], userArr[i], 0];                                connection.query(sqlQuest3,sqlParam3,function(error,res1){                                  if(error){                                    console.log(error);                                    // connection.query('rollback;');                                  }else{                                    if(i == procedureArr.length-1){                                      success++;                                    }                                    if(rowId == sheet['data'].length-1){                                      if(i == procedureArr.length-1){                                        //var info = totalError.data.length?('编号为'+totalError.data.join()+'的'+totalError.data.length+'个模板不存在，请检查重试'):'';                                        console.log('新增订单成功，共'+total+'个订单');                                        connection.query('commit');                                        res.send(JSON.stringify({code:200,'msg':'新增订单成功', results: {total: total,success: success, fail: fail}}));                                      }                                    }                                  }                                })                              })(rowId)                            }*/                            // 方法二                            let dealProcedure = (i, rowId) => {                                var sqlQuest3 = "insert into `procedure`(indentID, name, materialCode,materialName,duty,status) values(?, ?, ?, ?, ?, ?)";                                // var sqlParam3 = [res1.insertId, procedureArr[i], row[2], row[3], userArr[i], 0];                                //var sqlParam3 = [res1.insertId, procedureArr[i], row[1], row[2], userArr[i], 0];                                // console.log(res1, res1[1], res1[1].insertId);                                var sqlParam3 = [res1[1].insertId, procedureArr[i], row[3], row[4], userArr[i], 0];                                connection.query(sqlQuest3,sqlParam3,function(error,res1){                                  if(error){                                    console.log(error);                                    connection.query('rollback;commit;');                                    res.send(JSON.stringify({code:500,'msg':'新增订单失败', results:''}));                                  }else{                                    // 如果未处理完成流程，前进一步                                    if(i < procedureArr.length-1){                                      i++;                                      dealProcedure(i, rowId);                                    }else if(i == procedureArr.length-1){                                      success++;                                      if(rowId == sheet['data'].length-1){                                          //var info = totalError.data.length?('编号为'+totalError.data.join()+'的'+totalError.data.length+'个模板不存在，请检查重试'):'';                                          console.log('新增订单成功，共'+total+'个订单');                                          connection.query('commit');                                          res.send(JSON.stringify({code:200,'msg':'新增订单成功', results: {total: total,success: success, fail: fail}}));                                      }                                    }                                  }                                })                            };                            dealProcedure(0, rowId);                          }                      })                  }else{                    console.log('新增订单失败,编号为'+row[7]+'的模板不存在');                    res.send(JSON.stringify({code:500,'msg':'新增订单失败,编号为'+row[7]+'的模板不存在', results: ''}));                  }                })             })(row)              }          }      }      uploadFile.storageFile(file,fs,moment,connection,userID,nextFun);  })  // 删除订单信息，用字段标识，不从数据库移除  app.post(frontRequestUrl+'/deleteIndent',function(req,res){      var parse = req.body;      var sqlQuest = "update indent set ifDelete= 1 where id='"+parse.id+"'";      connection.query(sqlQuest,function(error,res1){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'删除订单失败'}));          }else{              res.send(JSON.stringify({code:200,'msg':'删除订单成功'}));          }      })  })  // 还原订单信息  app.post(frontRequestUrl+'/recycleIndent',function(req,res){      var parse = req.body;      var sqlQuest = "update indent set ifDelete= 0 where id='"+parse.id+"'";      connection.query(sqlQuest,function(error,res1){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'还原订单失败'}));          }else{              res.send(JSON.stringify({code:200,'msg':'还原订单成功'}));          }      })  })  // 获取所有订单列表(根据时间段查询、erp查询、id查询)  app.get([frontRequestUrl+'/listAllIndentByDate', frontRequestUrl+'/listAllIndentById'],function(req,res){      var startDate = req.query.startDate?req.query.startDate:'';      var endDate = req.query.endDate?req.query.endDate:'';      var id = req.query.id?req.query.id:'';      var erp = req.query.erp?req.query.erp:'';      var ifDelete = req.query.ifDelete?req.query.ifDelete:0;      // var sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';      var sqlQuest = '';      var sqlParam = '';      /*if(id){        sqlQuest = 'select * from `procedure` a inner join indent b on a.indentID = b.id where b.id=? and ifDelete = ?';// where userName like "%'+userName+'%"';        sqlParam = [id, ifDelete];      }else if(erp){        sqlQuest = 'select * from `procedure` a inner join indent b on a.indentID = b.id where b.erp = ? and ifDelete = ?';// where userName like "%'+userName+'%"';        sqlParam = [erp, ifDelete];      }else if(startDate){        sqlQuest = 'select * from `procedure` a inner join indent b on a.indentID = b.id where (planOnline >= ? and planOnline <= ?) and ifDelete = ?';// where userName like "%'+userName+'%"';        sqlParam = [startDate.replace(/-/g,'.'), endDate.replace(/-/g,'.'), ifDelete];      }else{        sqlQuest = 'select *,a.status as status from `procedure` a inner join indent b on a.indentID = b.id and ifDelete = ?';        sqlParam = [ifDelete];      }*/      if(id){        sqlQuest = 'select * from indent  where id=? and ifDelete = ? order by indent.id';// where userName like "%'+userName+'%"';        sqlParam = [id, ifDelete];      }else if(erp){        sqlQuest = 'select * from indent  where erp = ? and ifDelete = ? order by indent.id';// where userName like "%'+userName+'%"';        sqlParam = [erp, ifDelete];      }else if(startDate){        sqlQuest = 'select * from indent  where (planOnline >= ? and planOnline <= ?) and ifDelete = ? order by indent.id';// where userName like "%'+userName+'%"';        sqlParam = [startDate.replace(/-/g,'.'), endDate.replace(/-/g,'.'), ifDelete];      }else{        sqlQuest = 'select * from indent  where ifDelete = ? order by indent.id';        sqlParam = [ifDelete];      }      connection.query(sqlQuest,sqlParam,function(error,res1,fileds){          // console.log(sqlQuest, sqlParam);          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单数据失败',results:res1}));          }else{              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单数据成功',results:res1}));              }else{                  res.send(JSON.stringify({code:200,msg:'暂无订单信息',results:res1}));              }          }      })  })  // 获取订单及对应流程表  app.get([frontRequestUrl+'/listIndentMatchTemplete'],function(req,res){      // var sqlQuest = 'select a.erp, a.materialCode, materialName, b.name ,GROUP_CONCAT(b.`procedure`) as `procedure`,GROUP_CONCAT(b.duty) as `duty` from indent a INNER JOIN template b where templateID = b.id and a.ifDelete = 0 GROUP BY a.id ORDER BY a.id';      var sqlQuest = "select a.erp, a.materialCode, materialName, b.name ,b.`procedure`, b.duty from indent a INNER JOIN (select template.id,template.name, template.procedure,replace(GROUP_CONCAT(userName),',',' ') as duty  from template,user where duty like CONCAT('%',userID,'%') and  ifDelete = 0 GROUP BY template.id) b where templateID = b.id and a.ifDelete = 0 GROUP BY a.id ORDER BY a.id";      connection.query(sqlQuest,function(error,res1,fileds){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单及模板数据成功',results:res1}));          }else{              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单及模板数据成功',results:res1}));              }else{                  res.send(JSON.stringify({code:500,msg:'暂无订单及模板数据',results:res1}));              }          }      })  })  // 获取所有订单状态列表(根据时间段查询)  app.get([frontRequestUrl+'/listAllIndentStatusByDate', frontRequestUrl+'/listIndentById'],function(req,res){      var userName = req.query.keyword?req.query.keyword:'';      var startDate = req.query.startDate?req.query.startDate:'';      var endDate = req.query.endDate?req.query.endDate:'';      var id = req.query.id?req.query.id:'';      var erp = req.query.erp?req.query.erp:'';      // var sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';      // id,name,erp,materialCode,materialName,userName as duty,`procedure`, status      var sqlQuest = '';var sqlParam = '';      if(id){        sqlQuest = 'select * from `procedure` left join user on duty=user.userID inner join indent on a.indentID = indent.id where id = "'+req.query.id+'"  ifDelete = 0 order by indentID, a.id';      }else if(erp){        sqlQuest = 'select * from `procedure` left join user on duty=user.userID inner join indent on a.indentID = indent.id where erp = ? and ifDelete = 0 order by indentID, a.id';        sqlParam = [erp];      }else if(startDate){        // sqlQuest = 'select a.*, indent.erp, indent.ifNew, indent.priority, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id  left join user on a.duty = user.userID where (indent.planOnline >= ? and indent.planOnline <= ?) and ifDelete = 0 order by indentID, a.id';        sqlQuest = 'select  a.*,a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where  (indent.planOnline >= ? and indent.planOnline <= ?) and ifDelete = 0 order by indentID, a.id';        sqlParam = [startDate.replace(/-/g,'.'), endDate.replace(/-/g,'.')];      }else{        sqlQuest = 'select  a.*, a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where ifDelete = 0 order by indentID, a.id';        // select userName as duty,a.* from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID      }      connection.query(sqlQuest, sqlParam, function(error,res1,fileds){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单状态失败',results:res1}));          }else{            // console.log(res1);              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单状态成功',results:res1}));              }else{                  res.send(JSON.stringify({code:200,msg:'暂无订单信息',results:res1}));              }          }      })  })  // 获取生产面板的订单数据(根据时间段查询)  app.get([frontRequestUrl+'/listShowPageData'],function(req,res){      // var sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';      // id,name,erp,materialCode,materialName,userName as duty,`procedure`, status      // var sqlQuest = 'select DISTINCT * from indent a left join `procedure` b on a.id = b.indentID where b.status != 0 GROUP BY a.id';      var sqlQuest = 'select DISTINCT c.userName as duty,b.*,a.erp, a.planNum, a.actualStart,a.planFinishDate,a.ifNew,a.priority,a.remark from indent a left join `procedure` b on a.id = b.indentID LEFT JOIN user c on b.duty = c.userID  where a.ifDelete = 0 GROUP BY a.id';      connection.query(sqlQuest, function(error,res1,fileds){          if(error){              console.log(error);              res.send(JSON.stringify({code:500,msg:'查询订单状态失败',results:res1}));          }else{            // console.log(res1);              if(res1.length){                  res.send(JSON.stringify({code:200,msg:'查询订单状态成功',results:res1}));              }else{                  res.send(JSON.stringify({code:200,msg:'暂无订单信息',results:res1}));              }          }      })  })  // 计算订单工时  var countIndentWorkTime = (indentID) => {    // var sqlQuest = 'select max(finishTime)-min(startTime) from proceduredetail where pid = ?';    // 该流程所用的时间（五位小数）    // var sqlQuest = 'update `procedure` a,(select ROUND(TIMESTAMPDIFF(MINUTE,min(startTime),max(finishTime))/60, 5) as ithour,max(finishTime),min(startTime), pid from proceduredetail where pid = ?) b set countHour = b.ithour where a.id = b.pid';    // var sqlQuest = 'insert into workhour(indentID, erp,materialCode,planNum,countHour,countWorkers) (select indentID, erp,materialCode,planNum,countHour,countWorkers from indent INNER JOIN  (select sum(countHour) as countHour,indentID,countWorkers from `procedure` INNER join (select sum(workercount) as countWorkers,pid from proceduredetail group by pid) pro_de  on pro_de.pid = `procedure`.id GROUP BY indentID) a on  indent.id = a.indentID where id = ?);select actulStartTime from indent where id=?';    var sqlQuest = 'insert into workhour(indentID, erp,materialCode,planNum,countHour,countWorkers) (select distinct indentID, erp,materialCode,planNum,countHour,countWorker from indent INNER JOIN  (select indentID,sum(countHour) as countHour,sum(countWorker) as countWorker from `procedure` group by indentID ) a on  indent.id = a.indentID where id = ?);select actualStart from indent where id=?';    var sqlParam = [indentID, indentID];    connection.query(sqlQuest,sqlParam,function(error,res1){        if(error){            console.log(error);        }else{          // 根据订单创建时间的权重计算          console.log(res1[1][0]);          var year = moment(new Date(res1[1][0].actualStart)).format('YYYY');          var month = moment(new Date(res1[1][0].actualStart)).format('MM');          // var sqlQuest = 'update workhour set factor = (select id from factor where year = ? and month = ? ) where indentID = ?;update workhour set singleHour = countHour/planNum,cost = (select a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?)*singleHour where indentID = ?';          // 判断当前权重因子是否存在          countFactor(res1[1][0].actualStart);          var sqlQuest2 = 'update workhour set factor = (select id from factor where year = ? and month = ? ) where indentID = ?;select distinct a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?';          var sqlParam2 = [year, month, indentID, indentID, indentID];          connection.query(sqlQuest2,sqlParam2,function(error2,res2){              if(error2){                  console.log(error2);              }else{                  var sqlQuest3 = 'update workhour set singleHour = countHour/planNum,cost = ?*singleHour where indentID = ?';                  var sqlParam3 = [res2[1][0].factor, indentID];                  console.log(sqlQuest3, sqlParam3, res2[1][0].factor);                  connection.query(sqlQuest3,sqlParam3,function(error3,res3){                      if(error3){                          console.log(error3);                      }else{                         console.log('id为'+indentID+'的订单已完成，工时统计也完成');                      }                  })              }          })           // console.log('id为'+pid+'的订单已完成，工时统计也完成');        }    })  }  // 更新订单信息(计算订单工时)  app.post(frontRequestUrl+'/updateIndentInfo',function(req,res){      var parse = req.body;      // var sqlQuest = "update indent set planFinishDate = ?,planOnline = ?,actualStart=?,actualFinish=?,priority=?,ifNew=?,ifOutsource=?,duty=?,status = ?, remark=? where id = ?";      // 需要mysql语句处理的字段，可以不必拼接，直接放入下面的自动拼接语句里      var planFinishDate = parse.planFinishDate;      var planOnline = parse.planOnline;      var actualStart = parse.actualStart;      var actualFinish = parse.actualFinish;      if(planFinishDate) planFinishDate = planFinishDate.replace(/-/g,'.');      if(planOnline) planOnline = planOnline.replace(/-/g,'.');      if(actualStart) actualStart = actualStart.replace(/-/g,'.');      if(actualFinish) actualFinish = actualFinish.replace(/-/g,'.');      //      var sqlQuest = "update indent set planNum=?, planFinishDate = ?,planOnline = ?,actualStart=?,actualFinish=?,priority=?,ifNew=?,ifOutsource=?,status = ?, remark=? where id = ?";      var sqlParam = [parse.planNum, planFinishDate, planOnline, actualStart, actualFinish, parse.priority, parse.ifNew, parse.ifOutsource, parse.status, parse.remark, parse.id];      if(parse.status == 2 ){          sqlQuest = 'select * from `procedure` where indentID = ? and status != 2';          sqlParam = [parse.id];          connection.query(sqlQuest, sqlParam, function(error8,res8){            if(error8){              console.log(error8);res.send(JSON.stringify({code:500,'msg':'更新订单失败'}));return;            }            if(res8.length > 0){              res.send(JSON.stringify({code:500,'msg':'该订单下还有'+res8.length+'个流程未完成，请确认全部完成后再操作'}));            }else if(res8.length == 0){              // 确认所有流程完成后，才能修改订单状态              sqlQuest = "update indent set status = ?, remark=? where id = ?";              sqlParam = [ parse.status, parse.remark, parse.id];              connection.query(sqlQuest,sqlParam,function(error,res1){                  if(error){                    console.log(error);                    res.send(JSON.stringify({code:500,'msg':'更新订单失败'}));                  }else{                    countIndentWorkTime(parse.id);// 订单完成后，结算订单工时                    res.send(JSON.stringify({code:200,'msg':'更新订单成功'}));                  }              })            }          })      }else if(parse.status == 1 ){        sqlQuest = "update indent set status = 1, remark=? where id = ?;update `procedure` set status =1 where indentID = ? order by id limit 1;";        sqlParam = [parse.remark, parse.id, parse.id];        connection.query(sqlQuest,sqlParam,function(error,res1){            if(error){              console.log(error);              res.send(JSON.stringify({code:500,'msg':'更新订单失败'}));            }else{              res.send(JSON.stringify({code:200,'msg':'更新订单成功'}));            }        })      }else{        connection.query(sqlQuest,sqlParam,function(error,res1){            if(error){                console.log(error);                res.send(JSON.stringify({code:500,'msg':'更新订单失败'}));            }else{                res.send(JSON.stringify({code:200,'msg':'更新订单成功'}));            }        })      }  })}module.exports = indent;