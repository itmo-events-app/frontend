import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import TextAreaWithError from "@widgets/TextAreaWithError/TextAreaWithError.tsx";
import InputLabel from "@widgets/main/InputLabel";
import DatePicker from "react-datepicker";
import styles from "./index.module.css";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ApiContext from "@features/api-context.ts";
import { AddActivityFormatEnum, AddActivityStatusEnum, PlaceResponse } from "@shared/api/generated";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";

const CreateActivityDialog = ({ parentId, onSubmit }: { parentId: number; onSubmit: () => void }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [format, setFormat] = useState<AddActivityFormatEnum>(Object.entries(AddActivityFormatEnum)[0][1]);
  const [status, setStatus] = useState<AddActivityStatusEnum>(Object.entries(AddActivityStatusEnum)[0][1]);
  const [registrationStart, setRegistrationStart] = useState<Date | null>(new Date());
  const [registrationEnd, setRegistrationEnd] = useState<Date | null>(new Date());
  const [participantLimit, setParticipantLimit] = useState(1);
  const [participantHighestAge, setParticipantHighestAge] = useState(1);
  const [participantLowestAge, setParticipantLowestAge] = useState(1);
  const [preparingStart, setPreparingStart] = useState<Date | null>(new Date());
  const [preparingEnd, setPreparingEnd] = useState<Date | null>(new Date());
  const [place, setPlace] = useState(0);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
    title: false,
    shortDescription: false,
    fullDescription: false,
    format: false,
    status: false,
    registrationStart: false,
    registrationEnd: false,
    participantLimit: false,
    participantHighestAge: false,
    participantLowestAge: false,
    preparingEnd: false,
    preparingStart: false,
    place: false,
  })
  const [errorsText, setErrorsText] = useState({
    startDate: "",
    endDate: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    format: "",
    status: "",
    registrationStart: "",
    registrationEnd: "",
    participantLimit: "",
    participantHighestAge: "",
    participantLowestAge: "",
    preparingEnd: "",
    preparingStart: "",
    place: "",
  })
  const [image, setImage] = useState<File | undefined>(undefined);
  function checkInputs() {
    let errorsInput = {
      startDate: false,
      endDate: false,
      title: false,
      shortDescription: false,
      fullDescription: false,
      format: false,
      status: false,
      registrationStart: false,
      registrationEnd: false,
      participantLimit: false,
      participantHighestAge: false,
      participantLowestAge: false,
      preparingEnd: false,
      preparingStart: false,
      place: false,
    };
    let readErrorText = {
      startDate: "",
      endDate: "",
      title: "",
      shortDescription: "",
      fullDescription: "",
      format: "",
      status: "",
      registrationStart: "",
      registrationEnd: "",
      participantLimit: "",
      participantHighestAge: "",
      participantLowestAge: "",
      preparingEnd: "",
      preparingStart: "",
      place: "",
    };
    let result = true;
    if (title == "" || title == null) {
      errorsInput = { ...errorsInput, title: true };
      readErrorText = { ...readErrorText, title: "Поле не может быть пустым" };
      result = false;
    }

    if (shortDescription == "" || shortDescription == null) {
      errorsInput = { ...errorsInput, shortDescription: true };
      readErrorText = { ...readErrorText, shortDescription: "Поле не может быть пустым" };
      result = false;
    }
    if (fullDescription == "" || shortDescription == null) {
      errorsInput = { ...errorsInput, fullDescription: true };
      readErrorText = { ...readErrorText, fullDescription: "Поле не может быть пустым" };
      result = false;
    }
    if (participantLowestAge == null) {
      errorsInput = { ...errorsInput, participantLowestAge: true };
      readErrorText = { ...readErrorText, participantLowestAge: "Поле не может быть пустым" };
      result = false;
    }
    else if (participantLowestAge <= 0) {
      errorsInput = { ...errorsInput, participantLowestAge: true };
      readErrorText = { ...readErrorText, participantLowestAge: "Минимальный возраст участников должен быть больше 0" };
      result = false;
    } else if (participantHighestAge != null && participantHighestAge <= participantLowestAge) {
      errorsInput = { ...errorsInput, participantLowestAge: true };
      readErrorText = { ...readErrorText, participantLowestAge: "Минимальный возраст должен быть меньше, чем максимальный" };
      result = false;
    } else if (participantLowestAge > 150) {
      errorsInput = { ...errorsInput, participantLowestAge: true };
      readErrorText = { ...readErrorText, participantLowestAge: "Минимальный возраст участников не может быть больше 150" };
      result = false;
    }

    if (participantHighestAge == null) {
      errorsInput = { ...errorsInput, participantHighestAge: true };
      readErrorText = { ...readErrorText, participantHighestAge: "Поле не может быть пустым" };
      result = false;
    }
    else if (participantHighestAge <= 0) {
      errorsInput = { ...errorsInput, participantHighestAge: true };
      readErrorText = { ...readErrorText, participantHighestAge: "Максимальный возраст участников должен быть больше 0" };
      result = false;
    } else if (participantLowestAge != null && participantHighestAge <= participantLowestAge) {
      errorsInput = { ...errorsInput, participantHighestAge: true };
      readErrorText = { ...readErrorText, participantHighestAge: "Максимальный возраст должен быть больше, чем минимальный возраст" };
      result = false;
    } else if (participantHighestAge > 150) {
      errorsInput = { ...errorsInput, participantHighestAge: true };
      readErrorText = { ...readErrorText, participantHighestAge: "Максимальный возраст участников не может быть больше 150" };
      result = false;
    }

    if (participantLimit == null) {
      errorsInput = { ...errorsInput, participantLimit: true };
      readErrorText = { ...readErrorText, participantLimit: "Поле не может быть пустым" };
      result = false;
    }
    else if (participantLimit <= 0) {
      errorsInput = { ...errorsInput, participantLimit: true };
      readErrorText = { ...readErrorText, participantLimit: "Органичение количества участников должно быть больше 0" };
      result = false;
    }

    const now = new Date().getTime();
    if (startDate == null) {
      errorsInput = { ...errorsInput, startDate: true };
      readErrorText = { ...readErrorText, startDate: "Поле не может быть пустым" };
      result = false;
    } else if (now >= startDate.getTime()) {
      errorsInput = { ...errorsInput, startDate: true };
      readErrorText = { ...readErrorText, startDate: "Мероприятие не может начинаться в прошлом" };
      result = false;
    } else if (endDate != null && startDate.getTime() >= endDate.getTime()) {
      errorsInput = { ...errorsInput, startDate: true };
      readErrorText = { ...readErrorText, startDate: "Время начала мероприятия не может быть после времени окончания мероприятия" };
      result = false;
    }

    if (endDate == null) {
      errorsInput = { ...errorsInput, endDate: true };
      readErrorText = { ...readErrorText, endDate: "Поле не может быть пустым" };
      result = false;
    } else if (now >= endDate.getTime()) {
      errorsInput = { ...errorsInput, endDate: true };
      readErrorText = { ...readErrorText, endDate: "Мероприятие не может заканчиваться в прошлом" };
      result = false;
    } else if (startDate != null && startDate.getTime() >= endDate.getTime()) {
      errorsInput = { ...errorsInput, endDate: true };
      readErrorText = { ...readErrorText, endDate: "Время окончания мероприятия не может быть перед временем начала мероприятия" };
      result = false;
    }

    if (registrationStart == null) {
      errorsInput = { ...errorsInput, registrationStart: true };
      readErrorText = { ...readErrorText, registrationStart: "Поле не может быть пустым" };
      result = false;
    } else if (now >= registrationStart.getTime()) {
      errorsInput = { ...errorsInput, registrationStart: true };
      readErrorText = { ...readErrorText, registrationStart: "Регистрация на мероприятие не может начинаться в прошлом" };
      result = false;
    } else if (registrationEnd != null && registrationStart.getTime() >= registrationEnd.getTime()) {
      errorsInput = { ...errorsInput, registrationStart: true };
      readErrorText = { ...readErrorText, registrationStart: "Время начала регистрации на мероприятие не может быть после времени окончания регистрации на мероприятие" };
      result = false;
    }

    if (registrationEnd == null) {
      errorsInput = { ...errorsInput, registrationEnd: true };
      readErrorText = { ...readErrorText, registrationEnd: "Поле не может быть пустым" };
      result = false;
    } else if (now >= registrationEnd.getTime()) {
      errorsInput = { ...errorsInput, registrationEnd: true };
      readErrorText = { ...readErrorText, registrationEnd: "Регистрация на мероприятие не может заканчиваться в прошлом" };
      result = false;
    } else if (registrationStart != null && registrationStart.getTime() >= registrationEnd.getTime()) {
      errorsInput = { ...errorsInput, registrationEnd: true };
      readErrorText = { ...readErrorText, registrationEnd: "Время окончания регистрации на мероприятие не может быть перед временем начала регистрации на мероприятие" };
      result = false;
    }

    if (preparingStart == null) {
      errorsInput = { ...errorsInput, preparingStart: true };
      readErrorText = { ...readErrorText, preparingStart: "Поле не может быть пустым" };
      result = false;
    } else if (now >= preparingStart.getTime()) {
      errorsInput = { ...errorsInput, preparingStart: true };
      readErrorText = { ...readErrorText, preparingStart: "Подготовка к мероприятию не может начинаться в прошлом" };
      result = false;
    } else if (preparingEnd != null && preparingStart.getTime() >= preparingEnd.getTime()) {
      errorsInput = { ...errorsInput, preparingStart: true };
      readErrorText = { ...readErrorText, preparingStart: "Время начала подготовки мероприятия не может быть после времени окончания подготовки мероприятия" };
      result = false;
    }

    if (preparingEnd == null) {
      errorsInput = { ...errorsInput, preparingEnd: true };
      readErrorText = { ...readErrorText, preparingEnd: "Поле не может быть пустым" };
      result = false;
    } else if (now >= preparingEnd.getTime()) {
      errorsInput = { ...errorsInput, preparingEnd: true };
      readErrorText = { ...readErrorText, preparingEnd: "Подготовка к мероприятию не может заканчиваться в прошлом" };
      result = false;
    } else if (preparingStart != null && preparingStart.getTime() >= preparingEnd.getTime()) {
      errorsInput = { ...errorsInput, preparingEnd: true };
      readErrorText = { ...readErrorText, preparingEnd: "Время окончания подготовки мероприятия не может быть перед временем начала подготовки мероприятия" };
      result = false;
    }

    if (format == null) {
      errorsInput = { ...errorsInput, format: true };
      readErrorText = { ...readErrorText, format: "Поле не может быть пустым" };
      result = false;
    }
    if (status == null) {
      errorsInput = { ...errorsInput, status: true };
      readErrorText = { ...readErrorText, status: "Поле не может быть пустым" };
      result = false;
    }
    if (place == 0 || place == null) {
      errorsInput = { ...errorsInput, place: true };
      readErrorText = { ...readErrorText, place: "Поле не может быть пустым" };
      result = false;
    }
    setErrors({ ...errors, ...errorsInput });
    setErrorsText({ ...errorsText, ...readErrorText });
    return result;
  }
  const { api } = useContext(ApiContext);
  const getPlaces = async () => {
    const placesResponse = await api.place.getAllOrFilteredPlaces();
    if (placesResponse.status == 200) {
      const placesData = placesResponse.data;
      if (placesData[0] && placesData[0].id) {
        setPlace(placesData[0].id);
      }
      setPlaceList(placesData);
    } else {
      console.log(placesResponse.status);
    }
  };

  useEffect(() => {
    getPlaces();
  }, []);
  function convertToLocaleDateTime(date: Date | null) {
    if (date) {
      return date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + 'T' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2)
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
    if (!checkInputs()) {
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
            errorText={errorsText.title ?? ''} />
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
            error={errors.fullDescription} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальное количество участников" />
          <Input
            value={String(participantLimit) ?? ''}
            onChange={(e) => {
              if (parseInt(e.target.value)) {
                if (parseInt(e.target.value) > 1000000) {
                  setParticipantLimit(1000000);
                } else {
                  setParticipantLimit(parseInt(e.target.value));
                }
              } else {
                setParticipantLimit(1);
              }
            }
            }
            errorText={errorsText.participantLimit ?? ''} />
        </div>
        <div className={styles.dialog__row}>
          <div className={styles.dialog_item}>
            <InputLabel value="Минимальный возраст для участия" />
            <Input
              value={String(participantLowestAge)}
              onChange={(e) => {
                if (parseInt(e.target.value)) {
                  if (parseInt(e.target.value) > 150) {
                    setParticipantLowestAge(150)
                  } else {
                    setParticipantLowestAge(parseInt(e.target.value))
                  }
                } else {
                  setParticipantLowestAge(1);
                }
              }
              }
              errorText={errorsText.participantLowestAge ?? ''} />
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Максимальный возраст для участия" />
            <Input
              value={String(participantHighestAge)}
              onChange={(e) => {
                if (parseInt(e.target.value)) {
                  if (parseInt(e.target.value) > 150) {
                    setParticipantHighestAge(150)
                  } else {
                    setParticipantHighestAge(parseInt(e.target.value))
                  }
                } else {
                  setParticipantHighestAge(1);
                }
              }
              }
              errorText={errorsText.participantHighestAge ?? ''} />
          </div>
        </div>
        <div className={styles.dialog__rowthird}>
          <div className={styles.dialog_item}>
            <InputLabel value="Формат" />
            <Dropdown value={format} onChange={(e) => setFormat(e)}
              items={Object.entries(AddActivityFormatEnum).map(([, v]) => { return v })} toText={(o) => o} />
            <div>
              {errors.format && <div className={styles.helper_error}>{errorsText.format}</div>}
            </div>
          </div>
          <div className={errors.place ? styles.input_error : styles.dialog_item}>
            <InputLabel value="Место" />
            <Dropdown value={new DropdownOption(place.toString())} onChange={(e) => setPlace(e ? e as any : 0)}
              items={placeList.map(p => {
                return new DropdownOption(p.name, p.id?.toString())
              })} />
            <div>
              {errors.place && <div className={styles.helper_error}>{errorsText.place}</div>}
            </div>
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Состояние" />
            <Dropdown value={status} onChange={(e) => setStatus(e)}
              items={Object.entries(AddActivityStatusEnum).map(([, v]) => { return v })} toText={(o) => o} />
            <div>
              {errors.status && <div className={styles.helper_error}>{errorsText.status}</div>}
            </div>
          </div>
        </div>

        <div className={styles.dialog__row}>
          <div className={styles.dialog_item}>
            <InputLabel value="Время начала" />
            <div className={styles.dialog__date}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
                className={errors.startDate ? styles.input_error : styles.dialog_item}
              />
              {errors.startDate && <div className={styles.helper_error}>{errorsText.startDate}</div>}
              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Время окончания" />
            <div className={styles.dialog__date}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
                className={errors.endDate ? styles.input_error : styles.dialog_item}
              />
              {errors.endDate && <div className={styles.helper_error}>{errorsText.endDate}</div>}
              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dialog__row}>
          <div className={styles.dialog_item}>
            <InputLabel value="Время начала регистрации" />
            <div className={styles.dialog__date}>
              <DatePicker
                selected={registrationStart}
                onChange={(date) => setRegistrationStart(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
                className={errors.registrationStart ? styles.input_error : styles.dialog_item}
              />
              {errors.registrationStart && <div className={styles.helper_error}>{errorsText.registrationStart}</div>}
              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Время окончания регистрации" />
            <div className={styles.dialog__date}>
              <DatePicker
                selected={registrationEnd}
                onChange={(date) => setRegistrationEnd(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
                className={errors.registrationEnd ? styles.input_error : styles.dialog_item}
              />
              {errors.registrationEnd && <div className={styles.helper_error}>{errorsText.registrationEnd}</div>}
              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dialog__row}>
          <div className={styles.dialog_item}>
            <InputLabel value="Время начала подготовки" />
            <div className={styles.dialog__date}>
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
                className={errors.preparingStart ? styles.input_error : styles.dialog_item}
              />
              {errors.preparingStart && <div className={styles.helper_error}>{errorsText.preparingStart}</div>}

              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Время окончания подготовки" />
            <div className={styles.dialog__date}>
              <DatePicker
                selected={preparingEnd}
                onChange={(date) => setPreparingEnd(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="top-start"
                className={errors.preparingEnd ? styles.input_error : styles.dialog_item}
              />
              {errors.preparingEnd && <div className={styles.helper_error}>{errorsText.preparingEnd}</div>}

              <span>
                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9H21M12 18V12M15 15.001L9 15M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Картинка" />
          <label className={styles.file__wrap}>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  setImage(file);
                }
              }}
            />
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" fill="#1C274C" />
              <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#1C274C" />
            </svg>
            <span>{image ? <p>Выбран файл: {image.name}</p> : <span>Выберите файл</span>}</span>
          </label>
          {image && <p>Selected file: {image.name}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit}>Создать</Button>
    </div>
  );
};

export default CreateActivityDialog;
