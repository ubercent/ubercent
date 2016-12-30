window.Account = (function() {
    var privateKey;
    var publicKey;
    var nonce;

    function getKeyPairFromStorage(callback) {
        if (privateKey && publicKey) {
            return callback({
                public: publicKey,
                private: privateKey
            })
        }
        privateKey = getFromLocalStorage('privateKey');
        if (privateKey) {
            publicKey = getFromLocalStorage('publicKey');
            return callback({
                public: publicKey,
                private: privateKey
            });
        }
        createPrivateKey(callback);
    }

    function getFromLocalStorage(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage[key];
        } else {
            console.log('Sorry! No Web Storage support..');
        }
    }

    var createPrivateKey = (function(){
        var callbacks = [];

        function call(callback){
            callbacks.push(callback);
            if(callbacks.length==1){
                Ethereum.generateKeys(function(dk){
                    privateKey = dk.privateKey;
                    publicKey = dk.publicKey;

                    localStorage.setItem('privateKey', privateKey);
                    localStorage.setItem('publicKey', publicKey);

                    var res={
                        public: publicKey,
                        private: privateKey
                    };
                    callbacks.forEach(function(cb){
                        cb(res);
                    });
                    callbacks=[];   
                });
            }
        }
        return call
    }());

    function fetchBalance(callback) {
        Backend.balance(publicKey, function(balance) {
            callback(formatBalance(balance));
        });
        Backend.nonce(publicKey, function(_nonce) {
            nonce = Number(_nonce);// + 1;
        })
    }

    function formatBalance(balance) {
        balance = Exchange.BTCtoUSD(balance);
        var dollars = Math.floor(balance);
        var cents = Math.floor((balance - dollars) * 100);
        cents = cents < 10 ? '0' + cents : cents;
        return dollars + '.' + cents;
    }

    function getNonce() {
        return nonce?nonce+1:0;
    }

    function setPrivateKey(privateKey) {
        localStorage.setItem('privateKey', privateKey);
        localStorage.setItem('publicKey', Ethereum.privateToPublic(privateKey));
    }

    return {
        getKeyPairFromStorage: getKeyPairFromStorage,
        fetchBalance: fetchBalance,
        nonce: getNonce,
        setPrivateKey: setPrivateKey
    }
}())
