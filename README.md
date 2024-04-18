# hash-map
Utility class for creating a HashMap data structure with various methods.

- Uses the hash function created by bryc & Yves M. on Stack Overflow: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
- Automatically resizes itself based on its loadFactor and capacity.
- Uses Linked Lists to reduce collisions.

#### Public methods
- set(key, value) - Adds the key / value pair into the hash map. Updates the value if the key already exists.
- get(key) - Returns the key / value pair for 'key', otherwise returns null.
- has(key) - Returns true or false based on whether or not the 'key' is in the hash map.
- remove(key) - Attempts to remove the key from the hash map, returns true if succeeds, otherwise returns false.
- length() - Returns the number of keys stored in the hash map.
- clear() - Removes all entries in the hash map.
- keys() - Returns an array containing all the keys in the hash map.
- values() - Returns an array containing all the values in the hash map.
- entries() - Returns an array containing all the key / value pairs in the hash map.
