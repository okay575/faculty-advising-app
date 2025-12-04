const store = new Map();

export default {
  async getItem(key) {
    if (typeof key !== 'string') return null;
    const v = store.get(key);
    return v === undefined ? null : v;
  },
  async setItem(key, value) {
    if (typeof key !== 'string') return;
    store.set(key, value);
  },
  async removeItem(key) {
    store.delete(key);
  },
  async clear() {
    store.clear();
  }
};
