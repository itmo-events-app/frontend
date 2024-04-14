import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import DatePicker from "react-datepicker";
import styles from './index.module.css'
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  AddActivityFormatEnum,
  AddActivityStatusEnum,
  EventRequest,
} from "@shared/api/generated";
import ApiContext from "@features/api-context.ts";

function getAddActivityFormatEnum(value: string): AddActivityFormatEnum | undefined {
  for (const key in AddActivityFormatEnum) {
    if (AddActivityFormatEnum[key] === value) {
      return AddActivityFormatEnum[key];
    }
  }
  return undefined;
}

function getAddActivityStatusEnum(value: string): AddActivityStatusEnum | undefined {
  for (const key in AddActivityStatusEnum) {
    if (AddActivityStatusEnum[key] === value) {
      return AddActivityStatusEnum[key];
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
const UpdateDialogContent = ({ eventId, onSubmit, eventInfo }) => {
  const [startDate, setStartDate] = useState(new Date(eventInfo.startDate));
  const [endDate, setEndDate] = useState(new Date(eventInfo.endDate));
  const [title, setTitle] = useState(eventInfo.title);
  const [shortDescription, setShortDescription] = useState(eventInfo.shortDescription);
  const [fullDescription, setFullDescription] = useState(eventInfo.fullDescription);
  const [format, setFormat] = useState(getAddActivityFormatEnum(eventInfo.format));
  const [status, setStatus] = useState(getAddActivityStatusEnum(eventInfo.status));
  const [registrationStart, setRegistrationStart] = useState(new Date(eventInfo.registrationStart));
  const [registrationEnd, setRegistrationEnd] = useState(new Date(eventInfo.registrationEnd));
  const [participantLimit, setParticipantLimit] = useState(parseInt(eventInfo.participantLimit));
  const [participantHighestAge, setParticipantHighestAge] = useState(parseInt(eventInfo.participantAgeHighest));
  const [participantLowestAge, setParticipantLowestAge] = useState(parseInt(eventInfo.participantAgeLowest));
  const [preparingStart, setPreparingStart] = useState(new Date(eventInfo.preparingStart));
  const [preparingEnd, setPreparingEnd] = useState(new Date(eventInfo.preparingEnd));
  const [place, setPlace] = useState(1);
  const [placeList, setPlaceList] = useState([]);
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [image, setImage] = useState(null);
  const { api } = useContext(ApiContext);
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
  useEffect(() => {
    getPlaces();
  }, []);
  async function handleSubmit() {
    const startDateString = convertToLocaleDateTime(startDate);
    const endDateString = convertToLocaleDateTime(endDate);
    const registrationStartString = convertToLocaleDateTime(registrationStart);
    const registrationEndString = convertToLocaleDateTime(registrationEnd);
    const preparingStartString = convertToLocaleDateTime(preparingStart);
    const preparingEndString = convertToLocaleDateTime(preparingEnd);
    console.log(image);
    const eventRequest: EventRequest = {
      placeId: place,
      startDate: startDateString,
      endDate: endDateString,
      title: title,
      shortDescription: shortDescription,
      fullDescription: fullDescription,
      format: format,
      status: status,
      registrationStart: registrationStartString,
      registrationEnd: registrationEndString,
      participantLimit: participantLimit,
      participantAgeLowest: participantLowestAge,
      participantAgeHighest: participantHighestAge,
      preparingStart: preparingStartString,
      preparingEnd: preparingEndString,
      image: image,
    }
    console.log(eventRequest);
    const result = await api.event.updateEvent(
      eventId,
      eventRequest
    );
    if (result.status == 200) {
      onSubmit();
    } else {
      console.log(result.status);
    }
  }
  function convertToLocaleDateTime(date: Date) {
    const isoDateTime = date.toISOString();
    return isoDateTime.slice(0, -1);
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
            }} />
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
            onChange={(e) => setParticipantLimit(parseInt(e.target.value))}
          />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальный возраст для участия" />
          <Input value={participantHighestAge} onChange={(e) => setParticipantHighestAge(parseInt(e.target.value))} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Минимальный возраст для участия" />
          <Input value={participantLowestAge} onChange={(e) => setParticipantLowestAge(parseInt(e.target.value))} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Формат" />
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            {
              Object.entries(AddActivityFormatEnum).map(([k, v]) => {
                return <option value={k}>{v}</option>
              })
            }
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Место" />
          <select value={place} onChange={(e) => setPlace(parseInt(e.target.value))}>
            {
              placesLoaded ? (
                placeList.map(p => {
                  return <option value={p.id}>{p.address}</option>
                })
              ) : (<option value=""></option>)
            }
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Состояние" onChange={(e) => setStatus(e.target.value)} />
          <select value={status}>
            {
              Object.entries(AddActivityStatusEnum).map(([k, v]) => {
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
          <input type="file" onChange={(e) => {
            const file = e.target.files[0]
            setImage(file);
          }} />
          {image && <p>Selected file: {image.name}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit}>Редактировать</Button>
    </div>
  );
}

export default UpdateDialogContent;
