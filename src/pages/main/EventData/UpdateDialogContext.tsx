import Button from '@widgets/main/Button';
import Input from '@widgets/main/Input';
import InputLabel from '@widgets/main/InputLabel';
import DatePicker from 'react-datepicker';
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import {
  AddActivityFormatEnum,
  AddActivityStatusEnum,
  EventResponse,
  PlaceResponse,
} from '@shared/api/generated';
import ApiContext from '@features/api-context.ts';
import TextAreaWithError from "@widgets/TextAreaWithError/TextAreaWithError.tsx";

function getAddActivityFormatEnum(value: string): AddActivityFormatEnum | undefined {
  for (const [_, v] of Object.entries(AddActivityFormatEnum)) {
    if (v === value) {
      return v;
    }
  }
  return undefined;
}

function getAddActivityStatusEnum(value: string): AddActivityStatusEnum | undefined {
  for (const [_, v] of Object.entries(AddActivityStatusEnum)) {
    if (v === value) {
      return v;
    }
  }
  return undefined;
}

// function getGetAllOrFilteredEventsStatusEnum(value: string): GetAllOrFilteredEventsStatusEnum | undefined {
//   for (const key in GetAllOrFilteredEventsStatusEnum) {
//     if (GetAllOrFilteredEventsStatusEnum[key] === value) {
//       return GetAllOrFilteredEventsStatusEnum[key];
//     }
//   }
//   return undefined;
// }
type Props = {
  eventId: number;
  onSubmit: () => void;
  eventInfo: EventResponse;
};

function createDateOrNull(str: string | undefined | null) {
  return str ? new Date(str) : null;
}

