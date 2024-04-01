import { useState } from 'react';
import styles from './index.module.css';
import { uid } from 'uid';
import InputCheckbox from '../InputCheckbox';

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


function CheckboxList<T>(props: Props<T>) {
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
        <InputCheckbox checked={item.selected} text={props.displayName(item.value)} onChange={_checkboxOnChange(item)} />
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

export default CheckboxList
