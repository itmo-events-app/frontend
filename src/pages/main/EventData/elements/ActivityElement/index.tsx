import styles from './index.module.css';
import {uid} from "uid";
import {appendClassName} from '@shared/util';
import {Calendar, Location} from "@shared/ui/icons";


class Activity {
  id: string
  activityId: string
  name: string
  place: string
  room: string
  description: string
  date: string
  time: string
  endDate: string
  endTime: string

  constructor(
    activityId: string,
    activityName: string,
    place: string,
    room: string,
    description: string,
    date: string,
    time: string,
    endDate: string,
    endTime: string
  ) {
    this.id = uid();
    this.activityId = activityId;
    this.name = activityName;
    this.place = place;
    this.room = room;
    this.description = description;
    this.date = date;
    this.time = time;
    this.endDate = endDate;
    this.endTime = endTime;
  }
}

type Props = {
  activity: Activity;
  onClickFun: any;
};


const getDateLine = (startDay : string, endDay : string) => {
  const fStartDay = startDay.replace('-', '.');
  const fEndDay = endDay.replace('-', '.');

  if (fEndDay == '' || fStartDay == fEndDay) {
    return fStartDay;
  } else {
    return fStartDay + ' - ' + fEndDay;
  }
}


function ActivityElement(props: Props) {
  const activity = props.activity;

  return (
    <div key={activity.id} className={styles.activity_container} onClick={props.onClickFun}>

      <div className={appendClassName(styles.activity_row, styles.activity_initial_row)}>
        <div className={styles.activity_name}>{activity.name}</div>
      </div>
      <div className={appendClassName(styles.activity_row, styles.activity_initial_row)}>
        <div className={styles.activity_description}>{activity.description}</div>
      </div>
      <div className={appendClassName(styles.activity_row, styles.activity_secondary_row)}>
        <div className={styles.activity_line}>
          <Location className={styles.icon}/>
          <div className={appendClassName(styles.activity_word, styles.activity_place)}>{activity.place}</div>
          <div className={appendClassName(styles.activity_word, styles.activity_place)}>{activity.room}</div>
        </div>
      </div>
      <div className={appendClassName(styles.activity_row, styles.activity_secondary_row)}>
        <div>
          <div className={styles.activity_line}>
            <Calendar className={styles.icon}/>
            <div className={appendClassName(styles.activity_word, styles.activity_time)}> {getDateLine(activity.date, activity.endDate)}</div>
          </div>
        </div>
      </div>

    </div>
  );
}


export default ActivityElement;
