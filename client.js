const io = require('socket.io-client');
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
    this.socket = io.connect('http://localhost:3000', {
      reconnection: false
    });
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('[' + (new Date()) + ' Control] Client receive message ');


    });
    this.socket.on('disconnect', () => {
      console.error('[' + (new Date()) + ' Control] Connect disconnect  ');
      this.isConnected = false;
      this.interval = setInterval(() => {
        if (this.isConnected) {
          clearInterval(this.interval);
          this.interval = null;
          return;
        }
        WebSocketServer.connect()
      }, 5000);
    });
    this.socket.on('error', (error) => {
      console.error('[' + (new Date()) + ' Control] Connect error  ');
      this.isConnected = false;
      this.interval = setInterval(() => {
        if (this.isConnected) {
          clearInterval(this.interval);
          this.interval = null;
          return;
        }
        WebSocketServer.connect()
      }, 5000);
    });
    this.socket.on('connect_error', (data) => {
      console.error('[' + (new Date()) + ' Control] Connect connect_error  ');
      this.isConnected = false;
      this.interval = setInterval(() => {
        if (this.isConnected) {
          clearInterval(this.interval);
          this.interval = null;
          return;
        }
        WebSocketServer.connect()
      }, 5000);
    });
    return this.socket;
  }
}

var socket = WebSocketServer.connect();