$(document).ready(function () {
  const tg = window.Telegram.WebApp;
  tg.expand();
  console.log('tg', tg);
  console.log('initData', tg.initData);
  console.log('initDataSafe', tg.initDataUnsafe);

  //-- Click on terms and conditions
  $('.term').click(function () {
    var ctrl = $(this).find('i');
    if (ctrl.hasClass('fa-check-square-o')) {
      ctrl.attr('class', 'fa fa-square-o');
    } else {
      ctrl.attr('class', 'fa fa-check-square-o');
    }
  });

  $('input').blur(function () {
    if ($(this).val() != '') {
      $(this).parent().css({ color: 'black' });
      $(this).css({ 'border-bottom': '1px solid silver', color: 'gray' });
    }
  });

  //--- CONTINUE ---
  $('form > p > a').click(function () {
    //-- Detect terms and conditions
    var term = false;
    if ($('.term > i').hasClass('fa-check-square-o')) {
      term = true;
    }

    //-- only example
    var data = {};
    data.name = $("input[name='name']").val();
    data.carNumber = $("input[name='cardNumber']").val();
    data.transportType = $("select[name='transportType']").val();
    data.phone = $("input[name='phone']").val();
    data.term = term;

    var error = false;
    $('input').each(function (e, valor) {
      if ($(this).val() == '') {
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
          action: 'registerDriver',
          data,
        }),
      );
      tg.close();
    }
  });
});
