import styles from "./index.module.css";
import Dialog from "@widgets/main/Dialog";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {EventResponse, PlaceResponse, TaskRequestTaskStatusEnum, UserResponse} from "@shared/api/generated";
import ApiContext from "@features/api-context";
import InputLabel from "@widgets/main/InputLabel";
import {taskService} from "@features/task-service";

const UpdateTaskDialog = ({onClose, taskId, idInt}: { onClose: () => void, taskId: number, idInt: number | null }) => {
  const {api} = useContext(ApiContext);
  const [title, setTitle] = useState('');

  const currentDate: Date = new Date();
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);
  const [status, setStatus] = useState('Новая');

  const [usersList, setUsersList] = useState([] as UserResponse[]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userId, setUserId] = useState(0);

  const [place, setPlace] = useState(1);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);


  const [activity, setActivity] = useState(0);
  const [activityLoaded, setActivityLoaded] = useState(false);
  const [activityList, setActivityList] = useState([] as EventResponse[]);

  const [showEmptyTitleMessage, setShowEmptyTitleMessage] = useState(false);
  const [showEmptyDescriptionMessage, setShowEmptyDescriptionMessage] = useState(false);
  const [showDeadlineMessage, setShowDeadlineMessage] = useState(false);
  const [showReminderMessage, setShowReminderMessage] = useState(false);
  const [showReminderAfterDeadlineMessage, setShowReminderAfterDeadlineMessage] = useState(false);

  const formatEnum: Record<string, TaskRequestTaskStatusEnum> = {
    "Новая": TaskRequestTaskStatusEnum.New,
    "В процессе": TaskRequestTaskStatusEnum.InProgress,
    "Истекшая": TaskRequestTaskStatusEnum.Expired,
    "Выполненная": TaskRequestTaskStatusEnum.Done
  };

  const formatTranslate: Record<string, string> = {
    "NEW": "Новая",
    "IN_PROGRESS": "В процессе",
    "EXPIRED": "Истекшая",
    "DONE": "Выполненная",
  };

  const getTasks = async () => {
    let tasksResponse;
    if (taskId !== null) {
      tasksResponse = await api.task.taskGet(taskId).then(response => response.data);
      setTitle(tasksResponse.title!);
      setDescription(tasksResponse.description!);
      const deadlineObject = convertToDate(tasksResponse.deadline!)
      setDeadline(deadlineObject)
      const reminderObject = convertToDate(tasksResponse.reminder!)
      setReminder(reminderObject)
      setPlace(tasksResponse.place!.id!)
      setStatus(formatTranslate[tasksResponse.taskStatus!])
    }
  };

  useEffect(() => {
    getTasks();
  }, []);


  const getActivities = async () => {
    let activitiesResponse;
    if (idInt !== null) {
      activitiesResponse = await api.event.getAllOrFilteredEvents(undefined, undefined, idInt)
      if (activitiesResponse.status == 200) {
        const activitiesData = activitiesResponse.data.items;
        setActivityList(activitiesData as EventResponse[]);
        setActivityLoaded(true);
      } else {
        console.log(activitiesResponse.status);
      }
    }
  }

  useEffect(() => {
    getActivities();
  }, []);


  function convertToDate(dateString: string | null) {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }


  const getPlaces = async () => {
    const placesResponse = await api.place.getAllOrFilteredPlaces();
    if (placesResponse.status == 200) {
      const placesData = placesResponse.data;
      setPlaceList(placesData);
      setPlacesLoaded(true);
    } else {
      console.log(placesResponse.status);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);

  const getUsers = async () => {
    let usersResponse;
    if (idInt !== null) {
      usersResponse = await api.event.getUsersHavingRoles(idInt);
      if (usersResponse.status == 200) {
        const usersData = usersResponse.data;
        const uniqueUsers = usersData.filter((user, index, self) =>
            index === self.findIndex((t) => (
              t.id === user.id
            ))
        );
        const updatedUsersList = [...uniqueUsers];
        updatedUsersList.push({
          id: 0,
          name: "Назначить",
          surname: "позже"
        });
        setUsersList(updatedUsersList);
        setUsersLoaded(true);
      }
    }
  }
  useEffect(() => {
    getUsers();
  }, []);

  function convertToLocaleDateTime(date: Date | null) {
    if (date) {
      const isoDate = date.toISOString();
      const isoDateTime = date.toTimeString();
      return `${isoDate.substring(0, 10)}T${isoDateTime.substring(0, 8)}.000Z`;
    }
    return null;
  }

  function updateActivity(activity: number) {
    if (activity === 0) {
      if (idInt !== null) {
        setActivity(idInt)
        return idInt;
      }
    } else return activity;
  }

  function updateUserId(userId: number) {
    if (userId === 0) {
      return undefined;
    } else return userId;
  }

  function checkEmptyTitleMessage() {
    if (!title) {
      setShowEmptyTitleMessage(true);
      return true;
    } else return false;
  }

  function checkEmptyDescriptionMessage() {
    if (!description) {
      setShowEmptyDescriptionMessage(true);
      return true;
    } else return false;
  }

  function checkEmptyDeadlineMessage() {
    if (deadline !== null) {
      if (deadline < currentDate) {
        setShowDeadlineMessage(true);
        return true;
      } else return false;
    }
  }

  function checkEmptyReminderMessage() {
    if (reminder !== null) {
      if (reminder < currentDate) {
        setShowReminderMessage(true);
        return true;
      } else return false;
    }
  }

  function checkEmptyReminderAfterDeadlineMessage() {
    if (reminder !== null && deadline !== null) {
      if (reminder < currentDate) {
        return false
      } else if (reminder >= deadline) {
        setShowReminderAfterDeadlineMessage(true);
        return true;
      } else return false;
    }
  }

  const editTask = () => {

    setShowEmptyTitleMessage(false);
    setShowEmptyDescriptionMessage(false);
    setShowDeadlineMessage(false);
    setShowReminderMessage(false);
    setShowReminderAfterDeadlineMessage(false);

    const emptyTitleMessage = checkEmptyTitleMessage();
    const emptyDescriptionMessage = checkEmptyDescriptionMessage();
    const emptyDeadlineMessage = checkEmptyDeadlineMessage();
    const emptyReminderMessage = checkEmptyReminderMessage();
    const emptyReminderAfterDeadlineMessage = checkEmptyReminderAfterDeadlineMessage();

    if (emptyTitleMessage || emptyDescriptionMessage || emptyDeadlineMessage ||
      emptyReminderMessage || emptyReminderAfterDeadlineMessage) {
      return
    }
    const newUserId = updateUserId(userId);

    let newActivity
    if (taskId !== null) {
      newActivity = updateActivity(activity);
    }
    console.log(`ststus ${status}`)
    const taskStatus = formatEnum[status];
    const deadlineString = convertToLocaleDateTime(deadline);
    const reminderString = convertToLocaleDateTime(reminder);
    if (newActivity !== undefined) {
      taskService.updateTask(
        api,
        taskId!,
        newActivity,
        newUserId,
        title,
        description,
        taskStatus,
        place,
        deadlineString!,
        reminderString!
      ).then(() => onClose());
    }
  }

  return (
    <div className={styles.dialog_task} onMouseDown={onClose}>
      <Dialog className={styles.dialog_content_task} text={'Изменение задачи'}>
        <div onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <Label value="Название"/>
              <Input
                type="text"
                value={String(title)}
                onChange={(e) => setTitle(e.target.value)}
              />
              {showEmptyTitleMessage && (
                <span className={styles.emptyFieldsMessage}>Поле не может быть пустым</span>
              )}
            </div>
            <div className={styles.place_form_item}>
              <Label value="Описание"/>
              <Input
                type="text"
                value={String(description)}
                onChange={(e) => setDescription(e.target.value)}
              />
              {showEmptyDescriptionMessage && (
                <span className={styles.emptyFieldsMessage}>Поле не может быть пустым</span>
              )}
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Место"/>
              <select value={place} onChange={(e) => setPlace(parseInt(e.target.value))}>
                {placesLoaded ? (
                  placeList.map((p) => {
                    return <option key={p.id} value={p.id}>{p.name}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Статус"/>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.keys(formatEnum).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Активность"/>
              <select value={activity} onChange={(e) => setActivity(parseInt(e.target.value))}>
                <option value={''}>Это мероприятие</option>
                {activityLoaded ? (
                  activityList.map((p) => {
                    return <option key={p.id} value={p.id}>{p.title}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Ответственный"/>
              <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
                {
                  usersLoaded ? (
                    usersList.map((p) => {
                      return <option key={p.id} value={p.id}>{p.name} {p.surname}</option>;
                    })
                  ) : (
                    <option value=""></option>
                  )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <Label value="Дедлайн"/>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
              />
              {showDeadlineMessage && (
                <span className={styles.emptyFieldsMessage}>Крайний срок не может быть в прошлом</span>
              )}
            </div>
            <div className={styles.place_form_item}>
              <Label value="Напоминание"/>
              <DatePicker
                selected={reminder}
                onChange={(date) => setReminder(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
              />
              {showReminderMessage && (
                <span className={styles.emptyFieldsMessage}>Напоминание не может быть в прошлом</span>
              )}
              {showReminderAfterDeadlineMessage && (
                <span className={styles.emptyFieldsMessage}>Напоминание не может быть позже крайнего срока</span>
              )}
            </div>
            <div className={styles.button_container}>
              <div className={styles.place_form_button}>
                <Button onClick={editTask}>Изменить</Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default UpdateTaskDialog;
