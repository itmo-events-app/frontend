import InputCheckbox, { ItemSelection } from '@features/InputCheckbox';
import styles from './index.module.css';
import { uid } from 'uid';

type Props<T> = {
  items: ItemSelection<T>[];
  onChange: (e: ItemSelection<T>) => void;
  toText: (v: any) => string;
};

function CheckboxList<T>(props: Props<T>) {
  const _ItemSelection = (item: ItemSelection<T>) => {
    return (
      <div className={styles.item} key={uid()}>
        <InputCheckbox item={item} onChange={props.onChange} toText={props.toText} />
      </div>
    );
  };

  const _ItemSelectionList = (items: ItemSelection<T>[]) => {
    const list = [];
    for (const item of items) {
      list.push(_ItemSelection(item));
    }
    return list;
  };

  return <div className={styles.list}>{_ItemSelectionList(props.items)}</div>;
}

export default CheckboxList;
export { ItemSelection };
