const io = require('socket.io-client');
var Backoff = require('./reconnectInterval');
var reconnectInterval = new Backoff({
  ms: 800,
  max: 10000,
  jitter:0.1
});

var WebSocketServer = {
  isConnected: false,
  socket: null,
  interval: null,
  connect() {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
      this.socket = null;
    }

    console.log("------------------------reconnectInterval------------------------------")
    //console.log(reconnectInterval.duration())

    this.socket = io.connect('http://localhost:3000', {
      secure:true,
      reconnection:false,
      transports:['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      reconnectInterval = new Backoff({
        ms: 800,
        max: 10000,
        jitter:0.1
      });
      console.log('[' + (new Date()) + ' Control] Client receive message ');
    });
    this.socket.on('disconnect', () => {
      console.error('[' + (new Date()) + ' Control] Connect disconnect  ');
      this.isConnected = false;
      this.interval = setTimeout(() => {
        WebSocketServer.connect()
      },reconnectInterval.duration());
    });

    this.socket.on('error', (error) => {
      console.error('[' + (new Date()) + ' Control] Connect error  ');
      this.isConnected = false;
      this.interval = setTimeout(() => {
        WebSocketServer.connect()
      },reconnectInterval.duration());
    });
    this.socket.on('connect_error', (data) => {
      console.error('[' + (new Date()) + ' Control] Connect connect_error  ');
      this.isConnected = false;
      this.interval = setTimeout(() => {
        WebSocketServer.connect()
      },reconnectInterval.duration());
    });
    return this.socket;
  }
}

var socket = WebSocketServer.connect();