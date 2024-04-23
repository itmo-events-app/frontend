import styles from './index.module.css';
import {Activity} from "@pages/main/EventData";
import {appendClassName} from '@shared/util';
import {Book, Calendar, Check, Cross, Edit, Location} from "@shared/ui/icons";


const getDateLine = (startDay: string, endDay: string) => {
  const fStartDay = startDay.replace('-', '.');
  const fEndDay = endDay.replace('-', '.');

  if (fEndDay == '' || fStartDay == fEndDay) {
    return fStartDay;
  } else {
    return fStartDay + ' - ' + fEndDay;
  }
}


type Props = {
  activity: Activity;
  onClickFun: any;
};


function ActivityElement(props: Props) {
  const activity = props.activity;

  return (
    <div key={activity.id} className={styles.activity_container} onClick={props.onClickFun}>
      <div className={appendClassName(styles.activity_row, styles.activity_initial_row)}>
        <div className={styles.activity_name}>{activity.name}</div>
        <_ActivityElementStatus status={activity.status.toUpperCase()}/>
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
            <div
              className={appendClassName(styles.activity_word, styles.activity_time)}> {getDateLine(activity.date, activity.endDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


type _ActivityElementStatusProps = {
  status: string | undefined;
};

function _ActivityElementStatus(props: _ActivityElementStatusProps) {
  if (!props.status)
    return (<></>);

  switch (props.status) {
    case 'DRAFT':
      return (
        <div title='DRAFT' className={appendClassName(styles.status, styles.status_DRAFT)}>
          <Edit className={styles.icon}/>
        </div>
      );
    case 'PUBLISHED':
      return (
        <div title='PUBLISHED' className={appendClassName(styles.status, styles.status_PUBLISHED)}>
          <Book className={styles.icon}/>
        </div>
      );
    case 'COMPLETED':
      return (
        <div title='COMPLETED' className={appendClassName(styles.status, styles.status_COMPLETED)}>
          <Check className={styles.icon}/>
        </div>
      );
    case 'CANCELED':
      return (
        <div title='CANCELED' className={appendClassName(styles.status, styles.status_CANCELED)}>
          <Cross className={styles.icon}/>
        </div>
      );
    default:
      return (<></>);
  }
}


export default ActivityElement;
