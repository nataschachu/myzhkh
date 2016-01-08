var express = require('express');
var app = express();
var money = require('./money.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// морда
app.get('/', function(request, response) {
  response.render('pages/index');
});

// аяксовая ручка для расчета/записи новых показаний
app.get('/get-money', function(request, response) {
  //response.jsonp(money.get(request));
  money.get(request, response);
});

// страница просмотра/редактирования тарифов
app.get('/tarif', function(request, response) {
  money.getTarifData(response, 'pages/tarif');
});

// сохранение новых тарифов
app.get('/save-tarif', function(request, response) {
  money.saveTarif(request);
  response.send();
});

// страница просмотра/редактирования истории
app.get('/history', function(request, response) {
  money.getHistory(response, 'pages/history');
});

// удаление из истории показаний
app.get('/delete-indication', function(request, response) {
  money.deleteIndication(request);
  response.send();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


