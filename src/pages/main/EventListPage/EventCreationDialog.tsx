import Content from '@widgets/main/Content';
import Input from '@widgets/main/Input';
import Button from '@widgets/main/Button';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';
import { useState } from 'react';

import styles from './dialog.module.css';

const _test_orgs = [
  new DropdownOption('[408975] Григорьев Георгий Александрович'),
  new DropdownOption('[621304] Ефимов Евгений Николаевич'),
  new DropdownOption('[308820] Васильева Валентина Сергеевна'),
  new DropdownOption('[107589] Лебедев Леонид Петрович'),
];

function EventCreationDialog() {
  const [name, setName] = useState('');

  const _createEvent = () => {
    console.log('creating event! hello');
  };

  return (
    <Content>
      <div className={styles.event_form}>
        <div className={styles.event_form_item}>
          <Input
            type="text"
            placeholder="Введите название мероприятия"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.event_form_item}>
          <Dropdown placeholder="Выберите главного организатора" items={_test_orgs} toText={(e) => e.value} />
        </div>
        <div className={styles.event_form_button}>
          <Button onClick={_createEvent}>Создать</Button>
        </div>
      </div>
    </Content>
  );
}

export default EventCreationDialog;
