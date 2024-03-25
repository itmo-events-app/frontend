import { uid } from 'uid'
import styles from './index.module.css'
import { useState } from 'react'
import { ArrowDown } from '@shared/ui/icons'

class SideBarTab {
  id: string
  text: string
  icon?: any
  private _children: SideBarTab[]
  private _selected: boolean
  private _expanded: boolean

  constructor(
    text: string,
    icon?: any,
    children: SideBarTab[] = [],
    selected: boolean = false,
    expanded: boolean = false,
  ) {
    this.id = uid();
    this.text = text;
    this.icon = icon;
    this._children = children;
    this._selected = selected;
    this._expanded = expanded;
  }

  public get children() { return this._children; }
  public get selected() { return this._selected; }
  public get expanded() { return this._expanded; }
  public set selected(value: boolean) { this._selected = value; }
  public set expanded(value: boolean) { this._expanded = value; }
}

type Props = {
  tabs: SideBarTab[],
}

function SideBar(props: Props) {
  const [tabs, setTabs] = useState(props.tabs);

  function _expandTab(tab: SideBarTab) {
    return () => {
      tab.expanded = !tab.expanded;
      setTabs([...tabs]); // NOTE: force object recreation
    }
  }

  function _createTab(tab: SideBarTab) {
    const entryIcon = tab.icon ? <div className={styles.icon_cnt}>{tab.icon}</div> : <></>;
    const entryText = <div className={styles.text_cnt}>{tab.text}</div>;
    const entryArrow = tab.children.length > 0
      ? (<ArrowDown className={styles.arrow + ' ' + (tab.expanded ? styles.arrow_down : styles.arrow_up)} />)
      : <></>;

    return (
      <div key={tab.id} className={styles.tab}>
        <div
          className={styles.tab_entry + ' ' + (tab.selected ? styles.selected : '')}
          onClick={_expandTab(tab)}>
          {entryIcon}
          {entryText}
          {entryArrow}
        </div>
        {(tab.expanded && tab.children.length > 0) ?
          <div className={styles.tab_children}>
            {_createTabList(tab.children)}
          </div>
          : <></>
        }
      </div>
    );
  }

  function _createTabList(tabs: SideBarTab[]) {
    const elements = []
    for (const tab of tabs) {
      elements.push(_createTab(tab));
    }
    return elements;
  }

  return (
    <div className={styles.sidebar}>
      {_createTabList(tabs)}
    </div>
  )
}

export default SideBar;
export { SideBarTab }
