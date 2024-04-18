import LinkedList from "./linkedList.js";

class HashMap {
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

  // Creates a hash code from 'key' ->
  // Uses the hash code as index to access the buckets array ->
  // Checks if the index already holds a LinkedList ->
  // if false, creates a new LinkedList and adds into it the key / value pair
  // if true, checks if the LinkedList already holds the key / value pair ->
  //// if true, updates the value
  //// if false, adds the key / value
  set(key, value) {
    const pureKey = typeof key === "string" ? key.trim() : key;
    const index = this.#hash(pureKey);
    if (!index) return;
    // Capture the current capacity prior to adding the key
    const oldCapacity = this.#capacity;

    if (!this.#buckets[index]) {
      // Create a linear LinkedList data structure to store this key and other keys
      // that share this index. Reduces collisions.
      this.#buckets[index] = new LinkedList();
      this.#capacity += 1;
    }

    // If the LinkedList inside this bucket already has the key,
    // update the key's value...
    const location = this.#buckets[index].get(pureKey);
    if (location) return (location.data.value = value);
    // Otherwise add the key / value pair as a Node on the LinkedList inside the bucket
    this.#buckets[index].append({ key: pureKey, value });

    // Check if the buckets array needs to be resized if a previously empty
    // bucket has been filled with a new LinkedList
    if (this.#capacity > oldCapacity && !this.#resizing) this.#checkCapacity();
  }

  // Returns the key / value pair for 'key', otherwise returns null
  get(key) {
    const pureKey = typeof key === "string" ? key.trim() : key;
    const index = this.#hash(pureKey);
    if (!index) return null;
    const bucket = this.#buckets[index];

    if (bucket) {
      const keyMatch = bucket.get(pureKey);
      if (keyMatch) return keyMatch.data;
    }

    return null;
  }

  // Returns true or false based on whether or not the 'key' is in the hash map
  has(key) {
    const pureKey = typeof key === "string" ? key.trim() : key;
    const index = this.#hash(pureKey);
    if (!index) return false;
    const bucket = this.#buckets[index];
    const hasKey = bucket ? bucket.contains(pureKey) : false;
    return hasKey;
  }

  // Creates a hash code from 'key' ->
  // Uses the hash code as index to access the buckets array ->
  // if the index holds a LinkedList, it attempts to find and remove the key inside it ->
  // if the key was found and removed, it checks if the LinkedList is empty ->
  // if LinkedList is empty, it deletes the index, reduces the capacity, and checks
  // if the buckets array needs to be resized
  remove(key) {
    const pureKey = typeof key === "string" ? key.trim() : key;
    const index = this.#hash(pureKey);
    if (!this.#buckets[index]) return false;
    const removed = this.#buckets[index].findAndRemove(pureKey);
    if (!removed) return false;

    if (this.#buckets[index].getHead() === null) {
      delete this.#buckets[index];
      this.#capacity -= 1;
      this.#checkCapacity();
    }

    return true;
  }

  // Returns the number of keys stored in the hash map by looping
  // through all LinkedLists and calling their size() method that returns
  // the number of Nodes they contain (see linkedList.js module)
  length() {
    let totalKeys = 0;
    this.#buckets.forEach((item) => (totalKeys += item.size()));
    return totalKeys;
  }

  // Removes all entries in the hash map
  clear() {
    this.#buckets = new Array(16);
    this.#capacity = 0;
  }

  // Returns an array containing all the keys in the hash map
  keys() {
    const keys = [];

    this.#buckets.forEach((bucket) => {
      bucket.toArray().forEach((item) => {
        keys.push(item.key);
      });
    });

    return keys;
  }

  // Returns an array containing all the values in the hash map
  values() {
    const values = [];

    this.#buckets.forEach((bucket) => {
      bucket.toArray().forEach((item) => {
        if (item.value) values.push(item.value);
      });
    });

    return values;
  }

  // Returns an array containing all the key / values pairs in the hash map
  entries() {
    const entries = [];

    this.#buckets.forEach((bucket) => {
      bucket.toArray().forEach((item) => {
        entries.push(item);
      });
    });

    return entries;
  }

  // Creates a copy of all the key / value pairs that are stored in the hash map ->
  // Replaces the current buckets array with a new array of a different size (newBuckets) ->
  // Resets the capacity ->
  // Activates the #resizing flag to prevent stack overflow when calling set(key, value),
  // that in turn calls checkCapacity(), that in turn calls this function ->
  // Passes the key / value pairs that were held by the old buckets array into the set(key, value)
  // method to be added into the new buckets array.
  // !! Calling set(key, value) instead of directly copying the key / value pairs into the new buckets
  // array is necessary, since the hash(key) method called by set(key, value) uses the size of the buckets
  // array to provide a hash number that does not exceed the length of the buckets array
  // See hash(key) method for more info
  #changeSize(newBuckets) {
    const entries = this.entries();
    this.#buckets = newBuckets;
    this.#capacity = 0;
    this.#resizing = true;

    entries.forEach((item) => {
      this.set(item.key, item.value);
    });

    this.#resizing = false;
  }

  // Determines whether the buckets array size needs to be increased
  // or decreased based on the loadFactor and the current capacity
  #checkCapacity() {
    const bucketsLength = this.#buckets.length;

    if (this.#capacity / bucketsLength >= this.#loadFactor) {
      this.#changeSize(new Array(bucketsLength * 2));
    } else if (
      bucketsLength > this.#minSize &&
      this.#capacity / (bucketsLength / 2) < this.#loadFactor
    ) {
      this.#changeSize(new Array(bucketsLength / 2));
    }
  }
}
