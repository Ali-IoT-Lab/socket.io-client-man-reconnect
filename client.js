const io = require('socket.io-client');
var Backoff = require('./reconnectInterval');

var reconnectInterval = new Backoff({
  ms: 800,
  max: 10000,
  jitter:0.1
});

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
      this.isConnected = true;
      this.isFirst = null;
      reconnectInterval = new Backoff({
        ms: 800,
        max: 10000,
        jitter:0.1
      });
    });
    this.socket.on('connect_error', (error) => {
      console.error('[' + (new Date()) + ' Control] Connect connect_error  ');
      this.isConnected = false;
      !this.isFirst && (this.interval = setTimeout(() => {
        console.error('[' + (new Date()) + ' Control] 3212321423567890-986754322  ');
        clientControl.connect();
      },reconnectInterval.duration()));

    });
    this.socket.on('disconnect', () => {
      console.error('[' + (new Date()) + ' Control] Connect disconnect  ');
      this.isConnected = false;
      this.isFirst = "non";
      var connectTimeInterval = 0;
      var uptadeTimeInterval = function(){
        if (self.isConnected) {
          console.error('[' + (new Date()) + ' Control]reconnected successfully ..............');
          clearInterval(self.interval);
          self.interval = null;
          return;
        }else {
          clearInterval(self.interval);
          connectTimeInterval = reconnectInterval.duration();
          console.error('[' + (new Date()) + ' Control] try to connect ..............');
          console.error(connectTimeInterval);
          clientControl.connect()
          self.interval = setInterval(uptadeTimeInterval, connectTimeInterval);
        }
      }
      self.interval = setInterval(uptadeTimeInterval, connectTimeInterval);
    });

    return this.socket;
  }
}


const extend = require("extend");
let clientControl11 = extend(true,{},clientControl)

clientControl11.connect();