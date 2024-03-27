import { uid } from 'uid'
import styles from './index.module.css'
import { useState } from 'react'

class PageTab {
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
  className?: string,
  items: PageTab[]
}

function PageTabs(props: Props) {

  const [selected, setSelected] = useState("");

  function _select(tab: PageTab) {
    return () => {
      setSelected(tab.text);
    }
  }

  function _createUnselectedTab(tab: PageTab) {
    return (
        <div className={styles.page_tab_container + ' ' + (props.className ?? '')} onClick={_select(tab)}>
          <a href="#" className={styles.page_tab} onClick={_select(tab)}>{tab.text}</a>
        </div>
    );
  }

  function _createSelectedTab(tab: PageTab) {
    return (
        <div className={styles.page_tab_container + ' ' + styles.page_tab_container_selected + ' ' + (props.className ?? '')} onClick={_select(tab)}>
          <a href="#" className={styles.page_tab_selected} onClick={_select(tab)}>{tab.text}</a>
        </div>
    );
  }

  function _createTab(tab: PageTab) {
    if (tab.text == selected) {
      return _createSelectedTab(tab);
    } else {
      return _createUnselectedTab(tab);
    }
  }

  function _createTabList(tabs: PageTab[]) {
    const items = []
    for (const tab of tabs) {
      items.push(_createTab(tab));
    }
    return items;
  }

  return (
      <div className={styles.page_tabs}>
        {_createTabList(props.items)}
      </div>
  )
}

export default PageTabs;
export {PageTab}