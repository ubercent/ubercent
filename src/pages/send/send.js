(function() {
    var keys;
    var transaction;



    function parseBitcoinURL(url) {
        var r = /^bitcoin:0x([a-zA-Z0-9]{40})(?:\?(.*))?$/;
        var match = r.exec(url);
        if (!match) return null;

        var parsed = { url: url }

        if (match[2]) {
            var queries = match[2].split('&');
            for (var i = 0; i < queries.length; i++) {
                var query = queries[i].split('=');
                if (query.length == 2) {
                    parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
                }
            }
        }

        parsed.address = '0x'+match[1];
        return parsed;
    }


    function parseTransactionURL() {
        var result = parseBitcoinURL(decodeURIComponent(location.hash.substr(8)));
        if (result.amount) {
            if (result.amount.indexOf('$') === -1) {
                result.amount = Exchange.BTCtoUSD(result.amount);
            } else {
                result.amount = result.amount.replace('$', '');
            }
        }
        return result;
    }

    function initTransaction() {
        transaction = parseTransactionURL();
        console.log(transaction);
        var input = $('.send #amount');
        if (transaction && transaction.amount) {
            input.value = transaction.amount;
        } else {
            if (Device.iOS) {
                input.value = '0.01';
            }
        }
    }

    function setBalanceUI(balance) {
        var ui = $('.send #balance');
        ui.textContent = balance;
    }

    window.send = function() {
        app.scrollToTop();
        app.showLoading();
        var amount = $('.send #amount').value;
        var button = $('.send button');
        amount = Number(amount);
        amount = Exchange.USDtoBTC(amount);

        var receiver = transaction.address;
        Wallet.spend(amount, receiver, function(success, error) {
            if (!success) {
                alert(error ? (error.message || JSON.stringify(error)) : 'An Error occured. Try again.');
                app.showLoading(false);
                return;
            }
            location = '/';
        });
    }

    function show() {
        Account.fetchBalance(setBalanceUI);
        initTransaction();
        if (transaction) {
            updateIdenticon($('.send #identicon'), transaction.address);
        }
        setTimeout(function() {
            $('.send #amount').focus();
        }, 1000);
    }

    $('.send').show = show;
}());
