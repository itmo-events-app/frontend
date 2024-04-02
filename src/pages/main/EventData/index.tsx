import { uid } from 'uid'
import { useState } from 'react'
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, { PageTab } from "@widgets/main/PageTabs";
import EventHeader, {EventInfo} from "@widgets/main/EventHeader";
import { RoutePaths } from '@shared/config/routes';
import Button from "@widgets/main/Button";


const _eventName: string = "Славянский Зажим: Поединок за Колосом";

const _eventDescription: string = "Присоединяйтесь к нам на захватывающий славянский мукамольный турнир, где лучшие мукамолы из разных уголков земли сойдутся в смешных и острых схватках за звание Короля (или Королевы) Муки! Участники будут соревноваться в различных видах муканья, в том числе в муканье кукурузы, муканье муки через сито, а также в конкурсе на самый оригинальный муканьяльный костюм. Вас ждут веселые призы и масса улыбок! Приходите и окунитесь в мир старинных славянских традиций!";

const _eventInfo: EventInfo = new EventInfo(
  "01.06.2024 - 10.06.2024",
  "05.06.2024 - 11.06.2024",
  "11.06.2024 - 19.06.2024",
  "100",
  "Кронверкский проспект 49",
  "Очный",
  "Активное"
);

class Activity {
  id: string
  name: string
  place: string
  room: string
  description: string
  date: string
  time: string

  constructor(
    activityName: string,
    place: string,
    room: string,
    description: string,
    date: string,
    time: string
  ) {
    this.id = uid();
    this.name = activityName;
    this.place = place;
    this.room = room;
    this.description = description;
    this.date = date;
    this.time = time;
  }
}

class Person {
  id: string
  name: string
  email: string

  constructor(
    name: string,
    email: string,
  ) {
    this.id = uid();
    this.name = name;
    this.email = email;
  }
}

const _activities: Activity[] = [
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00"),
  new Activity("Самый красивый колос",
    "Кронверкский пр. 49",
    "Ауд. 1265",
    "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
    "11.06.2024",
    "15:30 - 17:00")
]

const _members: Person[] = [
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  )
]

const _orgs: Person[] = [
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
  new Person(
    "Курочкина Дарья Сергеевна",
    "example@mail.ru"
  ),
]

const task_privilege: boolean = false;
const edit_privilege: boolean = true;

const _pageTabs: PageTab[] = [
  new PageTab("Описание"),
  new PageTab("Активности"),
  new PageTab("Организаторы"),
  new PageTab("Участники"),
  task_privilege ? new PageTab("Задачи") : undefined
]

function EventActivitiesPage() {

  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _editDescription = () => {
    console.log('editing description')
  }

  const _editActivities = () => {
    console.log('editing activities')
  }

  const _editOrgs = () => {
    console.log('editing orgs')
  }

  const _editParticipants = () => {
    console.log('editing participants')
  }

  const _editEvent= () => {
    console.log('editing event')
  }

  function _createInfoPage(text: string) {
    return (
      <div className={styles.content}>
        {edit_privilege ? (
          <Button onClick={_editDescription}>Редактировать</Button>
        ) : <></>}
        <div className={styles.description_box}>
          {text}
        </div>
      </div>
    );
  }

  function _createActivity(activity: Activity) {
    return (
      <div key={activity.id} className={styles.activity_container}>
        <div className={styles.activity_info_column}>
          <div className={styles.activity_name}>{activity.name}</div>
          <div className={styles.activity_place_container}>
            <div className={styles.activity_place}>{activity.place}</div>
            <div className={styles.activity_place}>{activity.room}</div>
          </div>
          <div className={styles.info_block}>{activity.description}</div>
        </div>
        <div className={styles.activity_time_column}>
          <div className={styles.activity_time}>{activity.date}</div>
          <div className={styles.activity_time}>{activity.time}</div>
        </div>
      </div>
    )
  }

  function _createActivityList(activities: Activity[]) {
    const items = []
    for (const activity of activities) {
      items.push(_createActivity(activity));
    }
    return (
      <div className={styles.content}>
        {edit_privilege ? (
            <Button onClick={_editActivities}>Редактировать</Button>
        ) : <></>}
        <div className={styles.data_list}>
          {items}
        </div>
      </div>
    )
  }

  function _createPersonRow(person: Person) {
    return (
      <tr key={person.id}>
        <td>{person.name}</td>
        <td>{person.email}</td>
      </tr>
    )
  }

  function _createPersonTable(persons: Person[], edit_func: any) {
    const items = []
    for (const person of persons) {
      items.push(_createPersonRow(person));
    }
    return (
      <div className={styles.content}>
        {edit_privilege ? (
          <Button onClick={edit_func}>Редактировать</Button>
        ) : <></>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </table>
      </div>
    )
  }

  const [selectedTab, setSelectedTab] = useState("Описание");

  function pageTabHandler(tab_name: string) {
    setSelectedTab(tab_name);
  }

  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text={_eventName} />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.eventData} />}
      bottomRight=
      {
        <Content>
          <EventHeader eventInfo={_eventInfo} image="http://s1.1zoom.ru/big7/280/Spain_Fields_Sky_Roads_488065.jpg" />
          {edit_privilege ? (
            <div className={styles.edit_button}>
              <Button onClick={_editEvent}>Редактировать информацию о мероприятии</Button>
            </div>
          ) : <></>}
          <PageTabs value="Описание" handler={pageTabHandler} items={_pageTabs}/>
          {selectedTab == "Описание" && _createInfoPage(_eventDescription)}
          {selectedTab == "Активности" && _createActivityList(_activities)}
          {selectedTab == "Организаторы" && _createPersonTable(_orgs, _editOrgs)}
          {selectedTab == "Участники" && _createPersonTable(_members, _editParticipants)}
          {selectedTab == "Задачи" && "ToDo: Страница задач"}
        </Content>
      }
    />
  );
}

export default EventActivitiesPage;
