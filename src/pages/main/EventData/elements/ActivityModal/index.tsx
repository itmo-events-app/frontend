import styles from "./index.module.css";
import {useContext, useEffect, useState} from 'react'
import ApiContext from "@features/api-context";
import {getErrorResponse} from "@features/response";
import {uid} from "uid";
import Button from "@widgets/main/Button";
import {appendClassName} from "@shared/util";


class Activity {
  id: string
  activityId: string
  name: string
  // place: string
  // room: string
  description: string
  date: string
  // time: string
  endDate: string

  // endTime: string

  constructor(
    activityId: string,
    activityName: string,
    // place: string,
    // room: string,
    description: string,
    date: string,
    // time: string,
    endDate: string,
    // endTime: string
  ) {
    this.id = uid();
    this.activityId = activityId;
    this.name = activityName;
    // this.place = place;
    // this.room = room;
    this.description = description;
    this.date = date;
    // this.time = time;
    this.endDate = endDate;
    // this.endTime = endTime;
  }
}

function readDate(dateTime: string | null | undefined) {
  if (dateTime == undefined || dateTime == "" || dateTime == null) {
    return "";
  }
  const date = new Date(dateTime);
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate.replace('-', '.');
}

function addZero(time: string) {
  const intTile = parseInt(time);
  if (intTile) {
    return time;
  }
  if (intTile >= 0 && intTile <= 9) {
    return '0' + time;
  }
  return time;
}

function getTimeOnly(dateTimeString: string) {
  const dateTime = new Date(dateTimeString);
  const hours = addZero(dateTime.getHours().toString());
  const minutes = addZero(dateTime.getMinutes().toString());
  const seconds = addZero(dateTime.getSeconds().toString());
  const timeOnly = `${hours}:${minutes}:${seconds}`;
  return timeOnly;
}

function getDataTimeLine(dateTimeString: string) {
  return readDate(dateTimeString) + " " + getTimeOnly(dateTimeString);
}


type Props = {
  activityId: string;
  activities: Activity[];
  setActivities: any;
  setModalActive: any;
  canDelete: boolean
};

function ActivityModal(props: Props) {
  const {api} = useContext(ApiContext);
  const [activity, setActivity] = useState(new Activity('', '', '', '', ''));


  useEffect(() => {
    if (!props.activityId) {
      // Ничего не ищем
    } else {
      // Ищем активность(ивент) #activityId
      const activityId = props.activityId;
      api.event
        .getEventById(parseInt(activityId))
        .then((event) => {
          const activity = new Activity(
            (event.data.id) ? event.data.id.toString() : '',
            (event.data.title) ? event.data.title : '',
            (event.data.shortDescription) ? event.data.shortDescription : '',
            (event.data.startDate) ? event.data.startDate : '',
            (event.data.endDate) ? event.data.endDate : ''
          );
          setActivity(activity);
        })
        .catch((event): any => {
          console.log("Что-то пошло не так!");
          console.log(getErrorResponse(event.response));
        });
    }
  }, [props.activityId]);

  const _deleteActivity = () => {
    if (!activity || !activity.activityId) {
      return;
    }
    const activityID = parseInt(activity.activityId);
    if (isNaN(activityID)) {
      return;
    }

    api.event
      .deleteActivityById(activityID)
      .then((_) => {
        // Удаление активности через пропс
        props.setActivities(props.activities
          .filter((activity) => {
            return activity.activityId != activityID.toString();
          }));
        // Закрытие модалки
        props.setModalActive(false);
      })
      .catch((event): any => {
        console.log("Что-то пошло не так!");
        console.log(getErrorResponse(event.response));
      });
  }

  return (
    <div>
      <div className={appendClassName(styles.activity_card_header, styles.activity_card_row)}>
        <div>{activity.name}</div>
      </div>

      <div className={appendClassName(styles.activity_card_row, styles.activity_card_info)}>
        <div
          className={appendClassName(styles.activity_initial_row, styles.activity_card_description)}>{activity.description}</div>
        <div>
          <div className={appendClassName(styles.activity_secondary_row, styles.activity_card_field)}>
            <label>Время начала:</label>
            <div className={styles.value}>{getDataTimeLine(activity.date)}</div>
          </div>
          <div className={appendClassName(styles.activity_secondary_row, styles.activity_card_field)}>
            <label>Время завершения:</label>
            <div className={styles.value}>{getDataTimeLine(activity.endDate)}</div>
          </div>
        </div>
      </div>

      {props.canDelete && <div className={appendClassName(styles.activity_card_row, styles.activity_card_footer)}>
        <Button onClick={_deleteActivity}>Удалить активность</Button>
      </div>}
    </div>
  );
}

export default ActivityModal;
