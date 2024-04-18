class Node {
    constructor(data = null, next = null) {
      this.data = data;
      this.next = next;
    }
  }
  
  // Custom LinkedList to be used with the hashMap.js module
  export default class LinkedList {
    constructor() {
      this.head = null;
    }
  
    // Adds a new node containing 'data' to the end of the list
    append(data) {
      if (this.head === null) return (this.head = new Node(data));
  
      let tmp = this.head;
  
      while (tmp.next !== null) {
        tmp = tmp.next;
      }
  
      tmp.next = new Node(data);
    }
  
    // Adds a new node containing 'data' to the start of the list
    prepend(data) {
      this.head = new Node(data, this.head);
    }
  
    // Returns the total number of nodes in the list
    size() {
      if (this.head === null) return 0;
  
      let tmp = this.head;
      let size = 1;
  
      while (tmp.next !== null) {
        tmp = tmp.next;
        size++;
      }
  
      return size;
    }
  
    // Returns the first node in the list
    getHead() {
      return this.head;
    }
  
    // Returns the node containing 'key', otherwise returns null
    get(key) {
      // If the list is empty, there is nothing to get - return null;
      if (this.head === null) return null;
      // If head has 'key', return the head
      if (this.head.data.key === key) return this.head;
  
      let tmp = this.head;
  
      while (tmp !== null) {
        if (tmp.data.key === key) return tmp;
        tmp = tmp.next;
      }
  
      return null;
    }
  
    // Returns true if the passed in key is in the list, otherwise returns false
    contains(key) {
      // If the list is empty, there is nothing to find - return false
      if (this.head === null) return false;
      let tmp = this.head;
  
      while (tmp !== null) {
        if (tmp.data.key === key) return true;
        tmp = tmp.next;
      }
  
      return false;
    }
  
    // Returns an array containing the data of each node
    toArray() {
      // If the list is empty, there is nothing to push into the array - return empty array
      if (this.head === null) return [];
  
      let tmp = this.head;
      let array = [];
  
      while (tmp !== null) {
        array.push(tmp.data);
        tmp = tmp.next;
      }
  
      return array;
    }
  
    // Loops through the list until data containing 'key' is found, then removes it and returns true,
    // otherwise returns false
    findAndRemove(key) {
      // If the list is empty, there is nothing to remove - stop
      if (this.head === null) return false;
      // Replace the current head node with the head.next node
      // when the request is to remove the first node within the list
      if (this.head.data.key === key) {
        this.head = this.head.next;
        return true; 
      }
  
      // Keep track of previous and current nodes
      let tmp = this.head;
      let previous = tmp;
  
      while (tmp !== null) {
        if (tmp.data.key === key) {
          // Set the previous node's next value to the current node's next value
          // linked list before: previous.next => tmp => tmp.next
          // linked list after: previous.next => tmp.next
          // The middle node (tmp) has been removed
          previous.next = tmp.next;
          return true;
        }
  
        previous = tmp;
        tmp = tmp.next;
      }
  
      return false;
    }
  }