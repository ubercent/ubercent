(function() {
    var publicKey;

    function show() {
        startPullingBalance();
        if (publicKey) {
            //already initialized - no init operations
            return;
        }
        var keys = Account.getKeyPairFromStorage(function(keys){
             publicKey = keys.public;
            initUI();
        }); 
    }

    function initUI() {
        if (!window.qr) {
            return;
        }
        var qrCanvas = $('.receive #qrCode');
        qrCanvas.style.width = '240px';
        qrCanvas.style.height = '240px';
        qr.image({
            image: qrCanvas,
            value: publicKey,
            size: 10,
            level: 'H'
        });
        updateIdenticon($('.receive #identicon'), publicKey);
        var sendMeUrl = encodeURIComponent(location.protocol + '//' + location.host + '/#send?s=' + 'bitcoin:' + publicKey);
        $('.receive #publicKey').textContent = publicKey;
        $('.receive #whatsapp').href = 'whatsapp://send?text=' + sendMeUrl;
        $('.receive #email').href = 'mailto:?Subject=My Bitcoin Address&body=' + sendMeUrl;
        // $('.receive #copy').href = 'sms:&body='; + sendMeUrl;
    }

    var pullTimer;
    var lastBalance;

    function startPullingBalance() {
        pullTimer = setInterval(function() {
            Account.fetchBalance(function(balance) {
                if (lastBalance && balance !== lastBalance) {
                    return location = '/';
                }
                lastBalance = balance;
            });
        }, 10000);
    }

    function hide() {
        clearInterval(pullTimer);
    }


    $('.page.receive').show = show;
    $('.page.receive').hide = hide;
}())
