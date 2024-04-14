import styles from './index.module.css';
import { ArrowDown } from '@shared/ui/icons';
import { appendClassName } from '@shared/util';

class SideBarTab {
  text: string;
  url: string;
  icon?: any;
  _children: SideBarTab[];
  _selected: boolean;
  _expanded: boolean;

  constructor(
    text: string,
    url: string,
    icon?: any,
    children: SideBarTab[] = [],
    selected: boolean = false,
    expanded: boolean = false
  ) {
    this.text = text;
    this.icon = icon;
    this.url = url;
    this._children = children;
    this._selected = selected;
    this._expanded = expanded;
  }

  public get children() {
    return this._children;
  }
  public get selected() {
    return this._selected;
  }
  public get expanded() {
    return this._expanded;
  }
  public set selected(value: boolean) {
    this._selected = value;
  }
  public set expanded(value: boolean) {
    this._expanded = value;
  }

  public isExpandable() {
    return this.expanded && this.children.length > 0;
  }
}

type Props = {
  tabs: SideBarTab[];
  onClick: (tab: SideBarTab) => void;
};

function SideBar(props: Props) {
  function _tabOnClick(tab: SideBarTab) {
    return () => {
      props.onClick(tab);
    };
  }

  function _createTab(tab: SideBarTab) {
    const entryIcon = tab.icon ? <div className={styles.icon_cnt}>{tab.icon}</div> : <></>;
    const entryText = <div className={styles.text_cnt}>{tab.text}</div>;
    const entryArrow =
      tab.children.length > 0 ? (
        <ArrowDown className={appendClassName(styles.arrow, tab.expanded ? styles.arrow_down : styles.arrow_up)} />
      ) : (
        <></>
      );

    return (
      <div key={tab.url} className={styles.tab}>
        <div
          className={appendClassName(styles.tab_entry, tab.selected ? styles.selected : null)}
          onClick={_tabOnClick(tab)}
        >
          {entryIcon}
          {entryText}
          {entryArrow}
        </div>
        {tab.isExpandable() ? <div className={styles.tab_children}>{_createTabList(tab.children)}</div> : <></>}
      </div>
    );
  }

  function _createTabList(tabs: SideBarTab[]) {
    const elements = [];
    for (const tab of tabs) {
      elements.push(_createTab(tab));
    }
    return elements;
  }

  return <div className={styles.sidebar}>{_createTabList(props.tabs)}</div>;
}

export default SideBar;
export { SideBarTab };
