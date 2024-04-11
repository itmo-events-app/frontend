import styles from './index.module.css'
import { Search as SearchLogo } from '@shared/ui/icons';

type Props = {
  value: string,
  onChange: (arg0: string) => void,
  onSearch: (arg0: string) => void,
  placeholder?: string,
}

function Search(props: Props) {
  const _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const _value = (e.target as HTMLInputElement).value;
    switch (e.key) {
      case 'Enter': {
        props.onSearch(_value);
        return;
      }
    }
  }

  const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _value = e.target.value;
    props.onChange(_value);
  }

  return (
    <div className={styles.search}>
      <input className={styles.input} type="text" placeholder={props.placeholder} value={props.value} onChange={_onChange} onKeyDown={_handleKeyDown}></input>
      <div className={styles.icon_cnt} onClick={() => props.onSearch(props.value)}>
        <SearchLogo />
      </div>
    </div >
  )

}

export default Search;
