import { uid } from 'uid';
import styles from './index.module.css';
import { forwardRef } from 'react';
import { appendClassName } from '@shared/util';

class ContextMenuItem {
  private _text: string;
  private _func: (e: React.MouseEvent) => void;
  constructor(text: string, func: (e: React.MouseEvent) => void) {
    this._text = text;
    this._func = func;
  }
  get text() {
    return this._text;
  }
  get func() {
    return this._func;
  }
}

type Props = {
  className?: string;
  items: ContextMenuItem[];
  style?: React.CSSProperties;
};

function _createItem(item: ContextMenuItem) {
  return (
    <div key={uid()} className={styles.item} onClick={item.func}>
      {item.text}
    </div>
  );
}

function _createItemList(items: ContextMenuItem[]) {
  const res = [];
  for (const item of items) {
    res.push(_createItem(item));
  }
  return res;
}

const ContextMenu = forwardRef((props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  const items = _createItemList(props.items);
  return items.length > 0 ? (
    <div className={appendClassName(styles.menu, props.className)} style={props.style} ref={ref as any}>
      {items}
    </div>
  ) : (
    <></>
  );
});

export { ContextMenuItem };
export default ContextMenu;
