import { RoleModel } from "@entities/role";
import Button from "@widgets/main/Button";
import Input from "@widgets/main/Input";
import InputLabel from "@widgets/main/InputLabel";
import TextArea from "@widgets/main/TextArea";
import DatePicker from "react-datepicker";
import styles from './index.module.css'
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

type UpdateProps = {
  role: RoleModel,
  onDone: (prev: RoleModel, cur: RoleModel) => void
}

const UpdateDialogContent = (props: UpdateProps) => {
  const[startDate, setStartDate] = useState('');
  const[endDate, setEndDate] = useState('');
  const[title, setTitle] = useState('');
  const[shortDescription, setShortDescription] = useState('');
  const[fullDescription, setFullDescription] = useState('');
  const[format, setFormat] = useState('');
  const[status, setStatus] = useState('');
  const[registrationStart, setRegistrationStart] = useState('');
  const[registrationEnd, setRegistrationEnd] = useState('');
  const[participantLimit, setParticipantLimit] = useState('');
  const[participantHighestAge,setParticipantHighestAge] = useState('');
  const[participantLowestAge,setParticipantLowestAge] = useState('');
  const[preparingStart, setPreparingStart] = useState('');
  const[preparingEnd, setPreparingEnd] = useState('');
  const[place, setPlace] = useState('');

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название" />
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Краткое описание" />
          <TextArea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Полное описание" />
          <TextArea value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Максимальное количество участников" />
          <Input value={participantLimit} onChange={(e) => setParticipantLimit(e.target.value)} />
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
            <option value="OFFLINE">Offline</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Место" onChange={(e) => setPlace(e.target.value)}/>
          <select value={place}>
            <option value="1">ITMO</option>
          </select>
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Состояние" onChange={(e) => setStatus(e.target.value)}/>
          <select value={status}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
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
            onChange={(date) => setPreparingStart(date)}
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
      </div>
      <Button>Редактировать</Button>
    </div>
  );
}

export default UpdateDialogContent;
