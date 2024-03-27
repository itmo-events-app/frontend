import styles from './index.module.css';

type Props = {
  className?: string,
  eventInfo: string,
  regDates: string,
  dates: string,
  vacantSlots: string,
  place: String,
  eventStatus: String
}

function EventHeader(props: Props) {
  return (
      <div className={styles.info_header}>
        <div className={styles.info_entry}>
          <div>{props.eventInfo}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Сроки регистрации:</div>
          <div>{props.regDates}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Сроки проведения:</div>
          <div>{props.dates}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Количество свободных мест:</div>
          <div>{props.vacantSlots}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Место проведения:</div>
          <div>{props.place}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Статус:</div>
          <div>{props.eventStatus}</div>
        </div>
      </div>
  )
}

export default EventHeader
