$(function(){
  var countdown;
  var days = "Days";
  var hours = "Hours";
  var minutes = "Minutes";
  var seconds = "Seconds";
  var loading = true;
  var dividers = ['days,','hours,','minutes,','seconds until...'];
  var concert = new Date('September 18, 2017 18:00:00');
  var ticketsOnSale = new Date('August 28, 2017 00:00:00');

  function pad(n) {
  	return (parseInt(n) < 10 ? '0' : '') + n;
  }

  function setText(innertext) {
    $('#countdown').text(innertext);
    // console.log(innertext);
    $(document).trigger('clearLoadingScreen');
  }

  function clearLoadingScreen(){
    if (loading) {
      loading = false;
      $('.loader').fadeOut("slow");
      $(document).off('clearLoadingScreen');
    }
  }

  $(document).on('clearLoadingScreen',clearLoadingScreen);

  function tickDown(now) {
    var target_date = new Date(concert).getTime();
    var current_date = new Date(now).getTime();

    var diff = (target_date - current_date) / 1000;
    var dys = Math.floor(diff/86400);

    diff = diff % 86400;
    var hrs = Math.floor(diff/3600);

    diff = diff % 3600;

    var mins = Math.floor(diff/60);
    var secs = 60 - new Date(now).getSeconds();
    secs = secs == 60 ? '00' : pad(secs);

    var newCount = ['00', dividers[0], pad(hrs), dividers[1], pad(mins), dividers[2], secs, dividers[3]].join(' ');

    setText(newCount);
  }

  function setCustomDonateLink(donateId=false) {
    switch (donateId) {
      case 'tiffany':
      case 'michelle':
      case 'branch':
      case 'edmerald':
      case 'rachel':
        showCustomInfo(donateId);
        break;
      default:
        showSelectionInfo();
        break;
    }

    setDonateCode(donateId);
  }

  function showCustomInfo(donateId) {
    var fullName = $('.row.cast[data-performer=\'' + donateId + '\'] .name').text();
    var buttonName = fullName.split(' ')[0];
    var modalText = 'You are donating in support of ' + fullName + '. ';

    $('#back').show();
    $('.donate-selection').hide();

    renderNames(fullName,buttonName,modalText);
  }

  function showSelectionInfo() {
    var fullName = 'a teammate';
    var buttonName = 'Team';
    var modalText = '';

    $('#back').hide();
    $('.donate-selection').show();

    renderNames(fullName,buttonName,modalText);
  }

  function renderNames(fullName,buttonName,modalText) {
    $('.disclaimer .performer-name').text(fullName);
    $('#selected-performer').text(buttonName);
    $('#disclaimer-intro').text(modalText);
  }

  function setDonateCode(donateId) {
    var urlCode = {
      'tiffany': '78859',
      'michelle': '26329',
      'rachel': '78560',
      'edmerald': '3078754',
      'branch': '105988'
    }[donateId] || '0';

    var newHref = "https://redeemer.tpsdb.com/OnlineReg/2926?GoerID=" + urlCode;
    $('#donate-modal').attr('href', newHref);
  }

  function delegateCustomClicks(e){
    var donateId = $(e.target).data('performer');
    setCustomDonateLink(donateId);
  }

  window.onload = function(){
    $(document)
      .on('click', '#back', function(e){ setCustomDonateLink(false); })
      .on('click', 'a.donate-cast, .performers li', delegateCustomClicks);

    if (window.location.search.indexOf('donateId=') > -1) {
      var donateId = window.location.search.split('donateId=')[1].toLowerCase();
      setCustomDonateLink(donateId);
    } else {
      setCustomDonateLink();
    }

    tickDown(Date.now());

    countdown = setInterval(function(){
      tickDown(Date.now());
    }, 1000);

    if (Date.now() < ticketsOnSale) {
      $("#brown-paper-bag").addClass('disabled').attr('href','').text("Buy Tickets 08/28/17");
      $(".cart .col-xs-6").removeClass('col-xs-6').addClass('col-xs-5');
      $(".cart .col-xs-3").last().removeClass('col-xs-3').addClass('col-xs-4');
    } else {
      $("#brown-paper-bag").text("Buy Tickets");
    }
  };
});
