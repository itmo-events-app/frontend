import { uid } from 'uid'
import styles from './index.module.css'
import { useState } from 'react'
import { ArrowLeft } from '@shared/ui/icons'
import { ArrowRight } from '@shared/ui/icons'

class PageEntry {
  id: string
  render_func: any

  constructor(
    render_func: any
  ) {
    this.id = uid();
    this.render_func = render_func;
  }
}

type Props = {
  page: number,
  page_size: number,
  className?: string,
  items: PageEntry[]
}

function PagedList(props: Props) {

  const [page, setPage] = useState(props.page);

  const pages_num: number = Math.ceil(props.items.length / props.page_size);

  function _decPage() {
    return () => {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  }

  function _incPage() {
    return () => {
      if (page < pages_num) {
        setPage(page + 1);
      }
    }
  }

  function _selectPage(index: number) {
    return () => {
      setPage(index);
    }
  }

  function _navPageNum(index: number, selected: boolean) {
    if (index <= 0 || index > pages_num) return;

    return (
      <a
        key={index}
        href="#"
        onClick={_selectPage(index)}
        className={selected ? styles.nav_page_num_selected : styles.nav_page_num}>
        {index}
      </a>
    );
  }

  function _navPageText(text: string) {
    return (
      <div className={styles.nav_page_num}>{text}</div>
    );
  }

  function _navInfo() {
    return (
      <div className={styles.nav_page_nums}>
        <div className={styles.nav_page_num_selected}>
          {(page - 1) * props.page_size + 1}
        </div>
        <div className={styles.nav_page_num_selected}>
          {"-"}
        </div>
        <div className={styles.nav_page_num_selected}>
          {(page) * props.page_size <= props.items.length ? (page) * props.page_size : props.items.length}
        </div>
        <div className={styles.nav_page_num}>
          {"из"}
        </div>
        <div className={styles.nav_page_num}>
          {props.items.length}
        </div>
        <div className={styles.nav_page_num}>
          {((props.items.length % 10 == 1) && (Math.floor(props.items.length / 10) % 10 != 1)) ? "элемента" : "элементов"}
        </div>
      </div>
    );
  }

  function _navPageNums() {
    const page_indexes = [];

    page_indexes.push(_navPageNum(page - 2, false));
    page_indexes.push(_navPageNum(page - 1, false));
    page_indexes.push(_navPageNum(page, true));
    page_indexes.push(_navPageNum(page + 1, false));
    page_indexes.push(_navPageNum(page + 2, false));

    return (
      <div className={styles.nav_page_nums}>
        {page > 3 && _navPageNum(1, false)}
        {page > 4 && _navPageText(" . . . ")}
        {page_indexes}
        {pages_num - page > 3 && _navPageText(" . . . ")}
        {pages_num - page > 2 && _navPageNum(pages_num)}
      </div>
    );
  }

  function _createEntries(index: number) {
    if (index <= 0 || index > pages_num) return;

    const items: any[] = [];

    for (let i = (index - 1) * props.page_size; i <= Math.min(index * props.page_size - 1, props.items.length - 1); i++) {
      items.push(props.items[i].render_func());
    }

    return (
      <div className={styles.list}>
        {items}
      </div>
    );
  }

  return (
    <div className={styles.list_container}>
      <div className={styles.navigator}>
        <div className={styles.nav_buttons}>
          <a href="#" onClick={_decPage()} className={styles.nav_button}>
            <ArrowLeft className={styles.arrow}/>
          </a>
          <a href="#" onClick={_incPage()} className={styles.nav_button}>
            <ArrowRight className={styles.arrow}/>
          </a>
        </div>
        <div className={styles.nav_info}>
          {_navInfo()}
        </div>
        <div className={styles.nav_buttons}>
          <a href="#" onClick={_decPage()} className={styles.nav_button}>
            <ArrowLeft className={styles.arrow}/>
          </a>
          {_navPageNums()}
          <a href="#" onClick={_incPage()} className={styles.nav_button}>
            <ArrowRight className={styles.arrow}/>
          </a>
        </div>
      </div>
      {_createEntries(page)}
    </div>
  )
}

export default PagedList;
export { PageEntry }
