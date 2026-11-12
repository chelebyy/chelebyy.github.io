import '@testing-library/jest-dom/vitest';

// Node 25+ ships its own Web Storage global, which is undefined without --localstorage-file
// and hides jsdom's implementation. Provide an in-memory Storage so tests behave like a browser.
if (typeof globalThis.localStorage === 'undefined') {
    const store = new Map<string, string>();
    const memoryStorage: Storage = {
        get length() {
            return store.size;
        },
        clear: () => store.clear(),
        getItem: key => store.get(String(key)) ?? null,
        key: index => [...store.keys()][index] ?? null,
        removeItem: key => {
            store.delete(String(key));
        },
        setItem: (key, value) => {
            store.set(String(key), String(value));
        },
    };
    Object.defineProperty(globalThis, 'localStorage', { value: memoryStorage, configurable: true });
}
