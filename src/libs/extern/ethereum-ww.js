window.Ethereum = (function(){
	var worker = new Worker('webworker/ethereum-ww-intern.js');
	worker.onmessage = function (event) {
	  callbacks[event.data.op](event.data.result);
	};

	var callbacks = {};
	
	function generateKeys(callback){
		callbacks.generateKeys = callback;
		worker.postMessage({op:'generateKeys'});
	}

	function signTransaction(privateKey, tx,callback){
		callbacks.signTransaction = callback;
		worker.postMessage({
				op:'signTransaction',
				privateKey : privateKey,
				tx :tx
			});
	}

	function privateToPublic(privateKey, callback){
		callbacks.privateToPublic = callback;
		worker.postMessage({
			op:'privateToPublic',
			privateKey:privateKey
		});
	}

	return {
		generateKeys: generateKeys,
		signTransaction : signTransaction,
		privateToPublic : privateToPublic,
	}
}());