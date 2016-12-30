importScripts('ethereum.min.js')

onmessage = function (event) {
  var args = event.data; 
  postMessage({
  	op:args.op, 
  	result:Ethereum[args.op](args.privateKey,args.tx)
  });
};