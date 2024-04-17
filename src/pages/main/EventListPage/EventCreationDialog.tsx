import Content from '@widgets/main/Content';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { useState, useContext, ChangeEvent, useEffect } from "react";
import ApiContext from '@features/api-context';
import styles from './dialog.module.css';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';
import { eventService } from '@features/event-service';

function EventCreationDialog({onSubmit = null} : {onSubmit: (() => void) | null}) {
  const {api} = useContext(ApiContext);
  const [inputValue, setInputValue] = useState('');
  const [dropdownValues, setDropdownValues] = useState<DropdownOption<string>[]>([]);
  const [dropdownValue, setDropdownValue] = useState<DropdownOption<string> | undefined>();
  useEffect(() => {
    try {
      const fetchUsers = async() => {
        const {total, items} = await eventService.getUsers(api);
        if (total&&total>0&&items)  {
          items.sort((a, b) => (a.id?a.id:0) - (b.id?b.id:0));
          const values: DropdownOption<string>[] = [];
          items.forEach(user => {
            values.push(new DropdownOption(user.id+'. '+user.name+' '+user.surname+' ('+user.login+')',(user.id?user.id:0).toString()));
          });
          setDropdownValues(values);
          setDropdownValue(values[0]);
        }
      }
      fetchUsers();}
    catch (e) {
      console.error(e);
    }
  }, []);
  const _handleChangeDropdown = (value: DropdownOption<string>) => {
    setDropdownValue(value);
  }
  const _handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const  _createEvent = async() => {
    if (inputValue.trim().length === 0) return; //blank?
    try {
      const userId = parseInt(dropdownValue?.id?dropdownValue.id:'0');
      if (userId<1) return
      const success = await eventService.createEvent(api,inputValue,userId);
      if (success&&onSubmit) onSubmit();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }
  return (
    <Content>
          <div className={styles.event_form}>
            <div className={styles.event_form_item}>
              <Input type="text" placeholder="Введите название мероприятия" value={inputValue} onChange={_handleChangeText}/>
            </div>
            <div className={styles.event_form_item}>
              <Dropdown
                placeholder="Выберите главного организатора"
                items={dropdownValues}
                value={dropdownValue}
                toText={(input: DropdownOption<string>) => {return input.value}}
                onChange={(value) =>_handleChangeDropdown(value)}
              />
            </div>
            <div className={styles.event_form_button}>
              <Button onClick={_createEvent}>Создать</Button>
            </div>
          </div>
        </Content>
  );
}

export default EventCreationDialog;
