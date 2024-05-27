import { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';

type Props = {
  topLeft?: any;
  topRight?: any;
  bottomLeft?: any;
  bottomRight?: any;
  children?: any; // fixed positioned children
};

function Layout(props: Props) {
  const topLeftRef = useRef(null);
  const topRightRef = useRef(null);
  const columnLeftRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // update TopLeft height when TopRight height is changed
  useEffect(() => {
    const topLeftNode = topLeftRef.current as any;
    const topRightNode = topRightRef.current as any;

    const adjustTopLeftHeight = () => {
      const topRightHeight = topRightNode.offsetHeight;
      topLeftNode.style.height = `${topRightHeight}px`;
    };

    adjustTopLeftHeight();

    const observer = new ResizeObserver(() => {
      adjustTopLeftHeight();
    });

    observer.observe(topRightNode);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.columns}>
        <div className={styles.column_left} ref={columnLeftRef}>
          <div className={styles.top_left} ref={topLeftRef}>
            {props.topLeft}

          </div>
          <div className={styles.bottom_left}>{props.bottomLeft}</div>
        </div>
        <div className={styles.column_right}>
          <div className={styles.top_right} ref={topRightRef}>
            {props.topRight}
            <div className={styles.top_burger} onClick={(e) => {
              e.preventDefault();
              if (columnLeftRef.current) {
                if (mobileOpen) {
                  (columnLeftRef.current as any).style.left! = "-100vw";
                  setMobileOpen(false);
                } else {
                  (columnLeftRef.current as any).style.left! = "0";
                  setMobileOpen(true);
                }
              }
            }}>
              <span></span>
            </div>
          </div>
          <div className={styles.bottom_right}>{props.bottomRight}</div>
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default Layout;
