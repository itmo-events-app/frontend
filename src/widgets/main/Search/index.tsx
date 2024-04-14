import styles from './index.module.css';
import { Search as SearchLogo } from '@shared/ui/icons';

type Props = {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSearch: (arg0: string) => void;
  placeholder?: string;
};

function Search(props: Props) {
  const _handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const _value = (e.target as HTMLInputElement).value;
    switch (e.key) {
      case 'Enter': {
        props.onSearch(_value);
        return;
      }
    }
  };

  return (
    <div className={styles.search}>
      <input
        className={styles.input}
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={_handleKeyDown}
      ></input>
      <div className={styles.icon_cnt} onClick={() => props.onSearch(props.value)}>
        <SearchLogo />
      </div>
    </div>
  );
}

export default Search;
