import Button from '@widgets/main/Button';
import Input from '@widgets/auth/Input';
import TextAreaWithError from "@widgets/TextAreaWithError/TextAreaWithError.tsx";
import InputLabel from '@widgets/main/InputLabel';
import TextArea from '@widgets/main/TextArea';
import DatePicker from 'react-datepicker';
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context.ts';
import { AddActivityFormatEnum, AddActivityStatusEnum, PlaceResponse } from '@shared/api/generated';

const CreateActivityDialog = ({ parentId, onSubmit }: { parentId: number; onSubmit: () => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [format, setFormat] = useState<AddActivityFormatEnum>(AddActivityFormatEnum.Offline);
  const [status, setStatus] = useState<AddActivityStatusEnum>(AddActivityStatusEnum.Published);
  const [registrationStart, setRegistrationStart] = useState<Date | null>(new Date());
  const [registrationEnd, setRegistrationEnd] = useState<Date | null>(new Date());
  const [participantLimit, setParticipantLimit] = useState(1);
  const [participantHighestAge, setParticipantHighestAge] = useState(1);
  const [participantLowestAge, setParticipantLowestAge] = useState(1);
  const [preparingStart, setPreparingStart] = useState<Date | null>(new Date());
  const [preparingEnd, setPreparingEnd] = useState<Date | null>(new Date());
  const [place, setPlace] = useState(1);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [placesLoaded, setPlacesLoaded] = useState(false);
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
  const [image, setImage] = useState<File | undefined>(undefined);
  function checkInputs(){
    let errorsInput = {};
    let readErrorText = {};
    let result = true;
    if(title == "" || title == null){
      errorsInput = {...errorsInput, title:true};
      readErrorText = {...readErrorText, title: "Title can't be empty"};
      result = false;
    }

    if(shortDescription == "" || shortDescription == null){
      errorsInput = {...errorsInput, shortDescription:true};
      readErrorText = {...readErrorText, shortDescription: "Short description can't be empty."};
      result = false;
    }

    if(participantLowestAge == null){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Input a number bigger than 0 please."};
      result = false;
    }
    else if(participantLowestAge <= 0){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Lowest Age should be bigger than 0."};
      result = false;
    }else if(participantHighestAge != null && participantHighestAge<= participantLowestAge){
      errorsInput ={...errorsInput, participantLowestAge : true};
      readErrorText = {...readErrorText, participantLowestAge: "Lowest Age should be smaller than highest age."};
      result = false;
    }

    if(participantHighestAge == null){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Input a number bigger than 0 please."};
      result = false;
    }
    else if(participantHighestAge <= 0){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Lowest Age should be bigger than 0."};
      result = false;
    }else if(participantLowestAge != null && participantHighestAge<= participantLowestAge){
      errorsInput ={...errorsInput, participantHighestAge : true};
      readErrorText = {...readErrorText, participantHighestAge: "Highest Age should be bigger than lowest age."};
      result = false;
    }

    if(participantLimit == null){
      errorsInput ={...errorsInput, participantLimit : true};
      readErrorText = {...readErrorText, participantLimit: "Input a number bigger than 0 please."};
      result = false;
    }
    else if(participantLimit <= 0){
      errorsInput ={...errorsInput, participantLimit : true};
      readErrorText = {...readErrorText, participantLimit: "Participant limit should be bigger than 0."};
      result = false;
    }

    const now = new Date().getTime();
    if(startDate == null){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Please choose a time"};
      result = false;
    }else if(now >= startDate.getTime()){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Please don't choose a time in the past"};
      result = false;
    }else if(endDate!=null && startDate.getTime() >= endDate.getTime()){
      errorsInput ={...errorsInput, startDate : true};
      readErrorText = {...readErrorText, startDate: "Start date should earlier than start date"};
      result = false;
    }

    if(endDate == null){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Please choose a time"};
      result = false;
    }else if(now >= endDate.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Please don't choose a time in the past"};
      result = false;
    }else if(startDate!=null && startDate.getTime()>= endDate.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "End date should after start date"};
      result = false;
    }

    if(registrationStart == null){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Please choose a time"};
      result = false;
    }else if(now >= registrationStart.getTime()){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Please don't choose a time in the past"};
      result = false;
    }else if(registrationEnd!=null && registrationStart.getTime()>= registrationEnd.getTime()){
      errorsInput ={...errorsInput, registrationStart : true};
      readErrorText = {...readErrorText, registrationStart: "Registration start date should earlier than registration end date"};
      result = false;
    }

    if(registrationEnd == null){
      errorsInput ={...errorsInput, registrationEnd : true};
      readErrorText = {...readErrorText, registrationEnd: "Please choose a time"};
      result = false;
    }else if(now >= registrationEnd.getTime()){
      errorsInput ={...errorsInput, registrationEnd : true};
      readErrorText = {...readErrorText, registrationEnd: "Please don't choose a time in the past"};
      result = false;
    }else if(registrationStart!=null && registrationStart.getTime()>= registrationEnd.getTime()){
      errorsInput ={...errorsInput, endDate : true};
      readErrorText = {...readErrorText, endDate: "Registration end date should after registration start date"};
      result = false;
    }

    if(preparingStart == null){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Please choose a time"};
      result = false;
    }else if(now >= preparingStart.getTime()){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Please don't choose a time in the past"};
      result = false;
    }else if(preparingEnd!=null && preparingStart.getTime()>= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingStart : true};
      readErrorText = {...readErrorText, preparingStart: "Preparing start date should earlier than registration end date"};
      result = false;
    }

    if(preparingEnd == null){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Please choose a time"};
      result = false;
    }else if(now >= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Please don't choose a time in the past"};
      result = false;
    }else if(preparingStart!=null && preparingStart.getTime()>= preparingEnd.getTime()){
      errorsInput ={...errorsInput, preparingEnd : true};
      readErrorText = {...readErrorText, preparingEnd: "Preparing end date should after preparing start date"};
      result = false;
    }

    if(format==null){
      errorsInput ={...errorsInput, format : true};
      readErrorText = {...readErrorText, format: "Choose a format please"};
      result = false;
    }
    if(status==null){
      errorsInput ={...errorsInput, status : true};
      readErrorText = {...readErrorText, status: "Choose a status please"};
      result = false;
    }
    if(place==0 || place==null){
      errorsInput ={...errorsInput, place : true};
      readErrorText = {...readErrorText, place: "Choose a place please"};
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
  function convertToLocaleDateTime(date: Date | null) {
    if (date) {
      const isoDateTime = date.toISOString();
      return isoDateTime.slice(0, -1);
    }
    return null;
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
    const result = await api.event.addActivity(
      place,
      startDateString!,
      endDateString!,
      title,
      shortDescription,
      fullDescription,
      format,
      status,
      registrationStartString!,
      registrationEndString!,
      participantLimit,
      participantLowestAge,
      participantHighestAge,
      preparingStartString!,
      preparingEndString!,
      parentId,
      image!
    );
    if (result.status != 201) {
      console.log(result.status);
    } else {
      onSubmit();
    }
  }
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название" />
          <Input value={title ?? ''} onChange={(e) => setTitle(e.target.value)}
                 errorText={errorsText.title??''} error={errors.title??false}/>
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
          <TextArea value={fullDescription ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFullDescription(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальное количество участников" />
          <Input
            value={String(participantLimit) ?? ''}
            onChange={(e) => setParticipantLimit(parseInt(e.target.value))}
            errorText={errorsText.participantLimit??''} error={errors.participantLimit??false}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальный возраст для участия" />
          <Input
            value={String(participantHighestAge)}
            onChange={(e) => setParticipantHighestAge(parseInt(e.target.value))}
            errorText={errorsText.participantHighestAge??''} error={errors.participantHighestAge??false}/>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Минимальный возраст для участия" />
          <Input
            value={String(participantLowestAge)}
            onChange={(e) => setParticipantLowestAge(parseInt(e.target.value))}
            errorText={errorsText.participantLowestAge??''} error={errors.participantLowestAge??false}/>
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
                return <option key={p.id} value={p.id}>{p.address}</option>;
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
      <Button onClick={handleSubmit}>Создать</Button>
    </div>
  );
};

export default CreateActivityDialog;
