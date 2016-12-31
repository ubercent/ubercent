(function() {

    function setBalanceUI(balance) {
        var ui = $('#balance');
        ui.textContent = balance;
    }


    function registerWalletHandler() {
        $(body).onclick = null;
        var loc = window.location;
        navigator.registerProtocolHandler(
            'bitcoin', loc.protocol + '//' + loc.host + '/?q=%s', 'uebercoin');
    }


    $('header').onclick = function() {
        location = '#scan';
    };

    function init() {
        var keys = Account.getKeyPairFromStorage();
        Account.fetchBalance(setBalanceUI);
        updateIdenticon($('#identicon'), keys.public);
    }
    init();
})()