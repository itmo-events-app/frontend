import Content from '@widgets/main/Content';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { useState, useContext, ChangeEvent } from "react";
import ApiContext from '@features/api-context';
import styles from './dialog.module.css';
// const _test_orgs = [
//   new DropdownOption('[408975] Григорьев Георгий Александрович'),
//   new DropdownOption('[621304] Ефимов Евгений Николаевич'),
//   new DropdownOption('[308820] Васильева Валентина Сергеевна'),
//   new DropdownOption('[107589] Лебедев Леонид Петрович'),
// ];

function EventCreationDialog({onSubmit = null} : {onSubmit: (() => void) | null}) {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const {api} = useContext(ApiContext);
  const  _createEvent = async() => {
    if (inputValue.trim().length === 0) return; //blank?
    try {
      const response = await api.event.addEventByOrganizer({
        'userId':1,//todo: userid
        'title':inputValue
      });
      if (response.status === 201) {
        console.log(response);
        if (onSubmit) onSubmit();
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }
  return (
    <Content>
          <div className={styles.event_form}>
            <div className={styles.event_form_item}>
              <Input type="text" placeholder="Введите название мероприятия" value={inputValue} onChange={handleChange}/>
            </div>
            {/* <div className={styles.event_form_item}>
              <Dropdown placeholder="Выберите главного организатора" items={_test_orgs} />
            </div> */}
            <div className={styles.event_form_button}>
              <Button onClick={_createEvent}>Создать</Button>
            </div>
          </div>
        </Content>
  );
}

export default EventCreationDialog;
