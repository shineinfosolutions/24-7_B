let io = null;

export const setSocketIO = (socketInstance) => {
  io = socketInstance;
};

export const getSocketIO = () => {
  return io;
};