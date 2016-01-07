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
        total = 0;
    
    $('.result').removeClass('hidden');
    
    data.forEach(function(item) {
        html.push('<p class="result-item">' + item.name + ': ' + item.summ + '</p>');
        total += item.summ;
    });
    
    html.push('<p class="result-item-total">Итого: ' + parseInt(total) + '</p>');
    
    $('.result-content').html(html);
}
