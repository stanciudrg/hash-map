import LinkedList from "./linkedList";
export default class HashMap {
  #minSize = 16;
  #capacity = 0;
  #loadFactor = 0.75;
  #resizing = false;
  #buckets = new Array(this.#minSize);

  // Transforms a given string into a hash code
  // Authors: bryc & Yves M. on Stack Overflow
  // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
  #hash(key) {
    if (key === "" || key === undefined || key === null) return;

    if (typeof key !== "string")
      throw new TypeError(
        `key: expected a typeof 'string' but received a typeof '${typeof key}'`
      );

    let h1 = 0xdeadbeef ^ 0;
    let h2 = 0x41c6ce57 ^ 0;

    for (let i = 0, ch; i < key.length; i++) {
      ch = key.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    // Ensure that the hash code will not exceed the length of the buckets array
    // to prevent the methods that call this function from accessing an index out
    // of bounds
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)) % this.#buckets.length;
  }
}
