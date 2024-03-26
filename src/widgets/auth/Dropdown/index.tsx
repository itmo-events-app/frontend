import { uid } from 'uid'
import styles from './index.module.css'
import { useState } from 'react'

class DropdownOption {
    id: string
    text: string
    private _selected: boolean
    private _disabled: boolean

    constructor(
        text: string,
        selected: boolean = false,
        disabled: boolean = false,
    ) {
        this.id = uid();
        this.text = text;
        this._selected = selected;
        this._disabled = disabled;
    }

    public get selected() { return this._selected; }
    public get disabled() { return this._disabled; }
    public set selected(value: boolean) { this._selected = value; }
    public set disabled(value: boolean) { this._disabled = value; }
}

type Props = {
    value?: string,
    placeholder?: string,
    className?: string,
    items: DropdownOption[]
}

function Dropdown(props: Props) {
    const [items, setItems] = useState(props.items);

    function _createOption(option: DropdownOption) {
        const selectedStyle = ' ' + (option.selected && !option.disabled ? styles.dropdown_item_container_selected : '');
        const disabledStyle = ' ' + (option.disabled ? styles.dropdown_item_container_disabled : '');

        return (<div className={styles.dropdown_item_container + ' ' + (props.className ?? '') + selectedStyle + disabledStyle}>
                    <div className={styles.dropdown_item}>
                        {option.text}
                    </div>
                </div>
                );
    }

    function _createOptionList(options: DropdownOption[]) {
        const elements = []
        for (const option of options) {
            elements.push(_createOption(option));
        }
        return elements;
    }

    function _expand() {
        return () => {
            setItems([...items]); // NOTE: force object recreation
        }
    }

    return  <div onClick={_expand()} className={styles.dropdown + ' ' + (props.className ?? '')}>
                <div className={styles.dropdown_item_container + ' ' + styles.dropdown_item_container_disabled + ' ' + (props.className ?? '')}>
                    <div className={styles.dropdown_item}>
                        {props.placeholder}
                    </div>
                </div>
                {_createOptionList(items)}
            </div>
}

export default Dropdown
export {DropdownOption}