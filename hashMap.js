import LinkedList from "./linkedList";
export default class HashMap {
  #minSize = 16;
  #capacity = 0;
  #loadFactor = 0.75;
  #resizing = false;
  #buckets = new Array(this.#minSize);
}