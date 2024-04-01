import styles from './index.module.css';

class EventInfo {
  regDates: string
  eventDates: string
  vacantSlots: string
  place: string
  status: string

  constructor(
    regDates: string,
    eventDates: string,
    vacantSlots: string,
    place: string,
    status: string
  ) {
    this.regDates = regDates;
    this.eventDates = eventDates;
    this.vacantSlots = vacantSlots;
    this.place = place;
    this.status = status;
  }
}

type Props = {
  className?: string,
  image?: string,
  eventInfo: EventInfo
}

function EventHeader(props: Props) {
  return (
    <div className={styles.info_container}>
      <div className={styles.image}>
        <img width="400" src={props.image} alt="Event header image"/>
      </div>
      <div className={styles.info_column}>
        <div className={styles.info_entry}>
          <div>Сроки регистрации:</div>
          <div>{props.eventInfo.regDates}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Сроки проведения:</div>
          <div>{props.eventInfo.eventDates}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Количество мест:</div>
          <div>{props.eventInfo.vacantSlots}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Место проведения:</div>
          <div>{props.eventInfo.place}</div>
        </div>
        <div className={styles.info_entry}>
          <div>Статус:</div>
          <div>{props.eventInfo.status}</div>
        </div>
      </div>
    </div>
  )
}

export default EventHeader
export { EventInfo }
