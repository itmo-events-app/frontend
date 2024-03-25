import styles from './index.module.css'

type Props = {
  topLeft?: any,
  topRight?: any,
  bottomLeft?: any,
  bottomRight?: any
}

function Layout(props: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.grid_one}>
        {props.topLeft}
      </div>
      <div className={styles.grid_two}>
        {props.topRight}
      </div>
      <div className={styles.grid_three}>
        {props.bottomLeft}
      </div>
      <div className={styles.grid_four}>
        {props.bottomRight}
      </div>
    </div>
  )
}

export default Layout;
