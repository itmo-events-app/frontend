class ItemSelection<T> {
  selected: boolean;
  value: T;

  constructor(value: T, selected: boolean = false) {
    this.value = value;
    this.selected = selected;
  }
}

export { ItemSelection };
