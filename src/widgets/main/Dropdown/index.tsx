import { uid } from "uid";
import styles from "./index.module.css";
import { FC, useState } from "react";
import { appendClassName } from "@shared/util";

class DropdownOption {
  id: string;
  text: string;

  constructor(
    text: string,
  ) {
    this.id = uid();
    this.text = text;
  }
}

type Props = {
  value?: string,
  placeholder?: string,
  className?: string,
  clearable?: boolean,
  items: DropdownOption[]
  onSelect?: (data: { text: string; id: string }) => void;
}


const Dropdown: FC<Props> = ({ value, items, onSelect, placeholder, className, clearable}) => {

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? "");


  function _select(item: DropdownOption) {
    return () => {
      const { text, id } = item;
      setSelected(text);
      setOpen(false);
      onSelect?.({ text, id });
    };
  }

  function _resetSelection() {
    return () => {
      setSelected("");
      setOpen(false);
    };
  }

  function _clearOption() {
    return (
      <div
        className={styles.dropdown_item_container}
        onClick={_resetSelection()}
      >
        <a href="#" className={styles.dropdown_placeholder} onClick={_resetSelection()}>Сброс выбора</a>
      </div>
    );
  }

  function _createUnselectedOption(option: DropdownOption) {
    return (
      <div
        key={option.id}
        className={styles.dropdown_item_container}
        onClick={_select(option)}
      >
        <a href="#" className={styles.dropdown_item} onClick={_select(option)}>{option.text}</a>
      </div>
    );
  }

  function _createSelectedOption(option: DropdownOption) {
    return (
      <div
        key={option.id}
        className={styles.dropdown_item_container + " " + styles.dropdown_item_container_selected}
        onClick={_select(option)}
      >
        <a href="#" className={styles.dropdown_item_selected} onClick={_select(option)}>{option.text}</a>
      </div>
    );
  }

  function _createOption(option: DropdownOption) {
    if (option.text == selected) {
      return _createSelectedOption(option);
    } else {
      return _createUnselectedOption(option);
    }
  }

  function _createOptionList(options: DropdownOption[]) {
    const items = [];
    for (const option of options) {
      items.push(_createOption(option));
    }
    return items;
  }

  function _renderPlaceholder(text?: string) {
    return (
      <a href="#" className={styles.dropdown_placeholder} onClick={() => setOpen(!open)}>
        {text}
      </a>
    );
  }

  function _renderSelectedOption(text: string) {
    return (
      <a href="#" className={styles.dropdown_selected_option} onClick={() => setOpen(!open)}>
        {text}
      </a>
    );
  }

  return (
    <div className={styles.dropdown}>
      <div className={open ? styles.dropdown_border_open : styles.dropdown_border}>
        <div className={styles.dropdown_item_container} onClick={() => setOpen(!open)}>
          {selected == "" ? _renderPlaceholder(placeholder) : _renderSelectedOption(selected)}
        </div>
      </div>
      <div
        className={appendClassName(appendClassName(styles.option_list, open ? styles.visible : styles.hidden), className)}>
        <div className={styles.dropdown_list_border}>
          {clearable && _clearOption()}
          {_createOptionList(items)}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
export { DropdownOption };
