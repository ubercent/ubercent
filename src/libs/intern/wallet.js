var Wallet = (function() {
    var gasPrice = 41000000000;
    var gasLimit = 53000;

    function spend(amount, receiver, callback) {
        var keys = Account.getKeyPairFromStorage();
        var tx = Ether.generateTx(receiver, amount, Account.nonce(), gasPrice, gasLimit);
        console.log('push', tx);
        var signedTx = Ether.signTransaction(keys.private,tx);
        console.log('signed', signedTx);
        Backend.pushTransaction(signedTx,callback);
    }

    return {
        spend: spend
    }
}());
