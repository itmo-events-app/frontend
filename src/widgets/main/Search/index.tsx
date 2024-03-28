import { useState } from 'react';
import styles from './index.module.css'
import { Search as SearchLogo } from '@shared/ui/icons';

type Props = {
  onSearch: (arg0: string) => void,
}

function Search(props: Props) {
  const [value, setValue] = useState('');
  const _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const _value = (e.target as HTMLInputElement).value;
    setValue(_value);
    switch (e.key) {
      case 'Enter': {
        props.onSearch(_value);
        break;
      }
    }
  }

  return (
    <div className={styles.search}>
      <input className={styles.input} type="text" onKeyDown={_handleKeyDown}></input>
      <div className={styles.icon_cnt} onClick={() => props.onSearch(value)}>
        <SearchLogo />
      </div>
    </div >
  )

}

export default Search;
