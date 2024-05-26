import { uid } from 'uid';
import styles from './index.module.css';
import { Dispatch, SetStateAction } from 'react';
import { ArrowLeft } from '@shared/ui/icons';
import { ArrowRight } from '@shared/ui/icons';

class PageEntry {
  id: string;
  render_func: any;

  constructor(render_func: any) {
    this.id = uid();
    this.render_func = render_func;
  }
}

type Props = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  page_size: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  page_step: number;
  className?: string;
  items: PageEntry[];
  total_pages: number;
  total_elements: number;
};

function PagedList2(props: Props) {
  function _decPage() {
    return () => {
      if (props.page > 1) {
        props.setPage(props.page - 1);
      }
    };
  }

  function _incPage() {
    return () => {
      if (props.page < props.total_pages) {
        props.setPage(props.page + 1);
      }
    };
  }

  function _decPageSize() {
    return () => {
      if (props.page_size > props.page_step) {
        props.setPage(Math.floor(((props.page - 1) * props.page_size + 1) / (props.page_size - props.page_step) + 1));
        props.setPageSize(props.page_size - props.page_step);
      }
    };
  }

  function _incPageSize() {
    return () => {
      if (props.page_size < props.total_elements - props.page_step) {
        props.setPage(Math.floor(((props.page - 1) * props.page_size + 1) / (props.page_size + props.page_step) + 1));
        props.setPageSize(props.page_size + props.page_step);
      }
    };
  }

  function _selectPage(index: number) {
    return () => {
      props.setPage(index);
    };
  }

  function _navPageNum(index: number, selected: boolean) {
    if (index <= 0 || index > props.total_pages) return;

    return (
      <a
        key={index}
        onClick={_selectPage(index)}
        className={selected ? styles.nav_page_num_selected : styles.nav_page_num}
      >
        {index}
      </a>
    );
  }

  function _navPageText(text: string) {
    return <div className={styles.nav_page_num}>{text}</div>;
  }

  function _navInfo() {
    return (
      <div className={styles.nav_page_nums}>
        <div className={styles.nav_page_num_selected}>{(props.page - 1) * props.page_size + 1}</div>
        <div className={styles.nav_page_num_selected}>{'-'}</div>
        <div className={styles.nav_page_num_selected}>
          {props.page * props.page_size <= props.total_elements ? props.page * props.page_size : props.total_elements}
        </div>
        <div className={styles.nav_page_num}>{'из'}</div>
        <div className={styles.nav_page_num}>{props.total_elements}</div>
        <div className={styles.nav_page_num}>
          {props.total_elements % 10 == 1 && Math.floor(props.total_elements / 10) % 10 != 1 ? 'элемента' : 'элементов'}
        </div>
      </div>
    );
  }

  function _navPageNums() {
    const page_indexes = [];

    page_indexes.push(_navPageNum(props.page - 2, false));
    page_indexes.push(_navPageNum(props.page - 1, false));
    page_indexes.push(_navPageNum(props.page, true));
    page_indexes.push(_navPageNum(props.page + 1, false));
    page_indexes.push(_navPageNum(props.page + 2, false));

    return (
      <div className={styles.nav_page_nums}>
        {props.page > 3 && _navPageNum(1, false)}
        {props.page > 4 && _navPageText(' . . . ')}
        {page_indexes}
        {props.total_pages - props.page > 3 && _navPageText(' . . . ')}
        {props.total_pages - props.page > 2 && _navPageNum(props.total_pages, false)}
      </div>
    );
  }

  function _createEntries(index: number) {
    if (index <= 0 || index > props.total_pages) return;

    const items: any[] = [];

    items.push(props.items.map((item) => item.render_func()));

    return <div className={styles.list}>{items}</div>;
  }

  return (
    <div className={styles.list_container}>
      <div className={styles.navigator}>
        <div className={styles.nav_buttons}>
          <a onClick={_decPage()} className={styles.nav_button}>
            <ArrowLeft className={styles.arrow} />
          </a>
          <a onClick={_incPage()} className={styles.nav_button}>
            <ArrowRight className={styles.arrow} />
          </a>
        </div>
        <div className={styles.nav_info}>{_navInfo()}</div>
        <div className={styles.nav_buttons}>
          <a onClick={_decPage()} className={styles.nav_button}>
            <ArrowLeft className={styles.arrow} />
          </a>
          {_navPageNums()}
          <a onClick={_incPage()} className={styles.nav_button}>
            <ArrowRight className={styles.arrow} />
          </a>
        </div>
        <div className={styles.nav_buttons}>
          <a onClick={_decPageSize()} className={styles.nav_button}>
            <ArrowLeft className={styles.arrow} />
          </a>
          <div className={styles.nav_page_num}>Размер страницы:</div>
          <div className={styles.nav_page_num}>{props.page_size}</div>
          <a onClick={_incPageSize()} className={styles.nav_button}>
            <ArrowRight className={styles.arrow} />
          </a>
        </div>
      </div>
      {_createEntries(props.page)}
    </div>
  );
}

export default PagedList2;
export { PageEntry };
