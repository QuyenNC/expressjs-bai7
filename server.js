
const express = require("express");
const app = express();
//using req.body
const bodyparser = require('body-parser');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//using pug
app.set('view engine', 'pug');
 app.set('views', './views');
//using lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter)
db.defaults({ dreams: []})
  .write()
//using shorid
const shortId = require('shortid');

app.get("/", (request, response) => {
  response.render('index',{
    todoslist : db.get('dreams').value() 
  });
});

app.get('/todos',function(req,res){
  var q = req.query.q;
  var matchTodo = db.get('dreams').value().filter(function(x){
    return x.title.toLowerCase().indexOf(q.toLowerCase()) !==-1;
  })
  res.render('index',{
    todoslist : matchTodo ,
    q : q
  });
})

app.get('/create',function(req, res){
  res.render('create');
})

app.get('/todos/:id/delete',function(req, res){
  var id = req.params.id;
  console.log(id);
  var dream = db.get('dreams').remove({ id: id }).write();
  res.render('index',{
    todoslist : dream
  });

})
app.post('/todos/create',function(req, res){
  req.body.id = shortId.generate();
  db.get('dreams').push(req.body).write();
  res.redirect('/');
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
