var Wallet = (function() {
    var gasPrice = 42000000000;
    var gasLimit = 53000;

    function spend(amount, receiver, callback) {
        var privateKey = Account.getKeyPairFromStorage().private;
        var tx = Ether.generateTx(receiver, amount, Account.nonce(), gasPrice, gasLimit);
        console.log('push', tx);
        var signedTx = Ether.signTransaction(privateKey,tx);
        console.log('signed', signedTx);
        Backend.pushTransaction(signedTx,callback);
    }

    return {
        spend: spend
    }
}());
