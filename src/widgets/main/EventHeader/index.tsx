import styles from './index.module.css';

class EventInfo {
  regDates: string
  prepDates: string
  eventDates: string
  vacantSlots: string
  place: string
  format: string
  ageRestriction?: string
  status: string

  constructor(
    regDates: string,
    prepDates: string,
    eventDates: string,
    vacantSlots: string,
    place: string,
    format: string,
    status: string,
    ageRestriction: string
  ) {
    this.regDates = regDates;
    this.prepDates = prepDates;
    this.eventDates = eventDates;
    this.vacantSlots = vacantSlots;
    this.place = place;
    this.format = format;
    this.ageRestriction = ageRestriction;
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
        <img width="400" src={props.image} alt="Event header image" />
      </div>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>Сроки регистрации</td>
            <td>{props.eventInfo.regDates}</td>
          </tr>
          <tr>
            <td>Сроки подготовки</td>
            <td>{props.eventInfo.prepDates}</td>
          </tr>
          <tr>
            <td>Сроки проведения</td>
            <td>{props.eventInfo.eventDates}</td>
          </tr>
          <tr>
            <td>Количество мест</td>
            <td>{props.eventInfo.vacantSlots}</td>
          </tr>
          <tr>
            <td>Место проведения</td>
            <td className={styles.hover}>{props.eventInfo.place}</td>
          </tr>
          <tr>
            <td>Формат</td>
            <td>{props.eventInfo.format}</td>
          </tr>
          <tr>
            <td>Возрастное ограничение</td>
            <td>{props.eventInfo.ageRestriction ?? "Нет"}</td>
          </tr>
          <tr>
            <td>Статус</td>
            <td>{props.eventInfo.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default EventHeader
export { EventInfo }
