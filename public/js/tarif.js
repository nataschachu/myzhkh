$('.change').on('click', function(e) {
   $(e.target.parentNode).html('<input type="text"><span class="save">Сохранить</span>');
});

$('.save').on('click', function(e) {
    var td = e.target.parentNode,
        tarifName = td.dataset.tarif,
        tarifValue;
        
    td = $(td);
    tarifValue = td.find('input').val();
        
    if (!tarifValue) return;
    
    $.ajax({
        url: './save-tarif',
        data: { tarifName: tarifName, tarifValue: tarifValue },
        success: function() {
            td.prev().html(tarifValue);
            td.html('<span class="change">Изменить</span>');
        }
    });
});