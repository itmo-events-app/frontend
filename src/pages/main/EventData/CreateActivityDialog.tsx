import { RoleModel } from "@entities/role";
import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import DatePicker from "react-datepicker";
import styles from './index.module.css';
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from '@features/api-context.ts';
import { AddActivityFormatEnum, AddActivityStatusEnum, GetAllOrFilteredEventsStatusEnum } from "@shared/api/generated";

type UpdateProps = {
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const CreateActivityDialog = ({props: UpdateProps,parentId, onSubmit}) => {
  const[startDate, setStartDate] = useState(new Date());
  const[endDate, setEndDate] = useState(new Date());
  const[title, setTitle] = useState('');
  const[shortDescription, setShortDescription] = useState('');
  const[fullDescription, setFullDescription] = useState('');
  const[format, setFormat] = useState(AddActivityFormatEnum.Offline);
  const[status, setStatus] = useState(AddActivityStatusEnum.Published);
  const[registrationStart, setRegistrationStart] = useState(new Date());
  const[registrationEnd, setRegistrationEnd] = useState(new Date());
  const[participantLimit, setParticipantLimit] = useState(1);
  const[participantHighestAge,setParticipantHighestAge] = useState(1);
  const[participantLowestAge,setParticipantLowestAge] = useState(1);
  const[preparingStart, setPreparingStart] = useState(new Date());
  const[preparingEnd, setPreparingEnd] = useState(new Date());
  const[place, setPlace] = useState(1);
  const[placeList, setPlaceList] = useState([]);
  const[placesLoaded, setPlacesLoaded] = useState(false);

  const [image, setImage] = useState(null);
  const {api} = useContext(ApiContext);
  const getPlaces = async () => {
    const placesResponse = await api.place.getAllOrFilteredPlaces()
    if (placesResponse.status == 200) {
      const placesData = placesResponse.data;
      setPlaceList(placeList.concat(placesData));
      setPlacesLoaded(true);
    } else {
      console.log(placesResponse.status);
    }
  }

  useEffect( ()=> {
      getPlaces();
    }
    , []);
  function convertToLocaleDateTime(date: Date){
    const isoDateTime = date.toISOString();
    return isoDateTime.slice(0, -1);
  }

  async function handleSubmit() {
    const startDateString = convertToLocaleDateTime(startDate);
    const endDateString = convertToLocaleDateTime(endDate);
    const registrationStartString = convertToLocaleDateTime(registrationStart);
    const registrationEndString = convertToLocaleDateTime(registrationEnd);
    const preparingStartString = convertToLocaleDateTime(preparingStart);
    const preparingEndString = convertToLocaleDateTime(preparingEnd);
    const result = await api.event.addActivity(
      place,
      startDateString,
      endDateString,
      title,
      shortDescription,
      fullDescription,
      format,
      status,
      registrationStartString,
      registrationEndString,
      participantLimit,
      participantLowestAge,
      participantHighestAge,
      preparingStartString,
      preparingEndString,
      image,
      parentId
    )
    if(result.status!=201){
      console.log(result.status);
    }else{
      onSubmit();
    }
  }
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название" />
          <Input value={title}
                 onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Краткое описание" />
          <TextArea
            value={shortDescription}
            onChange={(e) => {
              setShortDescription(e.target.value)
            }}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Полное описание" />
          <TextArea value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальное количество участников" />
          <Input
            value={participantLimit}
            onChange={(e) => setParticipantLimit(e.target.value)}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальный возраст для участия" />
          <Input value={participantHighestAge} onChange={(e) => setParticipantHighestAge(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Минимальный возраст для участия" />
          <Input value={participantLowestAge} onChange={(e) => setParticipantLowestAge(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Формат" />
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            {
              Object.entries(AddActivityFormatEnum).map(([k,v])=>{
                return <option value={k}>{v}</option>
              })
            }
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Место"/>
          <select value={place} onChange={(e) => setPlace(e.target.value)}>
            {
              placesLoaded?(
                placeList.map(p=>{
                  return <option value={p.id}>{p.address}</option>
                })
              ):( <option value=""></option>)
            }
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Состояние" onChange={(e) => setStatus(e.target.value)}/>
          <select value={status}>
            {
              Object.entries(AddActivityStatusEnum).map(([k,v])=>{
                return <option value={k}>{v}</option>
            })
            }
          </select>
        </div>

        <div className={styles.dialog_item}>
          <InputLabel value="Время начала" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время начала регистрации" />
          <DatePicker
            selected={registrationStart}
            onChange={(date) => setRegistrationStart(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания регистрации" />
          <DatePicker
            selected={registrationEnd}
            onChange={(date) => setRegistrationEnd(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время начала подготовки" />
          <DatePicker
            selected={preparingStart}
            onChange={(date) => {
              setPreparingStart(date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания подготовки" />
          <DatePicker
            selected={preparingEnd}
            onChange={(date) => setPreparingEnd(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            popperPlacement="top-start"
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Картинка" />
          <input type="file" onChange={(e)=>{
            const file = e.target.files[0]
            setImage(file);
          }} />
          {image && <p>Selected file: {image.name}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit}>Создать</Button>
    </div>
  );
}

export default CreateActivityDialog;