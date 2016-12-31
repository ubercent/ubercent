window.Account = (function() {
    var privateKey;
    var publicKey;
    var nonce;

    function getKeyPairFromStorage() {
        if (privateKey && publicKey) {
            return {
                public: publicKey,
                private: privateKey
            };
        }
        privateKey = getFromLocalStorage('privateKey');
        
        if(!privateKey){
            return createPrivateKey(); 
        }

        publicKey = getFromLocalStorage('publicKey');

        if(!publicKey){
            publicKey = Ether.privateToPublic(privateKey);
            localStorage.setItem('publicKey', publicKey);  
            return {
                    public: publicKey,
                    private: privateKey
                };
        }

        return {
            public:publicKey,
            private:privateKey
        }
    }

    function getFromLocalStorage(key) {
        if (typeof(Storage) !== "undefined") {
            return localStorage[key];
        } else {
            console.log('Sorry! No Web Storage support..');
        }
    }

    function createPrivateKey(){
        var keys = Ether.generateKeys();
        privateKey = keys.private;
        publicKey = keys.public;
        localStorage.setItem('privateKey', privateKey);
        localStorage.setItem('publicKey', publicKey);
        return {
            public: publicKey,
            private: privateKey
        }; 
    }

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
        return nonce+1;
    }

    function setPrivateKey(pK) {
        privateKey = pK;
        localStorage.setItem('privateKey', pK);

        publicKey = Ether.privateToPublic(privateKey);
        localStorage.setItem('publicKey', publicKey);  
    }

    return {
        getKeyPairFromStorage: getKeyPairFromStorage,
        fetchBalance: fetchBalance,
        nonce: getNonce,
        setPrivateKey: setPrivateKey
    }
}())
