import Content from '@widgets/main/Content';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { useState, useContext, ChangeEvent, useEffect } from "react";
import ApiContext from '@features/api-context';
import styles from './dialog.module.css';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';
import { EventResponse, UserResponse } from "@shared/api/generated/model";

function EventCreationDialog2({ onSubmit = null }: { onSubmit: (() => void) | null }) {
  const { api } = useContext(ApiContext);
  const [inputValue, setInputValue] = useState('');
  const [dropdownUsersValues, setDropdownUsersValues] = useState<DropdownOption<string>[]>([]);
  const [dropdownUsersValue, setDropdownUsersValue] = useState<DropdownOption<string> | undefined>();

  const [dropdownEventsValues, setDropdownEventsValues] = useState<DropdownOption<string>[]>([]);
  const [dropdownEventsValue, setDropdownEventsValue] = useState<DropdownOption<string> | undefined>();
  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const response = await api.profile.getAllUsers();
        console.log(response);
        if (response.status == 200) {
          const users = response.data.items as unknown as UserResponse[];
          users.sort((a, b) => (a.id ? a.id : 0) - (b.id ? b.id : 0));
          const values: DropdownOption<string>[] = [];
          users.forEach(user => {
            values.push(new DropdownOption(user.id + '. ' + user.name + ' ' + user.surname, (user.id ? user.id : 0).toString()));
          });
          setDropdownUsersValues(values);
          setDropdownUsersValue(values[0]);
        } else {
          console.error(response.status);
        }
      }
      fetchUsers();
    }
    catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
   const fetchEvents = async () => {
     try {
       const response = await api.event.getAllOrFilteredEvents();
       if(response.status === 200) {
         const events = response.data.items as unknown as EventResponse[];
         const values: DropdownOption<string>[] = [];
         events.forEach(event => {
           values.push(new DropdownOption(`${event.title}`, event?.id?.toString()));
         });
         setDropdownEventsValues(values);
         setDropdownEventsValue(values[0]);
       }
     } catch (e) {
       console.log(e);
     }
    }
    fetchEvents();
  }, [])
  const _handleChangeUsersDropdown = (value: string) => {
    setDropdownUsersValue(new DropdownOption(value, value));
  }
  const _handleChangeEventsDropdown = (value: string) => {
    setDropdownEventsValue(new DropdownOption(value, value));
  }
  const _handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const _createEvent = async () => {
    if (inputValue.trim().length === 0) return; //blank?
    try {
      const userId = parseInt(dropdownUsersValue?.id ? dropdownUsersValue.id : '0');
      const eventId = parseInt(dropdownEventsValue?.id ? dropdownEventsValue.id : '0');
      if (userId < 1 || eventId < 1) return
      const response = await api.event.addEventByEvent(eventId, inputValue, userId, false);
      if (response.status === 201) {
        if (onSubmit) onSubmit();
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }
  return (
    <Content className={styles.eventcreation__content}>
      <div className={styles.event_form}>
        <div className={styles.event_form_item}>
          <Input type="text" placeholder="Введите название мероприятия" value={inputValue} onChange={_handleChangeText} />
        </div>
        <div className={styles.event_form_item}>
          <Dropdown
            placeholder="Выберите главного организатора"
            items={dropdownUsersValues}
            value={dropdownUsersValue}
            toText={(input: DropdownOption<string>) => { return input.value }}
            onChange={(value) => _handleChangeUsersDropdown(value as any)}
          />
        </div>
        <div className={styles.event_form_item}>
          <Dropdown
            placeholder="Выберите мероприятие"
            items={dropdownEventsValues}
            value={dropdownEventsValue}
            toText={(input: DropdownOption<string>) => { return input.value }}
            onChange={(value) => _handleChangeEventsDropdown(value as any)}
          />
        </div>
        <div className={styles.event_form_button}>
          <Button onClick={_createEvent}>Создать</Button>
        </div>
      </div>
    </Content>
  );
}

export default EventCreationDialog2;
