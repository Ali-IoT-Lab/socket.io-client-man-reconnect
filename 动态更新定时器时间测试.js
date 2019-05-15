


var counter = 0;
var myFunction = function(){
  console.error('[' + (new Date()) + ' Control] try to connect ..............');
  clearInterval(interval);
  counter += 1000;
  interval = setInterval(myFunction, counter);
}
var interval = setInterval(myFunction, counter);