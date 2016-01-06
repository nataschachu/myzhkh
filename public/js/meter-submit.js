$('.submit-button').click(getMoney);

function getMoney(e) {
    $.ajax({
        dataType: 'json',
        url: './get-money',
        data: $(this.form).serialize(),
        success: onGetData
    });
    this.remove();
}

function onGetData(data) {
    console.log(data);
    var html = [],
        names = {
            't1': 'Т1',
            't2': 'Т3',
            't3': 'Т3',
            'cold': 'Холодная вода',
            'hot': 'Горячая вода'
        },
        total = 0;
    
    $('.result').removeClass('hidden');
    
    data.forEach(function(item) {
        html.push(names[item.name] + ': ' + item.summ);
        html.push('<br/>');
        total += item.summ;
    });
    
    html.push('Итого: ' + parseInt(total));
    
    $('.result-content').html(html);
}
