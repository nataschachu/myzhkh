var pg = require('pg');
var conString = "postgres://shoihet:kennyStan8@localhost/mylocaldb";

/*
pg.connect(process.env.DATABASE_URL, function(err, client) {
    var result, query;
    
    if (err) throw err;
    
    query = client.query("SELECT * FROM tarif");
    
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    
    query.on("end", function (result) {
        console.log(JSON.stringify(result.rows, null, "    "));
        client.end();
    });
});
*/

function insertData(data) {
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("INSERT INTO indications VALUES ('" + data.name + "'," + data.value + ", current_date, 0)");
        done();
    });
}

function clear() {
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query("DELETE FROM indications WHERE date_add = current_date");
        done();
    });
}

function calcMoney(response) {
    var results = [];
    
    // process.env.DATABASE_URL
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
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
            results.push(row);
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


