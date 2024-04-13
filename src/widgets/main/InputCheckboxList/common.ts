import { ItemSelection } from "@features/InputCheckbox";

function createItemSelectionList<T>(roles: T[], selected: (item: T) => boolean = (() => false)) {
  return roles.map(r => new ItemSelection(r, selected(r)));
}

function itemSelectionGetSelected<T>(items: ItemSelection<T>[]) {
  return items.filter(item => item.selected).map(item => item.value);
}

export { createItemSelectionList, itemSelectionGetSelected }
