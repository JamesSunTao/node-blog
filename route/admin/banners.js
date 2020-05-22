const express=require('express');
const mysql=require('mysql');

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'learn'});

module.exports=function (){
  var router=express.Router();
  
  router.get('/', (req, res)=>{
    if (req.query.act == 'mod') {
        console.log(req.query.act)  
        db.query(`SELECT * FROM banner_table where ID=${req.query.id}`, (err, data)=>{
            if (err) {
                console.error(err);
                res.send('500').end()
            }else{
                db.query('SELECT * FROM banner_table', (err, banners)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.render('admin/banners.ejs', {banners,mod_data: data[0]});
                    }
                });
              
            }
        })
    } else if(req.query.act=='del'){
        db.query(`DELETE FROM banner_table WHERE ID=${req.query.id}`, (err, data)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.redirect('/admin/banners');
            }
          });
    } else{
        db.query('SELECT * FROM banner_table', (err, banners)=>{
            if(err){
              console.error(err);
              res.status(500).send('database error').end();
            }else{
              res.render('admin/banners.ejs', {banners});
            }
          });
    }
   
  });
  router.post('/', (req, res)=>{
    console.log(req.query.act)  
    var title = req.body.title;
    var description = req.body.description;
    var href = req.body.href;
    if (req.query.act=='add') { //添加
        if(!title || !description || !href){
            res.status(400).send('arg error').end();
          }else{
            db.query(`INSERT INTO banner_table (title, description, href) VALUE('${title}', '${description}', '${href}')`, (err, data)=>{
                if (err) {
                    res.send('500').end()
                }else{
                    res.redirect('?')
                }
            })
          }
    }else if(req.query.act=='mod') {  //修改
        db.query(`UPDATE banner_table SET \
        title='${req.body.title}',\
        description='${req.body.description}',\
        href='${req.body.href}' \
        WHERE ID=${req.body.mod_id}`, (err, data)=>{
            if (err) {
                console.error(err);
                res.status(500).send('database error').end();
            }else{
                res.redirect('/admin/banners');
            }
        })
    }
  });
 
  return router;
}