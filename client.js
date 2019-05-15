const io = require('socket.io-client');
var Backoff = require('./reconnectInterval');

var reconnectInterval = new Backoff({
  ms: 800,
  max: 10000,
  jitter:0.1
});
var isFirst = null;
var clientControl = {
  isConnected: false,
  socket: null,
  interval: null,
  isFirst:null,
  connect() {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
      this.socket = null;
    }
    var self = this;
    this.socket = io.connect('http://localhost:3000',  {
      secure:true,
      reconnection:false,
      transports:['websocket', 'polling'],
    });
    this.socket.on('connect', () => {
      console.log('[' + (new Date()) + ' Control] Client Client Connected ........ ');
      self.isConnected = true;
      isFirst = "non";
      reconnectInterval = new Backoff({
        ms: 800,
        max: 10000,
        jitter:0.1
      });
    });
    this.socket.on('connect_error', (error) => {
      console.error('[' + (new Date()) + ' Control] Connect connect_error  ');
      if(!isFirst){
        setTimeout(() => {
          console.error('[' + (new Date()) + ' Control] 3212321423567890-986754322  ');
          clientControl.connect();
        },reconnectInterval.duration())
      }
    });
    this.socket.on('disconnect', () => {
      console.error('[' + (new Date()) + ' Control] Connect disconnect  ');
      self.isConnected = false;
      function setInterVal(){

        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        console.log(self.isConnected)

        if (self.isConnected) {
          return;
        }
        clientControl.connect();
        setTimeout(setInterVal,reconnectInterval.duration());
      }
      setInterVal()
    });

    return this.socket;
  }
}


// const extend = require("extend");
// let clientControl11 = extend(true,{},clientControl)

clientControl.connect();