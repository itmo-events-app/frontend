import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import InputLabel from "@widgets/main/InputLabel";
import DatePicker from "react-datepicker";
import styles from "./index.module.css";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

import { AddActivityFormatEnum, AddActivityStatusEnum, EventResponse, PlaceResponse } from "@shared/api/generated";
import ApiContext from "@features/api-context.ts";
import TextAreaWithError from "@widgets/TextAreaWithError/TextAreaWithError.tsx";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";

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
  const [startDate, setStartDate] = useState<Date | null>(createDateOrNull(eventInfo.startDate));
  const [endDate, setEndDate] = useState<Date | null>(createDateOrNull(eventInfo.endDate));
  const [title, setTitle] = useState(eventInfo.title);
  const [shortDescription, setShortDescription] = useState(eventInfo.shortDescription);
  const [fullDescription, setFullDescription] = useState(eventInfo.fullDescription);
  const [format, setFormat] = useState(getAddActivityFormatEnum(eventInfo.format!) || Object.entries(AddActivityFormatEnum)[0][1]);
  const [status, setStatus] = useState(getAddActivityStatusEnum(eventInfo.status!) || Object.entries(AddActivityStatusEnum)[0][1]);
  const [registrationStart, setRegistrationStart] = useState<Date | null>(createDateOrNull(eventInfo.registrationStart));
  const [registrationEnd, setRegistrationEnd] = useState<Date | null>(createDateOrNull(eventInfo.registrationEnd));
  const [participantLimit, setParticipantLimit] = useState(eventInfo.participantLimit!);
  const [participantHighestAge, setParticipantHighestAge] = useState(eventInfo.participantAgeHighest);
  const [participantLowestAge, setParticipantLowestAge] = useState(eventInfo.participantAgeLowest);
  const [preparingStart, setPreparingStart] = useState<Date | null>(createDateOrNull(eventInfo.preparingStart));
  const [preparingEnd, setPreparingEnd] = useState<Date | null>(createDateOrNull(eventInfo.preparingEnd));
  const [place, setPlace] = useState(0);
  const [placeList, setPlaceList] = useState([] as PlaceResponse[]);
  const [image, setImage] = useState<File | undefined>(undefined);
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
  const { api } = useContext(ApiContext);
  const getPlaces = async () => {
    const placesResponse = await api.place.getAllOrFilteredPlaces();
    if (placesResponse.status == 200) {
      const placesData = placesResponse.data;
      setPlaceList(placesData);
      if (placesData[0] && placesData[0].id) {
        setPlace(placesData[0].id);
      }
    } else {
      console.log(placesResponse.status);
    }
  };
  useEffect(() => {
    getPlaces();
  }, []);
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

    if (startDate == null) {
      errorsInput = { ...errorsInput, startDate: true };
      readErrorText = { ...readErrorText, startDate: "Поле не может быть пустым" };
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
    } else if (startDate != null && startDate.getTime() >= endDate.getTime()) {
      errorsInput = { ...errorsInput, endDate: true };
      readErrorText = { ...readErrorText, endDate: "Время окончания мероприятия не может быть перед временем начала мероприятия" };
      result = false;
    }

    if (registrationStart == null) {
      errorsInput = { ...errorsInput, registrationStart: true };
      readErrorText = { ...readErrorText, registrationStart: "Поле не может быть пустым" };
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
    } else if (registrationStart != null && registrationStart.getTime() >= registrationEnd.getTime()) {
      errorsInput = { ...errorsInput, registrationEnd: true };
      readErrorText = { ...readErrorText, registrationEnd: "Время окончания регистрации на мероприятие не может быть перед временем начала регистрации на мероприятие" };
      result = false;
    }

    if (preparingStart == null) {
      errorsInput = { ...errorsInput, preparingStart: true };
      readErrorText = { ...readErrorText, preparingStart: "Поле не может быть пустым" };
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
      image
    );
    if (result.status == 200) {
      onSubmit();
    } else {
      console.log(result.status);
    }
  }
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
            error={errors.fullDescription}
          />
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
            <Dropdown placeholder="Формат" value={format} onChange={(e) => setFormat(e)}
              items={Object.entries(AddActivityFormatEnum).map(([, v]) => { return v })} toText={(o) => o} />
            <div>
              {errors.format && <div className={styles.helper_error}>{errorsText.format}</div>}
            </div>
          </div>
          <div className={errors.place ? styles.input_error : styles.dialog_item}>
            <InputLabel value="Место" />
            <Dropdown placeholder="Место" value={place} onChange={(e) => setPlace(e ? e : 0)}
              items={placeList != null && placeList.length > 0 ? placeList.map(p => { return new DropdownOption(p.name, p.id?.toString()) }) : [0]}
              toText={(o) => {
                const place = placeList.find(p => p.id == o)
                if (place) {
                  const room = place.room ? ", ауд. " + place.room : ""
                  return place.address + " " + room
                }
                return ""
              }} />
            <div>
              {errors.place && <div className={styles.helper_error}>{errorsText.place}</div>}
            </div>
          </div>
          <div className={styles.dialog_item}>
            <InputLabel value="Состояние" />
            <Dropdown placeholder="Состояние" value={status} onChange={(e) => setStatus(e)}
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
