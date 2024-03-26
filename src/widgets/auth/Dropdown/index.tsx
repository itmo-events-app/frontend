import styles from './index.module.css'

type Props = {
    value?: string,
    placeholder?: string,
    className?: string,
}

function Dropdown(props: Props) {
    return  <select className={styles.dropdown + ' ' + (props.className ?? '')}>
                <option className={styles.dropdown + ' ' + (props.className ?? '')} value="" disabled selected>{props.placeholder}</option>
            </select>
}

export default Dropdown
