import styles from "./index.module.css";
import Dialog from "@widgets/main/Dialog";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {PlaceResponse, UserResponse} from "@shared/api/generated";
import ApiContext from "@features/api-context";
import InputLabel from "@widgets/main/InputLabel";
import {taskService} from "@features/task-service";

const AddTaskDialog = ({onClose, idInt}: { onClose: () => void, idInt: number | null }) => {
  const { api } = useContext(ApiContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<Date | null>(null);

  const [usersList, setUsersList] = useState([] as UserResponse[]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userId, setUserId] = useState(1);

  const [place, setPlace] = useState(1);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);


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
    const usersResponse = await api.event.getUsersHavingRoles(idInt | null);
    if (usersResponse.status == 200){
      const usersData = usersResponse.data;
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

  const createTask = () => {
    if (!idInt || !userId || !title || !description || !place || !deadline || !reminder)  {
      setShowEmptyFieldsMessage(true);
      return;
    }
    const deadlineString = convertToLocaleDateTime(deadline);
    const reminderString = convertToLocaleDateTime(reminder);

    taskService.createTask(
      api,
      idInt,
      userId,
      title,
      description,
      place,
      deadlineString!,
      reminderString!
    ).then(()=>onClose());
  }


  return (
    <div className={styles.dialog_task} onClick={onClose}>
      <Dialog className={styles.dialog_content_task} text={'Создание задачи'}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
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
                    return <option key={p.id} value={p.id}>{p.address}</option>;
                  })
                ) : (
                  <option value=""></option>
                )}
              </select>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value="Пользователи" />
              <select value={userId} onChange={(e) => setUserId(parseInt(e.target.value))}>
                {usersLoaded ? (
                  usersList.map((p) => {
                    return <option key={p.id} value={p.id}>{p.name} {p.surname}</option>;
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
            <div className={styles.place_form_button}>
              <Button onClick={createTask}>Создать</Button>
              {showEmptyFieldsMessage && (
                <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddTaskDialog;
