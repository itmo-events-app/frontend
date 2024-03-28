import { useState } from 'react';
import styles from './index.module.css';
import { uid } from 'uid';

type Props<T> = {
  items: T[],
  displayName: (v: any) => string,
}

class ItemSelection<T> {
  uid: string;
  selected: boolean;
  value: T
  constructor(value: T, selected: boolean = false) {
    this.uid = uid();
    this.value = value;
    this.selected = selected;
  }
}


function SelectionList<T>(props: Props<T>) {
  const [items, setItems] = useState(props.items.map(v => new ItemSelection(v)));

  function _checkboxOnChange(item: ItemSelection<T>) {
    return function(e: any) {
      item.selected = e.target.checked;
      setItems([...items]);
    }
  }

  const _ItemSelection = (item: ItemSelection<T>) => {
    return (
      <div className={styles.item} key={item.uid}>
        <label>
          <input type="checkbox" checked={item.selected} onChange={_checkboxOnChange(item)} />
          <span>{props.displayName(item.value)}</span>
        </label>
      </div>

    )
  }

  const _ItemSelectionList = (items: ItemSelection<T>[]) => {
    const list = []
    for (const item of items) {
      list.push(_ItemSelection(item));
    }
    return list;
  }

  return (
    <div className={styles.list}>
      {_ItemSelectionList(items)}
    </div>
  )

}

export default SelectionList
