import { appendClassName } from "@shared/util";
import styles from "./index.module.css";

class ItemSelection<T> {
  selected: boolean;
  value: T;

  constructor(value: T, selected: boolean = false) {
    this.value = value;
    this.selected = selected;
  }
}

type Props<T> = {
  item: ItemSelection<T>,
  onChange: (v: ItemSelection<T>) => void,
  toText?: (v: T) => string,
  placeholder?: string,
  className?: string,
}

export function InputCheckbox<T>(props: Props<T>) {
  const toText = props.toText ?? ((value: T) => String(value));
  return (
    <label className={styles.label}>
      <input type="checkbox"
             checked={props.item.selected}
             onChange={(e) => {
               props.onChange(props.item);
               e.stopPropagation();
             }}
             className={appendClassName(styles.checkbox, props.className)}
      />
      <span>{toText(props.item.value)}</span>
    </label>
  );
}

export default InputCheckbox;
export { ItemSelection };
