$(document).ready(function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  $('input').blur(function () {
    if ($(this).val() !== '') {
      $(this).parent().css({ color: 'black' });
      $(this).css({ 'border-bottom': '1px solid silver', color: 'gray' });
    }
  });

  $('form > p > a').click(function () {
    var data = {};
    data.fullName = $("input[name='name']").val();
    data.carNumber = $("input[name='cardNumber']").val();
    data.transportType = $("select[name='transportType']").val();
    data.phone = $("input[name='phone']").val();

    var error = false;
    $('input').each(function (e, valor) {
      if ($(this).val() === '') {
        error = true;
      }
      if (error === true) {
        //-- with errors
        $(this).parent().css({ color: 'red' });
        $(this).css({ 'border-bottom': '1px solid red' });
      } else {
        //-- without errors
        $(this).parent().css({ color: 'black' });
        $(this).css({ 'border-bottom': '1px solid silver', color: 'gray' });
      }
    });

    if (!error) {
      tg.sendData(
        JSON.stringify({
          action: 'updateDriver',
          data,
        }),
      );
      tg.close();
    }
  });
});
