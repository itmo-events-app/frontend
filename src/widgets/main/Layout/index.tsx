import { useEffect, useRef } from 'react';
import styles from './index.module.css'

type Props = {
  topLeft?: any,
  topRight?: any,
  bottomLeft?: any,
  bottomRight?: any,
  children?: any, // fixed positioned children
}

function Layout(props: Props) {
  const topLeftRef = useRef(null);
  const topRightRef = useRef(null);

  // get maximum height of left and right components, apply maximum
  useEffect(() => {
    let height = 0;
    if (topLeftRef.current) {
      height = (topLeftRef.current as any).offsetHeight;
    }
    if (topRightRef.current) {
      let h2 = (topRightRef.current as any).offsetHeight;
      height = h2 > height ? h2 : height;
    }
    (topLeftRef.current as any).style.height = `${height}px`;
    (topRightRef.current as any).style.height = `${height}px`;
  })

  return (
    <div className={styles.root}>
      <div className={styles.columns}>
        <div className={styles.column_left}>
          <div className={styles.top_left} ref={topLeftRef}>
            {props.topLeft}
          </div>
          <div className={styles.bottom_left}>
            {props.bottomLeft}
          </div>
        </div>
        <div className={styles.column_right}>
          <div className={styles.top_right} ref={topRightRef}>
            {props.topRight}
          </div>
          <div className={styles.bottom_right}>
            {props.bottomRight}
          </div>
        </div>
      </div>
      {props.children}
    </div>
  )
}

export default Layout;
