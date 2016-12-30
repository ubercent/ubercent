window.Account = (function() {
    var privateKey;
    var publicKey;
    var nonce;

    function getKeyPairFromStorage(callback) {
        if (privateKey && publicKey) {
            callback({
                public: publicKey,
                private: privateKey
            });
            return;
        }
        privateKey = getFromLocalStorage('privateKey');
        if(!privateKey){
            createPrivateKey(callback);
            return; 
        }
        publicKey = getFromLocalStorage('publicKey');

        if(!publicKey){
            Ethereum.privateToPublic(privateKey,function(pk){
                localStorage.setItem('publicKey', pk);  
                callback({
                    public: pk,
                    private: privateKey
                });
            });
            return;
        }
        callback({
            public: publicKey,
            private: privateKey
        });
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

                    var res = {
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
        return call;
    }());

    function fetchBalance(callback) {
        Backend.balance(publicKey, function(balance) {
            callback(formatBalance(balance));
        });
        Backend.nonce(publicKey, function(_nonce) {
            nonce = Number(_nonce);
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
        return nonce ? nonce+1 : 0;
    }

    function setPrivateKey(privateKey,callback) {
        localStorage.setItem('privateKey', privateKey);
        Ethereum.privateToPublic(privateKey,function(publicKey){
            localStorage.setItem('publicKey', publicKey);  
            callback();
        });
    }

    return {
        getKeyPairFromStorage: getKeyPairFromStorage,
        fetchBalance: fetchBalance,
        nonce: getNonce,
        setPrivateKey: setPrivateKey
    }
}())
