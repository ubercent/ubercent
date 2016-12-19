window.Backend = {

    balance: function(publicKey, callback) {
        // var url = 'https://blockexplorer.com/api/addr/' + publicKey;
        // var url = 'https://blockexplorer.com/api/addr/' + publicKey;
        // var url = 'https://api.etherscan.io/api?module=account&action=balance&tag=latest&apikey=6NIBZMKYHKN6TMGAPFAH384X6D1YKUVVC8&address=' + publicKey;
        var url = 'https://etherchain.org/api/account/' + publicKey;

        function formatBalance(result) {
            return (result && result.data && result.data[0]) ? result.data[0].balance : 0;
        }

        httpGet(url, function(result) {
            callback(formatBalance(result));
        }, function() {
            callback(0);
        });
    },

    nonce: function(publicKey, callback) {
        var url = 'https://etherchain.org/api/account/' + publicKey + '/nonce';
        httpGet(url, function(result) {
            callback((result && result.data && result.data[0]) ? result.data[0].accountNonce : 0);
        }, function() {
            callback(0);
        });
    },

    pushTransaction: function(txHash, callback) {
        var pushUrl = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&apikey=6NIBZMKYHKN6TMGAPFAH384X6D1YKUVVC8&hex=' + txHash;

        function onReceive(result) {
            if (result && !result.error) {
                callback(true);
            } else {
                callback(false, result.error);
            }
        }

        httpPost(pushUrl, onReceive, '');
    }
}
