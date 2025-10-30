const callbacks = new Map(); // Stores { id: callback }

export const addCallback = (id, callback) => {
  callbacks.set(id, callback);
};

export const getCallback = (id) => {
  
  console.log(callbacks.get(id), "my callback get")

  return callbacks.get(id);
};

export const removeCallback = (id) => {
  callbacks.delete(id);
};