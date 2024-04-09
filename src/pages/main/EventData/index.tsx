import { uid } from 'uid'
import { useEffect, useState } from "react";
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, { PageTab } from "@widgets/main/PageTabs";
import { RoutePaths } from '@shared/config/routes';
import Button from "@widgets/main/Button";
import { useParams } from "react-router-dom";


class EventInfo {
  regDates: string
  prepDates: string
  eventDates: string
  vacantSlots: string
  place: string
  format: string
  ageRestriction?: string
  status: string
  eventName: string
  description: string

  constructor(
    regDates: string,
    prepDates: string,
    eventDates: string,
    vacantSlots: string,
    place: string,
    format: string,
    status: string,
    ageRestriction: string,
    eventName: string,
    description: string
  ) {
    this.regDates = regDates;
    this.prepDates = prepDates;
    this.eventDates = eventDates;
    this.vacantSlots = vacantSlots;
    this.place = place;
    this.format = format;
    this.ageRestriction = ageRestriction;
    this.status = status;
    this.eventName = eventName;
    this.description = description;
  }
}

const _eventInfo: EventInfo = new EventInfo(
  "01.06.2024 - 10.06.2024",
  "05.06.2024 - 11.06.2024",
  "11.06.2024 - 19.06.2024",
  "100",
  "Кронверкский проспект 49",
  "Очный",
  "Активное",
  "16+",
  "Славянский Зажим: Поединок за Колосом",
  "Присоединяйтесь к нам на захватывающий славянский мукамольный турнир, где лучшие мукамолы из разных уголков земли сойдутся в смешных и острых схватках за звание Короля (или Королевы) Муки! Участники будут соревноваться в различных видах муканья, в том числе в муканье кукурузы, муканье муки через сито, а также в конкурсе на самый оригинальный муканьяльный костюм. Вас ждут веселые призы и масса улыбок! Приходите и окунитесь в мир старинных славянских традиций!"
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

const task_privilege: boolean = true;
const edit_privilege: boolean = true;

const _pageTabs: PageTab[] = [
  new PageTab("Описание"),
  new PageTab("Активности"),
  new PageTab("Организаторы"),
  new PageTab("Участники"),
  task_privilege ? new PageTab("Задачи") : undefined
]

function EventActivitiesPage() {
  const { id } = useParams();
  useEffect(() => {
    console.log(id);
  }, []);
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

  const _editEvent = () => {
    console.log('editing event')
  }

  function _createInfoPage(eventInfo: EventInfo) {
    return (
      <>
        <div className={styles.image_box}>
          <img className={styles.image} src="http://s1.1zoom.ru/big7/280/Spain_Fields_Sky_Roads_488065.jpg" alt="Event image" />
        </div>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_editEvent}>Редактировать информацию о мероприятии</Button>
          </div>
        ) : <></>}
        <div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Сроки регистрации
            </div>
            {eventInfo.regDates}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Сроки подготовки
            </div>
            {eventInfo.prepDates}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Сроки проведения
            </div>
            {eventInfo.eventDates}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Количество мест
            </div>
            {eventInfo.vacantSlots}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Площадка
            </div>
            {eventInfo.place}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Формат проведения
            </div>
            {eventInfo.format}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Статус
            </div>
            {eventInfo.status}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Возрастное ограничение
            </div>
            {eventInfo.ageRestriction}
          </div>
          <div className={styles.description_box}>
            <div className={styles.field_title}>
              Информация о мероприятии
            </div>
            {eventInfo.description}
          </div>
        </div>
      </>
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
      <>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_editActivities}>Редактировать</Button>
          </div>
        ) : <></>}
        <div className={styles.data_list}>
          {items}
        </div>
      </>
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
      <>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={edit_func}>Редактировать</Button>
          </div>
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
      </>
    )
  }
  function _createPersonTableUsers(persons: Person[], edit_func: any) {
    const items = []
    for (const person of persons) {
      items.push(_createPersonRow(person));
    }
    return (
      <>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.buttonXlsx} onClick={edit_func}>Выгрузить xlsx</Button>
            <Button className={styles.buttonXlsx} onClick={edit_func}>Загрузить xlsx</Button>
          </div>
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
      </>
    )
  }

  const [selectedTab, setSelectedTab] = useState("Описание");

  function pageTabHandler(tab_name: string) {
    setSelectedTab(tab_name);
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={_eventInfo.eventName} />
          <div className={styles.tabs}>
            <PageTabs value="Описание" handler={pageTabHandler} items={_pageTabs} />
          </div>
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.eventData} />}
      bottomRight=
      {
        <Content>
          <div className={styles.content}>
            {selectedTab == "Описание" && _createInfoPage(_eventInfo)}
            {selectedTab == "Активности" && _createActivityList(_activities)}
            {selectedTab == "Организаторы" && _createPersonTable(_orgs, _editOrgs)}
            {selectedTab == "Участники" && _createPersonTableUsers(_members, _editParticipants)}
            {selectedTab == "Задачи" && "ToDo: Страница задач"}
          </div>
        </Content>
      }
    />
  );
}

export default EventActivitiesPage;