const UpdateDialogContent = ({ eventId, onSubmit, eventInfo }: Props) => {
  console.log(eventInfo);
  const [startDate, setStartDate] = useState<Date | null>(createDateOrNull(eventInfo.startDate));
  const [endDate, setEndDate] = useState<Date | null>(createDateOrNull(eventInfo.endDate));
  const [title, setTitle] = useState(eventInfo.title);
  const [shortDescription, setShortDescription] = useState(eventInfo.shortDescription);
  const [fullDescription, setFullDescription] = useState(eventInfo.fullDescription);
  const [format, setFormat] = useState(getAddActivityFormatEnum(eventInfo.format!));
  const [status, setStatus] = useState(getAddActivityStatusEnum(eventInfo.status!));
  const [registrationStart, setRegistrationStart] = useState<Date | null>(createDateOrNull(eventInfo.registrationStart));
  const [registrationEnd, setRegistrationEnd] = useState<Date | null>(createDateOrNull(eventInfo.registrationEnd));
  const [participantLimit, setParticipantLimit] = useState(eventInfo.participantLimit!);
  const [participantHighestAge, setParticipantHighestAge] = useState(eventInfo.participantAgeHighest);
  const [participantLowestAge, setParticipantLowestAge] = useState(eventInfo.participantAgeLowest);
  const [preparingStart, setPreparingStart] = useState<Date | null>(createDateOrNull(eventInfo.preparingStart));
  const [preparingEnd, setPreparingEnd] = useState<Date | null>(createDateOrNull(eventInfo.preparingEnd));
  const [place, setPlace] = useState(1);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState({
    startDate : false,
    endDate : false,
    title : false,
    shortDescription : false,
    fullDescription : false,
    format : false,
    status : false,
    registrationStart : false,
    registrationEnd : false,
    participantLimit : false,
    participantHighestAge : false,
    participantLowestAge : false,
    preparingEnd : false,
    preparingStart : false,
    place : false,
  })
  const [errorsText, setErrorsText] = useState({
    startDate : "",
    endDate : "",
    title : "",
    shortDescription : "",
    fullDescription : "",
    format : "",
    status : "",
    registrationStart : "",
    registrationEnd : "",
    participantLimit : "",
    participantHighestAge : "",
    participantLowestAge : "",
    preparingEnd : "",
    preparingStart : "",
    place : "",
  })
  const { api } = useContext(ApiContext);
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
  function checkInputs(){
    let errorsInput = {};
    let readErrorText = {};
    let result = true;
    if(title == "" || title == null){
      errorsInput = {...errorsInput, title:true};
      readErrorText = {...readErrorText, title: "Поле не может быть пустым"};
      result = false;
    }

    if(shortDescription == "" || shortDescription == null){
      errorsInput = {...errorsInput, shortDescription:true};
      readErrorText = {...readErrorText, shortDescription: "Поле не может быть пустым"};
      result = false;
    }
    if(fullDescription == "" || shortDescription == null){
      errorsInput = {...errorsInput, fullDescription:true};
      readErrorText = {...readErrorText, fullDescription: "Поле не может быть пустым"};
      result = false;
    }
    if(participantLowestAge == null){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Поле не может быть пустым"};
      result = false;
    }
    else if(participantLowestAge <= 0){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Минимальный возраст участников должен быть больше 0"};
      result = false;
    }else if(participantHighestAge != null && participantHighestAge<= participantLowestAge){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Минимальный возраст должен быть меньше, чем максимальный"};
      result = false;
    }else if(participantLowestAge > 150){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Минимальный возраст участников не может быть больше 150"};
      result = false;
    }

    if(participantHighestAge == null){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Поле не может быть пустым"};
      result = false;
    }
    else if(participantHighestAge <= 0){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Максимальный возраст участников должен быть больше 0"};
      result = false;
    }else if(participantLowestAge != null && participantHighestAge<= participantLowestAge){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Максимальный возраст должен быть больше, чем минимальный возраст"};
      result = false;
    }else if(participantHighestAge>150){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Максимальный возраст участников не может быть больше 150"};
      result = false;
    }

    if(participantLimit == null){
      errorsInput ={...errorsInput, participantLimit : true};
      readErrorText = {...readErrorText, participantLimit: "Поле не может быть пустым"};
      result = false;
    }
    else if(participantLimit <= 0){
      errorsInput ={...errorsInput, participantLimit : true};
      readErrorText = {...readErrorText, participantLimit: "Органичение количества участников должно быть больше 0"};
      result = false;
    }

    const now = new Date().getTime();
    if(startDate == null){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Поле не может быть пустым"};
      result = false;
    }else if(now >= startDate.getTime()){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Мероприятие не может начинаться в прошлом"};
      result = false;
    }else if(endDate!=null && startDate.getTime() >= endDate.getTime()){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Время начала мероприятия не может быть после времени конца мероприятия"};
      result = false;
    }

    if(endDate == null){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Поле не может быть пустым"};
      result = false;
    }else if(now >= endDate.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Мероприятие не может заканчиваться в прошлом"};
      result = false;
    }else if(startDate!=null && startDate.getTime()>= endDate.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Время начала мероприятия не может быть после времени конца мероприятия"};
      result = false;
    }

    if(registrationStart == null){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Поле не может быть пустым"};
      result = false;
    }else if(now >= registrationStart.getTime()){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Регистрация на мероприятие не может начинаться в прошлом"};
      result = false;
    }else if(registrationEnd!=null && registrationStart.getTime()>= registrationEnd.getTime()){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Время начала регистрации на мероприятие не может быть после времени конца регистрации на мероприятие"};
      result = false;
    }

    if(registrationEnd == null){
      errorsInput ={...errorsInput, registrationEnd : true};
      readErrorText = {...readErrorText, registrationEnd: "Поле не может быть пустым"};
      result = false;
    }else if(now >= registrationEnd.getTime()){
      errorsInput ={...errorsInput, registrationEnd : true};
      readErrorText = {...readErrorText, registrationEnd: "Регистрация на мероприятие не может заканчиваться в прошлом"};
      result = false;
    }else if(registrationStart!=null && registrationStart.getTime()>= registrationEnd.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Время начала регистрации на мероприятие не может быть после времени конца регистрации на мероприятие"};
      result = false;
    }

    if(preparingStart == null){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Поле не может быть пустым"};
      result = false;
    }else if(now >= preparingStart.getTime()){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Подготовка к мероприятию не может начинаться в прошлом"};
      result = false;
    }else if(preparingEnd!=null && preparingStart.getTime()>= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Время начала подготовки мероприятия не может быть после времени конца подготовки мероприятия"};
      result = false;
    }

    if(preparingEnd == null){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Поле не может быть пустым"};
      result = false;
    }else if(now >= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Подготовка к мероприятию не может заканчиваться в прошлом"};
      result = false;
    }else if(preparingStart!=null && preparingStart.getTime()>= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Время начала подготовки мероприятия не может быть после времени конца подготовки мероприятия"};
      result = false;
    }

    if(format==null){
      errorsInput ={...errorsInput, format : true};
      readErrorText = {...readErrorText, format: "Поле не может быть пустым"};
      result = false;
    }
    if(status==null){
      errorsInput ={...errorsInput, status : true};
      readErrorText = {...readErrorText, status: "Поле не может быть пустым"};
      result = false;
    }
    if(place==0 || place==null){
      errorsInput ={...errorsInput, place : true};
      readErrorText = {...readErrorText, place: "Поле не может быть пустым"};
      result = false;
    }
    setErrors({
      startDate : false,
      endDate : false,
      title : false,
      shortDescription : false,
      fullDescription : false,
      format : false,
      status : false,
      registrationStart : false,
      registrationEnd : false,
      participantLimit : false,
      participantHighestAge : false,
      participantLowestAge : false,
      preparingEnd : false,
      preparingStart : false,
      place : false,
    });
    setErrorsText({
      startDate : "",
      endDate : "",
      title : "",
      shortDescription : "",
      fullDescription : "",
      format : "",
      status : "",
      registrationStart : "",
      registrationEnd : "",
      participantLimit : "",
      participantHighestAge : "",
      participantLowestAge : "",
      preparingEnd : "",
      preparingStart : "",
      place : "",
    });
    setErrors({...errors,...errorsInput});
    setErrorsText({...errorsText, ...readErrorText});
    return result;
  }
  async function handleSubmit() {
    const startDateString = convertToLocaleDateTime(startDate);
    const endDateString = convertToLocaleDateTime(endDate);
    const registrationStartString = convertToLocaleDateTime(registrationStart);
    const registrationEndString = convertToLocaleDateTime(registrationEnd);
    const preparingStartString = convertToLocaleDateTime(preparingStart);
    const preparingEndString = convertToLocaleDateTime(preparingEnd);

    if(!checkInputs()){
      return;
    }
    const result = await api.event.updateEvent(
      eventId,
      place,
      startDateString!,
      endDateString!,
      title!,
      shortDescription!,
      fullDescription!,
      format!,
      status!,
      registrationStartString!,
      registrationEndString!,
      participantLimit,
      participantLowestAge!,
      participantHighestAge!,
      preparingStartString!,
      preparingEndString!,
      eventInfo.parent,
      image!
      );
    if (result.status == 200) {
      onSubmit();
    } else {
      console.log(result.status);
    }
  }
  function convertToLocaleDateTime(date: Date | null) {
    if (date) {
      const isoDateTime = date.toISOString();
      return isoDateTime.slice(0, -1);
    }
    return null;
  }
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название" />
          <Input value={title ?? ''} onChange={(e) => setTitle(e.target.value)}
          errorText={errorsText.title??''}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Краткое описание" />
          <TextAreaWithError
            value={shortDescription ?? ''}
            onChange={(e) => {
              setShortDescription(e.target.value);
            }}
            error={errors.shortDescription}
            errorText={errorsText.shortDescription}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Полное описание" />
          <TextAreaWithError value={fullDescription ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFullDescription(e.target.value)}
                    errorText={errorsText.fullDescription}
                    error = {errors.fullDescription}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальное количество участников" />
          <Input
            value={String(participantLimit) ?? ''}
            onChange={(e) => setParticipantLimit(parseInt(e.target.value))}
            errorText={errorsText.participantLimit??''}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальный возраст для участия" />
          <Input
            value={String(participantHighestAge)}
            onChange={(e) => setParticipantHighestAge(parseInt(e.target.value))}
            errorText={errorsText.participantHighestAge??''}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Минимальный возраст для участия" />
          <Input
            value={String(participantLowestAge)}
            onChange={(e) => setParticipantLowestAge(parseInt(e.target.value))}
            errorText={errorsText.participantLowestAge??''}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Формат" />
          <select value={format} onChange={(e) => setFormat(e.target.value as AddActivityFormatEnum)}
                  className={errors.format?styles.input_error:''}>
            {Object.entries(AddActivityFormatEnum).map(([k, v]) => {
              return <option key={k} value={v}>{v}</option>;
            })}
          </select>
          <div>
            {errors.format && <div className={styles.helper_error}>{errorsText.format}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Место" />
          <select value={place} onChange={(e) => setPlace(parseInt(e.target.value))}
                  className={errors.place?styles.input_error:''}>
            {placesLoaded ? (
              placeList.map((p) => {
                return <option key={p.id} value={p.id}>{p.address}{p.room ? ", ауд. " + p.room : ""}</option>;
              })
            ) : (
              <option value=""></option>
            )}
          </select>
          <div>
            {errors.place && <div className={styles.helper_error}>{errorsText.place}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Состояние" />
            <select value={status} onChange={(e) => setStatus(e.target.value as AddActivityStatusEnum)}
                    className={errors.format?styles.input_error:''}>
              {Object.entries(AddActivityStatusEnum).map(([k, v]) => {
                return <option key={k} value={v}>{v}</option>;
              })}
            </select>
          <div>
            {errors.status && <div className={styles.helper_error}>{errorsText.status}</div>}
          </div>
        </div>

        <div className={styles.dialog_item}>
          <InputLabel value="Время начала" />
          <div>
              <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              popperPlacement="top-start"
              className={errors.startDate?styles.input_error:''}
            />
            {errors.startDate && <div className={styles.helper_error}>{errorsText.startDate}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания" />
          <div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              popperPlacement="top-start"
              className={errors.endDate?styles.input_error:''}
            />
            {errors.endDate && <div className={styles.helper_error}>{errorsText.endDate}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время начала регистрации" />
          <div>
            <DatePicker
              selected={registrationStart}
              onChange={(date) => setRegistrationStart(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              popperPlacement="top-start"
              className={errors.registrationStart?styles.input_error:''}
            />
            {errors.registrationStart && <div className={styles.helper_error}>{errorsText.registrationStart}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания регистрации" />
          <div>
            <DatePicker
              selected={registrationEnd}
              onChange={(date) => setRegistrationEnd(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              popperPlacement="top-start"
              className={errors.registrationEnd?styles.input_error:''}
            />
            {errors.registrationEnd && <div className={styles.helper_error}>{errorsText.registrationEnd}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время начала подготовки" />
          <div>
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
              className={errors.preparingStart?styles.input_error:''}
            />
            {errors.preparingStart && <div className={styles.helper_error}>{errorsText.preparingStart}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Время окончания подготовки" />
          <div>
            <DatePicker
              selected={preparingEnd}
              onChange={(date) => setPreparingEnd(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              popperPlacement="top-start"
              className={errors.preparingEnd?styles.input_error:''}
            />
            {errors.preparingEnd && <div className={styles.helper_error}>{errorsText.preparingEnd}</div>}
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Картинка" />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                const file = e.target.files[0];
                setImage(file);
              }
            }}
          />
          {image && <p>Selected file: {image.name}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit}>Редактировать</Button>
    </div>
  );
};

export default UpdateDialogContent;
