import { uid } from 'uid'
import { useContext, useEffect, useState } from "react";
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, { PageTab } from "@widgets/main/PageTabs";
import { RoutePaths } from '@shared/config/routes';
import Button from "@widgets/main/Button";
import { api } from "@shared/api";
import { PrivilegeContext, PrivilegeData } from "@features/PrivilegeProvider.tsx";
import { hasAnyPrivilege } from "@features/privileges.ts";
import { PrivilegeNames } from "@shared/config/privileges.ts";
import { Gantt, Task } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

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
  surname: string
  email: string
  role?: string

  constructor(
    name: string,
    surname: string,
    email: string,
    role: string
  ) {
    this.id = uid();
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
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
    "Дарья Сергеевна",
    "Курочкина",
    "example@mail.ru",
    "Организатор"
  )
]

const tasks: Task[] = [
  {
    start: new Date(2024, 1, 1),
    end: new Date(2024, 1, 2),
    name: 'Создать зум',
    id: 'Task 0',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#0069FF', progressSelectedColor: '#0069FF' },
    project: "sdsd",
    hideChildren: false,
    displayOrder: 1,
  },
  {
    start: new Date(2024, 1, 3),
    end: new Date(2024, 1, 14),
    name: 'Забронировать аудиторию',
    id: 'Task 2',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#0069FF', progressSelectedColor: '#0069FF' },
    project: "sdsd",
  },
  {
    start: new Date(2024, 1, 2),
    end: new Date(2024, 1, 10),
    name: 'Написать программу выступления в зуме',
    id: 'Task 3',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#0069FF', progressSelectedColor: '#0069FF' },
    project: "sdsd",
    dependencies: ["Task 0"],
    displayOrder: 2,
  },
  {
    start: new Date(2024, 1, 11),
    end: new Date(2024, 1, 16),
    name: 'Тестовый прогон',
    id: 'Task 4',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#0069FF', progressSelectedColor: '#0069FF' },
    project: "sdsd",
    dependencies: ["Task 3"],
    displayOrder: 3,
  },
];

const edit_privilege: boolean = false;

const EVENT_ID: number = 1;

function EventActivitiesPage() {

  const { privilegeContext } = useContext(PrivilegeContext);

  const activitiesVisible: boolean = hasAnyPrivilege(privilegeContext._eventPrivileges.get(EVENT_ID), new Set([
    new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES)
  ]));

  const orgsVisible: boolean = hasAnyPrivilege(privilegeContext._eventPrivileges.get(EVENT_ID), new Set([
    new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS)
  ]));

  const tasksVisible: boolean = hasAnyPrivilege(privilegeContext._eventPrivileges.get(EVENT_ID), new Set([
    new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENT_TASKS)
  ]));

  const pageTabs: PageTab[] = []

  pageTabs.push(new PageTab("Описание"));

  if (activitiesVisible) {
    pageTabs.push(new PageTab("Активности"));
  }

  if (orgsVisible) {
    pageTabs.push(new PageTab("Организаторы"));
  }

  pageTabs.push(new PageTab("Участники"));

  if (tasksVisible) {
    pageTabs.push(new PageTab("Задачи"));
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
      <div className={styles.root}>
        <div className={styles.image_box}>
          <img className={styles.image} src="http://s1.1zoom.ru/big7/280/Spain_Fields_Sky_Roads_488065.jpg" alt="Event image" />
        </div>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_editEvent}>Редактировать информацию о мероприятии</Button>
          </div>
        ) : <></>}
        <div className={styles.info_page}>
          <div className={styles.info_column}>
            <div className={styles.description_box}>
              <div className={styles.field_title}>
                Информация о мероприятии
              </div>
              {eventInfo.description}
            </div>
            <div className={styles.description_box}>
              <div className={styles.field_title}>
                Место проведения
              </div>
              {eventInfo.place}
            </div>
          </div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Сроки регистрации</td>
                <td>{eventInfo.regDates}</td>
              </tr>
              <tr>
                <td>Сроки проведения</td>
                <td>{eventInfo.eventDates}</td>
              </tr>
              <tr>
                <td>Сроки подготовки</td>
                <td>{eventInfo.prepDates}</td>
              </tr>
              <tr>
                <td>Количество мест</td>
                <td>{eventInfo.vacantSlots}</td>
              </tr>
              <tr>
                <td>Формат проведения</td>
                <td>{eventInfo.format}</td>
              </tr>
              <tr>
                <td>Статус</td>
                <td>{eventInfo.status}</td>
              </tr>
              <tr>
                <td>Возрастное ограничение</td>
                <td>{eventInfo.ageRestriction}</td>
              </tr>
            </tbody>
          </table>
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

  function createPersonRow(person: Person, showRole: boolean) {
    if (!showRole) {
      return (
        <tr key={person.id}>
          <td>{person.surname + " " + person.name}</td>
          <td>{person.email}</td>
        </tr>
      )
    } else {
      return (
        <tr key={person.id}>
          <td>{person.role}</td>
          <td>{person.surname + " " + person.name}</td>
          <td>{person.email}</td>
        </tr>
      )
    }
  }

  function createOrgsTable(persons: Person[], edit_func: any) {
    const items = [];
    for (const person of persons) {
      items.push(createPersonRow(person, true));
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
            <th>Роль</th>
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
      items.push(createPersonRow(person, false));
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

  const [orgs, setOrgs] = useState([] as Person[]);

  useEffect(() => {
    if (orgsVisible) {
      api.withReauth(() => api.event.getUsersHavingRoles(EVENT_ID))
        .then((response) => {
          const list = response.data
            .map((user) => {
              return new Person(
                user.name ?? "",
                user.surname ?? "",
                user.login ?? "",
                user.roleName ?? ""
              );
            })
          setOrgs(list);
        })
        .catch((error) => {
          console.log(error.response.data);
        })
    }
  }, [orgsVisible]);

  function _createTasksTable() {
    return (
      <Gantt tasks={tasks} />
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
          <PageName text={"Event"} />
          <div className={styles.tabs}>
            <PageTabs value="Описание" handler={pageTabHandler} items={pageTabs} />
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
            {selectedTab == "Организаторы" && createOrgsTable(orgs, _editOrgs)}
            {selectedTab == "Участники" && _createPersonTableUsers(_members, _editParticipants)}
            {selectedTab == "Задачи" && _createTasksTable()}
          </div>
        </Content>
      }
    />
  );
}

export default EventActivitiesPage;
