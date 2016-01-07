var pg = require('pg');
var conString = "postgres://shoihet:kennyStan8@localhost/mylocaldb";
var names = {
        't1': 'Т1',
        't2': 'Т3',
        't3': 'Т3',
        'cold': 'Холодная вода',
        'hot': 'Горячая вода'
    };

function insertData(data) {
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        client.query("INSERT INTO indications VALUES ('" + data.name + "'," + data.value + ", current_date, 0)");
        done();
    });
}

function clear() {
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        client.query("DELETE FROM indications WHERE date_add = current_date");
        done();
    });
}

function calcMoney(response) {
    var results = [];
    
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        var query = client.query("select curr.name, (curr.value - prev.value) * tarif.tarif_value summ\
            from  (select name, value \
                    from indications current\
                    where date_add in (select max(date_add) from indications )\
                        and deleted = 0\
                     ) curr\
            left join \
                  (select name, value \
                    from indications last\
                   where date_add in (select max(date_add)\
                                        from indications\
                                       where date_add not in (select max(date_add) from indications))\
                     and deleted = 0\
                  ) prev\
              on prev.name = curr.name \
            join tarif\
              on tarif.tarif_name = curr.name");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            var tmpRow = { name: names[row.name], summ: row.summ };
            
            results.push(tmpRow);
        });
        
        query.on('end', function() {
            done();
            return response.jsonp(results);    
        });
    });
}

exports.get = function(request, response) {
    var params = ['hot', 'cold', 't1', 't2', 't3'],
        queryData;
    
    queryData = request.query;
    
    clear();
    
    params.forEach(function(param) {
        var value = queryData[param];
        
        if (value !== undefined) {    
            insertData({ name: param, value: value });
        }
    });
    
    calcMoney(response);
};

exports.getTarifData = function(response, page) {
    var results = [];
    
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        var query = client.query("select * from tarif");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        query.on('end', function() {
            done();
            return response.render(page, { results: results });
        });
    });
};

exports.saveTarif = function(request) {
    var params = request.query;
    
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        var query = client.query("update tarif set tarif_value='" + params.tarifValue + "' where tarif_name='" + params.tarifName + "'");
        
        query.on('end', function() {
            done();
        });
    });
};

exports.getHistory = function(response, page) {
    var results = [];
    
    pg.connect(process.env.DATABASE_URL || conString, function(err, client, done) {
        var query = client.query("select * from indications where deleted = 0");
        
        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        
        query.on('end', function() {
            done();
            return response.render(page, { results: results });
        });
    });
};