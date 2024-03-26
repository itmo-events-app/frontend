import { uid } from 'uid';
import styles from './index.module.css';
import { forwardRef, } from 'react';

class ContextMenuItem {
  private _text: string;
  private _func: () => void;
  constructor(text: string, func: () => void) {
    this._text = text;
    this._func = func;
  }
  get text() { return this._text; }
  get func() { return this._func; }
}

type Props = {
  className?: string,
  items: ContextMenuItem[],
  style?: React.CSSProperties
}

function _createItem(item: ContextMenuItem) {
  return (
    <div key={uid()} className={styles.item} onClick={item.func}>
      {item.text}
    </div>
  )
}

function _createItemList(items: ContextMenuItem[]) {
  const res = []
  for (const item of items) {
    res.push(_createItem(item));
  }
  return res;
}

const ContextMenu = forwardRef((props: Props, ref) => {
  return (
    <div className={styles.menu} style={props.style} ref={ref as any}>
      {_createItemList(props.items)}
    </div>
  )
})

export { ContextMenuItem }
export default ContextMenu
