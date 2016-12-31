var Wallet = (function() {
    var gasPrice = 41000000000;
    var gasLimit = 53000;

    function spend(amount, receiver, callback) {
    	console.log('spend',amount,receiver)
        var keys = Account.getKeyPairFromStorage();
        var privateKey = keys.private;
        var tx = generateTx(Account.nonce(), gasPrice, gasLimit, receiver, amount, privateKey);
        console.log('push', tx);
        var signedTx = Ether.signTransaction(tx, privateKey);
        pushTx(signedTx,callback);
    }


    function pushTx(signedTx,callback) {
        console.log('push', signedTx);
        Backend.pushTransaction(signedTx,callback);
    }

    return {
        spend: spend
    }
}());
