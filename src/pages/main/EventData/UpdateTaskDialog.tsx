import styles from "./index.module.css";
import Dialog from "@widgets/main/Dialog";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {
  PlaceRequestFormatEnum,
  PlaceResponse,
  TaskRequest,
  TaskRequestTaskStatusEnum,
  TaskResponse
} from "@shared/api/generated";
import ApiContext from "@features/api-context";
import InputLabel from "@widgets/main/InputLabel";
import {taskService} from "@features/task-service";
import {Api} from "@entities/api";

const UpdateTaskDialog = ({onClose, idInt}: { onClose: () => void, idInt: number | null }) => {
  const { api } = useContext(ApiContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);
  const [status, setStatus] = useState('')

  const [usersList, setUsersList] = useState([] as usersResponce[]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userId, setUserId] = useState(1);

  const [place, setPlace] = useState(1);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);

  const [taskId, setTaskId] = useState(1);
  const [tasksList, setTasksList] = useState([] as TaskResponse[]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  // const taskStatus: { taskStatus: "NEW" } = {taskStatus: TaskRequestTaskStatusEnum.New}

  const getTasks = async () =>{
    const tasksResponse = await api.task.taskListShowInEvent(idInt | null);
    if (tasksResponse.status == 200) {
      const tasksData = tasksResponse.data;
      setTasksList(tasksData);
      setTasksLoaded(true);
    } else {
      console.log(tasksResponse.status);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);


  function convertToDate(dateString: string | null) {
    if (dateString) {
      return new Date(dateString);
    }
    return null;
  }

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


  const handleTaskChange = (selectedTask) => {
    setTaskId(selectedTask.id);
    setTitle(selectedTask.title);
    setDescription(selectedTask.description);
    setPlace(selectedTask.place.id);
    const deadlineObject = convertToDate(selectedTask.deadline)
    setDeadline(deadlineObject)
    const reminderObject = convertToDate(selectedTask.reminder)
    setReminder(reminderObject);
    setUserId(selectedTask.assignee.id);
    setStatus(formatTranslate[selectedTask.taskStatus]);

  };



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

  const getUsers = async () =>{
    const usersResponce = await api.event.getUsersHavingRoles(idInt | null);
    if (usersResponce.status == 200){
      const usersData = usersResponce.data;
      setUsersList(usersData);
      setUsersLoaded(true);
    }
  }
  useEffect(() => {
    getUsers();
  }, []);

  function convertToLocaleDateTime(date: Date | null) {
    if (date) {
      const isoDateTime = date.toISOString();
      return isoDateTime.slice(0, -1);
    }
    return null;
  }

  const deleteTask = async () =>{
    const tasksResponse = await api.task.taskDelete(taskId);
    if (tasksResponse.status == 200) {
      console.log("Успешно")
    } else {
      console.log(tasksResponse.status);
    }
  }

  const editTask = () => {
    if (!idInt || !userId || !title || !description || !place || !deadline || !reminder)  {
      setShowEmptyFieldsMessage(true);
      return;
    }
    const taskStatus = formatEnum[status];
    const deadlineString = convertToLocaleDateTime(deadline);
    const reminderString = convertToLocaleDateTime(reminder);

    taskService.updateTask(
      api,
      taskId,
      idInt,
      userId,
      title,
      description,
      taskStatus,
      place,
      deadlineString!,
      reminderString!
    ).then(()=>onClose());
  }

  return (
    <div className={styles.dialog_task} onClick={onClose}>
      <Dialog className={styles.dialog_content_task} text={'Изменение задачи'}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <InputLabel value="Задача" />
              <select value={taskId} onChange={(e) =>  handleTaskChange(tasksList.find(task => task.id === parseInt(e.target.value)))}>
                {tasksLoaded ? (
                  tasksList.map((p) => {
                    return <option key={p.id} value={p.id}>{p.title}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <Label value="Название"/>
              <Input
                type="text"
                value={String(title)}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Описание"/>
              <Input
                type="text"
                value={String(description)}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Место" />
              <select value={place} onChange={(e) => setPlace(parseInt(e.target.value))}>
                {placesLoaded ? (
                  placeList.map((p) => {
                    return <option key={p.id} value={p.id} >{p.name}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Статус" />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.keys(formatEnum).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Пользователи" />
              <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
                {usersLoaded ? (
                  usersList.map((p) => {
                    return <option key={p.id} value={p.id} >{p.name} {p.surname} {p.roleName}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <Label value="Крайний срок"/>
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
              />
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
            </div>
            <div className={styles.button_container}>
              <div className={styles.place_form_button}>
                <Button onClick={editTask}>Изменить</Button>
                {showEmptyFieldsMessage && (
                  <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>
                )}
              </div>
              <div className={styles.place_form_button}>
                <Button onClick={deleteTask}>Удалить</Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default UpdateTaskDialog;