import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { DropdownOption } from "@widgets/main/Dropdown";
import { useState, useContext } from "react";
import ApiContext from '@features/api-context';
import { RoutePaths } from '@shared/config/routes';

const _test_orgs = [
  new DropdownOption('[408975] Григорьев Георгий Александрович'),
  new DropdownOption('[621304] Ефимов Евгений Николаевич'),
  new DropdownOption('[308820] Васильева Валентина Сергеевна'),
  new DropdownOption('[107589] Лебедев Леонид Петрович'),
];

function EventCreationPage({contentOnly = false, onSubmit}) {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event) => {
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
        if (contentOnly) onSubmit();
      } else {
        console.error('Error creating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  }
  const content = (
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
  return (
    <>
      {contentOnly ? (
        content
      ) : (
        <Layout
          topLeft={<BrandLogo />}
          topRight={<PageName text="Создание мероприятия" />}
          bottomLeft={<SideBar currentPageURL={RoutePaths.createEvent} />}
          bottomRight={content}
        />
      )}
    </>
  );
}

export default EventCreationPage;
