import styles from "./index.module.css";
import {useContext, useEffect, useState} from 'react'
import ApiContext from "@features/api-context";
import {getErrorResponse} from "@features/response";
import Button from "@widgets/main/Button";
import {appendClassName} from "@shared/util";
import {EventRequestFormatEnum} from "@shared/api/generated/model/event-request";
import {EventResponseStatusEnum} from "@shared/api/generated/model";
import {Activity} from "@pages/main/EventData";
import {ArrowDown, Book, Check, Cross, Edit} from "@shared/ui/icons";
import {getDataTimeLine} from "@shared/lib/dates";


type ActivityDTO = {
  id: number;
  placeId: number;
  startDate: string;
  endDate: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  format: EventRequestFormatEnum | undefined;
  status: EventResponseStatusEnum | undefined;
  registrationStart: string;
  registrationEnd: string;
  parent: number;
  participantLimit: number;
  participantAgeLowest: number;
  participantAgeHighest: number;
  preparingStart: string;
  preparingEnd: string;
}
const placeholderActivity = {
  id: -1,
  placeId: -1,
  startDate: '',
  endDate: '',
  title: '',
  shortDescription: '',
  fullDescription: '',
  format: undefined,
  status: undefined,
  registrationStart: '',
  registrationEnd: '',
  parent: -1,
  participantLimit: -1,
  participantAgeLowest: -1,
  participantAgeHighest: -1,
  preparingStart: '',
  preparingEnd: ''
}


type Props = {
  activityId: string | undefined;
  activities: Activity[];
  setActivities: any;
  closeActivityModal: any;
  canDelete: boolean
};

function ActivityModal(props: Props) {
  const {api} = useContext(ApiContext);
  const [activity, setActivity] = useState<ActivityDTO>(placeholderActivity);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);

  useEffect(() => {
    if (props.activityId) {
      api.event
        .getEventById(parseInt(props.activityId))
        .then(response => {
          const responseData = response.data;

          setActivity({
            id: (responseData.id) ? responseData.id : -1,
            placeId: (responseData.placeId) ? responseData.placeId : -1,
            startDate: (responseData.startDate) ? responseData.startDate : '',
            endDate: (responseData.endDate) ? responseData.endDate : '',
            title: (responseData.title) ? responseData.title : '',
            shortDescription: (responseData.shortDescription) ? responseData.shortDescription : '',
            fullDescription: (responseData.fullDescription) ? responseData.fullDescription : '',
            format: responseData.format,
            status: responseData.status,
            registrationStart: (responseData.registrationStart) ? responseData.registrationStart : '',
            registrationEnd: (responseData.registrationEnd) ? responseData.registrationEnd : '',
            parent: (responseData.parent) ? responseData.parent : -1,
            participantLimit: (responseData.participantLimit) ? responseData.participantLimit : -1,
            participantAgeLowest: (responseData.participantAgeLowest) ? responseData.participantAgeLowest : -1,
            participantAgeHighest: (responseData.participantAgeHighest) ? responseData.participantAgeHighest : -1,
            preparingStart: (responseData.preparingStart) ? (responseData.preparingStart) : '',
            preparingEnd: (responseData.preparingEnd) ? (responseData.preparingEnd) : ''
          });
        })
        .catch((event): any => {
          console.log("[ActivityModal][init] Что-то пошло не так!");
          console.log(getErrorResponse(event.response));
        });
    }
  }, [props.activityId]);

  const _deleteActivity = () => {
    if (!activity)
      return;

    api.event
      .deleteActivityById(activity.id)
      .then((_) => {
        props.setActivities(props.activities
          .filter((a) => {
            return a.activityId != activity.id.toString(); // activity.activityId == activityDTO.id <> activity.id
          }));
        props.closeActivityModal();
      })
      .catch((event): any => {
        console.log("[ActivityModal][deleteActivity] Что-то пошло не так!");
        console.log(getErrorResponse(event.response));
      });
  }

  return (
    <div>
      {/*Заголовок карточки активности: название и статус*/}
      <div className={appendClassName(styles.activity_card_header, styles.activity_card_row)}>
        <div>{activity.title}</div>
        <_ActivityModalStatus status={activity.status?.toUpperCase()}/>
      </div>
      {/*Тело карточки: поля с информацией*/}
      <div className={appendClassName(styles.activity_card_row, styles.activity_card_info)}>
        <div
          className={appendClassName(styles.activity_initial_row, styles.activity_card_description)}>{activity.fullDescription}
        </div>
        <div>
          <_ActivityModalField label={'Формат'} value={activity.format}/>
          <div className={styles.field_separator}/>
          <_ActivityModalField label={'Макс. кол-во участников'} value={activity.participantLimit.toString()}/>
          <div className={styles.field_separator}/>
          <_ActivityModalField label={'Время начала'} value={getDataTimeLine(activity.startDate)}/>
          <_ActivityModalField label={'Время завершения'} value={getDataTimeLine(activity.endDate)}/>
        </div>
        <div className={styles.drop_down_toggle} onClick={() => setAdditionalInfoVisible(!additionalInfoVisible)}>
          <div>Дополнительная информация</div>
          <ArrowDown
            className={appendClassName(styles.icon, additionalInfoVisible ? styles.arrow_up : styles.arrow_down)}/>
        </div>
        <div className={additionalInfoVisible ? styles.add_info_visible : styles.add_info_hidden}>
          <_ActivityModalField label={'Минимальный возраст участия'} value={activity.participantAgeLowest.toString()}/>
          <_ActivityModalField label={'Максимальный возраст участия'}
                               value={activity.participantAgeHighest.toString()}/>
          <div className={styles.field_separator}/>
          <_ActivityModalField label={'Время начала подготовки'} value={getDataTimeLine(activity.preparingStart)}/>
          <_ActivityModalField label={'Время завершения подготовки'} value={getDataTimeLine(activity.preparingEnd)}/>
          <div className={styles.field_separator}/>
          <_ActivityModalField label={'Время начала регистрации'} value={getDataTimeLine(activity.registrationStart)}/>
          <_ActivityModalField label={'Время завершения регистрации'}
                               value={getDataTimeLine(activity.registrationEnd)}/>
        </div>
      </div>
      {/*Панель управления карточки активности: кнопка удаления*/}
      {props.canDelete && <div className={appendClassName(styles.activity_card_row, styles.activity_card_footer)}>
        <Button onClick={_deleteActivity}>Удалить активность</Button>
      </div>}

    </div>
  );
}

type _ActivityModalStatusProps = {
  status: string | undefined;
};

function _ActivityModalStatus(props: _ActivityModalStatusProps) {
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

type _ActivityModalFieldProps = {
  label: string | undefined;
  value: string | undefined;
};

function _ActivityModalField(props: _ActivityModalFieldProps) {
  if (props.label && props.value) {
    return (
      <div className={appendClassName(styles.activity_secondary_row, styles.activity_card_field)}>
        <label>{props.label}:</label>
        <div className={styles.value}>{props.value}</div>
      </div>
    );
  }
}

export default ActivityModal;
