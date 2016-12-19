(function() {
    window.app = {};

    app.showLoading = function(isLoading) {
        $('#loading').hidden = isLoading === false ? true : false;
    }

    app.scrollToTop = function() {
        if (document.activeElement) {
            document.activeElement.blur();
        }
        setTimeout(function() {
            document.body.scrollTop = 0;
        }, 0)
    }
}());
