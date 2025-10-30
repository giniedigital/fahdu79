import io from 'socket.io-client';
import store from './Redux/Store';
import {setSocketConnect} from './Redux/Slices/NormalSlices/LiveStream/LiveChats';

const SOCKET_URL = 'https://api.fahdu.in';

class WSService {
  initializeSocket = async (currentUserId, token) => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: {token},
        reconnection: true,
        autoConnect: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log(':::-> Socket connected');
        this.socket.emit('initiateConnection', currentUserId, res => console.log('Connection Initiated', res));
        store.dispatch(setSocketConnect({socketConnect: true}));
      });

      this.socket.on('disconnect', reason => {
        console.log(':::-> Socket disconnected:', reason);
        store.dispatch(setSocketConnect({socketConnect: false}));
      });

      this.socket.on('reconnect', () => {
        console.log(':::-> Socket reconnected');
        this.socket.emit('initiateConnection', currentUserId);
      });

      this.socket.off('message'); // remove previous listener
      this.socket.on('message', msg => {
        console.log('CHAT MESSAGE:', msg);
      });

      this.socket.on('error', err => {
        console.log('Socket error:', err);
      });
    } catch (error) {
      console.log('Socket init failed', error);
    }
  };

  emit(event, data = {}) {
    this.socket?.emit(event, data);
  }

  on(event, cb) {
    this.socket?.on(event, cb);
  }

  off(event, cb) {
    this.socket?.off(event, cb);
  }
}

const socketServices = new WSService();
export default socketServices;
