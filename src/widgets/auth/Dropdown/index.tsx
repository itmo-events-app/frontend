import { uid } from 'uid'
import styles from './index.module.css'
import { useState } from 'react'

class DropdownOption {
    id: string
    text: string

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
}


function Dropdown(props: Props) {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");

    function _select(item: DropdownOption) {
        return () => {
            setSelected(item.text);
            setOpen(false);
        }
    }

    function _resetSelection() {
        return () => {
            setSelected("");
            setOpen(false);
        }
    }

    function _clearOption() {
        return (
            <div
                className={styles.dropdown_item_container + ' ' + (props.className ?? '')}
                onClick={_resetSelection()}
            >
                <a href="#" className={styles.dropdown_placeholder} onClick={_resetSelection()}>Сброс выбора</a>
            </div>
        );
    }

    function _createUnselectedOption(option: DropdownOption) {
        return (
            <div
                className={styles.dropdown_item_container + ' ' + (props.className ?? '')}
                onClick={_select(option)}
            >
                <a href="#" className={styles.dropdown_item} onClick={_select(option)}>{option.text}</a>
            </div>
        );
    }

    function _createSelectedOption(option: DropdownOption) {
        return (
            <div
                className={styles.dropdown_item_container + ' ' + styles.dropdown_item_container_selected + ' ' + (props.className ?? '')}
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
        const items = []
        for (const option of options) {
            items.push(_createOption(option));
        }
        return items;
    }

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdown_item_container} onClick={() => setOpen(!open)}>
                <a href="#" className={styles.dropdown_placeholder + ' ' + (props.className ?? '')} onClick={() => setOpen(!open)}>
                    {selected == "" ? props.placeholder : selected}
                </a>
            </div>

            {open && props.clearable && _clearOption()}
            {open && _createOptionList(props.items)}
        </div>
    );
}

export default Dropdown
export {DropdownOption}