window.Exchange = (function() {
    // var rate = 781 / 100000000;
    var rate = 7.83 / 1000000000000000000;

    function BTCtoUSD(btc) {
        return btc * rate;
    }

    function USDtoBTC(btc) {
        return Math.round(btc / rate);
    }

    return {
        BTCtoUSD: BTCtoUSD,
        USDtoBTC: USDtoBTC
    }
}())
