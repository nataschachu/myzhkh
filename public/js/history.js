$('.delete').live('click', function(e) {
   var td = e.target.parentNode;
   
   $.ajax({
        url: './delete-indication',
        data: { name: td.dataset.tarif, date: td.dataset.date }
   });
   
   $(td).parent().remove();
});