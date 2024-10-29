$target = $('.point');
$target.on('click', e=> {
  $target.removeClass('-active');
  $(e.currentTarget).addClass('-active');
});