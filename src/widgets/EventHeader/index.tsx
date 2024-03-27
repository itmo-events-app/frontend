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
      <div>
        <div className={styles.info_entry}>
          <p>{props.eventInfo}</p>
        </div>
        <div className={styles.info_entry}>
          <p>Сроки регистрации:</p>
          <p>{props.regDates}</p>
        </div>
        <div className={styles.info_entry}>
          <p>Сроки проведения:</p>
          <p>{props.dates}</p>
        </div>
        <div className={styles.info_entry}>
          <p>Количество свободных мест:</p>
          <p>{props.vacantSlots}</p>
        </div>
        <div className={styles.info_entry}>
          <p>Место проведения:</p>
          <p>{props.place}</p>
        </div>
        <div className={styles.info_entry}>
          <p>Статус:</p>
          <p>{props.eventStatus}</p>
        </div>
      </div>
  )
}

export default EventHeader
