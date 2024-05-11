
import { useState } from 'react';
import Select from 'react-select';

class DropdownOption<T> {
  id: string;
  value: T;

  constructor(text: T, id?: string) {
    this.id = id !== undefined ? id : "-1";
    this.value = text;
  }
}

type Props<T> = {
  value?: T;
  onChange?: (sel: T) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  items: T[];
  toText?: (e: T) => string;
  readonly?: boolean;
};

function Dropdown<T>(props: Props<T>) {
  //const readonly = props.readonly ?? false;

  //const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState();
  //const clearable = props.onClear != null;
  //const toText = props.toText ?? ((_) => 'toText is undefined');

  // NOTE: onClear and onChange can lead to component rerendering (because of value change)
  // usage of stopPropagation is forced
  // const onClear = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (props.onClear) {
  //     props.onClear();
  //   }
  //   setOpen(false);
  //   e.stopPropagation();
  // };

  // function _onChange(v: T) {
  //   return function (e: React.MouseEvent<HTMLDivElement>) {
  //     props.onChange?.(v);
  //     setOpen(false);
  //     e.stopPropagation();
  //   };
  // }

  // function _clearOption() {
  //   return (
  //     <div className={styles.dropdown_item_container} onClick={onClear}>
  //       Сброс выбора
  //     </div>
  //   );
  // }

  function _createUnselectedOption(option: DropdownOption<T>) {
    if (typeof (option.value) != 'string') {
      return { value: (option.value as DropdownOption<T>).id, label: (option.value as DropdownOption<T>).value };
    }
    return { value: option.value, label: option.value };
  }

  function _createSelectedOption(option: DropdownOption<T>) {
    if (typeof (option.value) != 'string') {
      return { value: (option.value as DropdownOption<T>).id, label: (option.value as DropdownOption<T>).value };
    }
    return { value: option.value, label: option.value };
  }

  function _createOption(option: DropdownOption<T>) {
    if (option.value == props.value) {
      return _createSelectedOption(option);
    } else {
      return _createUnselectedOption(option);
    }
  }

  function _createOptionList(options: DropdownOption<T>[]) {
    const items = [];
    for (const option of options) {
      items.push(_createOption(option));
    }
    return items;
  }

  // function _renderPlaceholder(text?: string) {
  //   return (
  //     <a className={styles.dropdown_placeholder} onClick={() => setOpen(!open)}>
  //       {text}
  //     </a>
  //   );
  // }

  // function _renderSelectedOption(text: DropdownOption<T>) {
  //   return (
  //     <a className={styles.dropdown_selected_option} onClick={() => setOpen(!open)}>
  //       {toText(text.value)}
  //     </a>
  //   );
  // }

  function handleSelect(data: any) {
    console.log(data)
    setSelectedOptions(data)
    if (!data) {

      if (props.onClear) {
        props.onClear();
      }
      return
    }
    if (data.value != -1) {
      props.onChange?.(data.value);
    } else {
      props.onChange?.(data.label);
    }
  }

  return (
    <Select
      options={_createOptionList(props.items.map((e) => new DropdownOption(e)))}
      isClearable
      value={selectedOptions}
      isSearchable={true}
      onChange={handleSelect}
      placeholder={props.placeholder}
    />
    // <div
    //   className={appendClassName(styles.dropdown, readonly ? styles.readonly : undefined)}
    //   onClick={() => setOpen(!open)}
    // >
    //   <div className={open ? styles.dropdown_border_open : styles.dropdown_border}>
    //     <div className={styles.dropdown_item_container}>
    //       {props.value == null || props.value == ''
    //         ? _renderPlaceholder(props.placeholder)
    //         : _renderSelectedOption(new DropdownOption(props.value))}
    //     </div>
    //   </div>
    //   <div
    //     className={appendClassName(
    //       appendClassName(styles.option_list, open ? styles.visible : styles.hidden),
    //       props.className
    //     )}
    //   >
    //     <div className={styles.dropdown_list_border}>
    //       {clearable && _clearOption()}
    //       {_createOptionList(props.items.map((e) => new DropdownOption(e)))}
    //     </div>
    //   </div>
    // </div>
  );
}

export default Dropdown;
export { DropdownOption };
