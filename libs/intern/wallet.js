var Wallet = (function() {
    var gasPrice = 41000000000;
    var gasLimit = 53000;

    function spend(amount, receiver, callback) {
    	console.log('spend',amount,receiver)
        var privateKey = Account.getKeyPairFromStorage().private;

        var tx = generateTx(Account.nonce(), gasPrice, gasLimit, receiver, amount, privateKey);
        console.log('push', tx);
        var signedTx = Ethereum.signTransaction(tx, privateKey);

        pushTx(signedTx,callback);
    }

    function generateTx(nonce, gasPrice, gasLimit, txTo, valueWei, privateKey) {
        return {
            nonce: sanitizeHex(decimalToHex(nonce)),
            gasPrice: sanitizeHex(decimalToHex(gasPrice)),
            gasLimit: sanitizeHex(decimalToHex(gasLimit)),
            to: sanitizeHex(txTo),
            value: sanitizeHex(decimalToHex(valueWei)),
            data: sanitizeHex('')
        }
    }

    function pushTx(signedTx,callback) {
        console.log('push', signedTx);
        Backend.pushTransaction(signedTx,callback);
    }


    function sanitizeHex(hex) {
        hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
        if (hex == "") return "";
        return '0x' + padLeftEven(hex);
    }

    function decimalToHex(dec) {
        return dec.toString(16);
    }

    function padLeftEven(hex) {
        hex = hex.length % 2 != 0 ? '0' + hex : hex;
        return hex;
    }

    return {
        spend: spend
    }
}());
