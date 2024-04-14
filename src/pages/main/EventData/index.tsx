import { uid } from 'uid';
import { useContext, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, { PageTab } from "@widgets/main/PageTabs";
import { RouteParams, RoutePaths } from "@shared/config/routes";
import Button from "@widgets/main/Button";
import { hasAnyPrivilege } from "@features/privileges.ts";
import { PrivilegeNames } from "@shared/config/privileges.ts";
import { useNavigate, useParams } from "react-router-dom";
import { appendClassName } from "@shared/util.ts";
import Fade from "@widgets/main/Fade";
import UpdateDialogContent from "./UpdateDialogContext.tsx";
import Dialog from "@widgets/main/Dialog";
import CreateActivityDialog from "./CreateActivityDialog.tsx";
import { Gantt, Task } from 'gantt-task-react';
import { getImageUrl } from '@shared/lib/image.ts';
import ApiContext from '@features/api-context.ts';
import AddOrganizerDialog from '@pages/main/EventData/AddOrganizerDialog.tsx';
import 'gantt-task-react/dist/index.css';
import { EventResponse, ParticipantResponse, TaskResponse } from '@shared/api/generated/index.ts';
import PrivilegeContext from '@features/privilege-context.ts';
import { PrivilegeData } from '@entities/privilege-context.ts';

class EventInfo {
  regDates: string;
  prepDates: string;
  eventDates: string;
  vacantSlots: string;
  place: string;
  format: string;
  ageRestriction?: string;
  status: string;
  eventName: string;
  description: string;

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

class Activity {
  id: string
  activityId: string
  name: string
  place: string
  room: string
  description: string
  date: string
  time: string
  endDate: string
  endTime: string
  constructor(
    activityId: string,
    activityName: string,
    place: string,
    room: string,
    description: string,
    date: string,
    time: string,
    endDate: string,
    endTime: string
  ) {
    this.id = uid();
    this.activityId = activityId;
    this.name = activityName;
    this.place = place;
    this.room = room;
    this.description = description;
    this.date = date;
    this.time = time;
    this.endDate = endDate;
    this.endTime = endTime;
  }
}

class OrgPerson {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;

  constructor(id: string, name: string, surname: string, email: string, role: string) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.role = role;
  }

  public equals(obj: any): boolean {
    return obj && typeof obj === 'object' && obj.id === this.id;
  }
}

class Person {
  id: string;
  name: string;
  email: string;
  info: string;
  visited: boolean;

  constructor(id: string, name: string, email: string, info: string, visited: boolean) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.info = info;
    this.visited = visited;
  }
}

let tasks: Task[] = [
  {
    start: new Date(2024, 1, 1),
    end: new Date(2024, 1, 2),
    name: 'Создать зум',
    id: 'Task 0',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#0069FF', progressSelectedColor: '#0069FF' },
    project: 'sdsd',
    hideChildren: false,
  },
  {
    start: new Date(2024, 1, 3),
    end: new Date(2024, 1, 14),
    name: 'Забронировать аудиторию',
    id: 'Task 2',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#663333', progressSelectedColor: '#663333' },
    project: 'sdsd',
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
    project: 'sdsd',
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
    project: 'sdsd',
  },
  {
    start: new Date(2024, 1, 3),
    end: new Date(2024, 1, 9),
    name: 'Подготовить подарки',
    id: 'Task 4',
    type: 'task',
    progress: 100,
    isDisabled: false,
    styles: { progressColor: '#ff9933', progressSelectedColor: '#ff9933' },
    project: 'sdsd',
  },
];
//ff9933


function readDate(dateTime: string) {
  const date = new Date(dateTime);
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate
}

function getTimeOnly(dateTimeString: string) {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  const timeOnly = `${hours}:${minutes}:${seconds}`;
  return timeOnly;
}

const url_parts: string[] = window.location.href.split('/');
const url_tail: string = url_parts[url_parts.length - 1];

const EVENT_ID: number = url_tail[url_tail.length - 1] == '#' ? +url_tail.split('#')[0] : +url_tail;

function EventActivitiesPage() {
  const { api } = useContext(ApiContext);
  const { privilegeContext, updateEventPrivileges } = useContext(PrivilegeContext);

  const { id } = useParams();
  const [event, setEvent] = useState<EventInfo | undefined>(undefined);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventResponse, setEventResponse] = useState({});

  const [eventTasks, setEventTasks] = useState<TaskResponse[]>([]);
  const [eventTasksPeople, setEventTasksPeople] = useState<peopleTasks[]>([]);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const eventResponse = await api.event.getEventById(parseInt(id ?? '0'));
        if (eventResponse.status === 200) {
          const data = eventResponse.data;
          let placeAddress = 'Отсутствует'
          if (data.placeId) {
            const placeResponse = await api.place.placeGet(data.placeId ?? 0);
            if (placeResponse.status == 200) {
              placeAddress = placeResponse.data.address ?? '';
            } else {
              console.log(placeResponse.status);
            }
          }
          const info = new EventInfo(
            readDate(data.registrationStart) + ' - ' + readDate(data.registrationEnd),
            readDate(data.preparingStart) + ' - ' + readDate(data.preparingEnd),
            readDate(data.startDate) + ' - ' + readDate(data.endDate),
            String(data.participantLimit),
            placeAddress,
            data.format ?? '',
            data.status ?? '',
            data.participantAgeLowest + ' - ' + data.participantAgeHighest,
            data.title ?? '',
            data.fullDescription ?? ''
          );
          setEvent(info);
          setEventResponse(data);
        } else {
          console.error('Error fetching event list:', eventResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching event list:', error);
      }
    };
    getEvent();
    getImageUrl(id!).then((url) => {
      if (url == '') {
        setEventImageUrl('http://s1.1zoom.ru/big7/280/Spain_Fields_Sky_Roads_488065.jpg');
      } else {
        setEventImageUrl(url);
      }
    });
    setLoadingEvent(false);
  },[]);

  useEffect(() => {
    api
      .withReauth(() => api.task.taskListShowInEvent(EVENT_ID))
      .then((response) => {
        if (response.data != undefined) {
          setEventTasks(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const tasksVisible: boolean = PrivilegeNames.VIEW_ALL_EVENT_TASKS in privilegeContext;
  const edit_privilege: boolean = PrivilegeNames.EDIT_EVENT_ACTIVITIES in privilegeContext;
  const add_organizer_privilege: boolean = PrivilegeNames.ASSIGN_ORGANIZER_ROLE in privilegeContext;
  const add_helper_privilege: boolean = PrivilegeNames.ASSIGN_ASSISTANT_ROLE in privilegeContext;
  const add_activity_privilege: boolean = PrivilegeNames.CREATE_EVENT_ACTIVITIES in privilegeContext;
  interface peopleTasks {
    name: string | undefined;
    lastname: string | undefined;
    color: string | undefined;
  }
  const colors: string[] = [
    '#663333',
    '#0069FF',
    '#ff9933',
    '#990066',
    '#006633',
    '#000000',
    '#666600',
    '#336666',
    '#000099',
    '#FF0033',
    '#CCCC00',
    '#CC6666',
  ];
  const peopleForTasks = new Map<number, peopleTasks>();
  useEffect(() => {
    tasks = [];
    let persColor;
    // peopleForTasks.set(1, {
    //   name: "asd",
    //   lastname: "asd",
    //   color: "asd"
    // });
    for (const et of eventTasks) {
      if (
        et.deadline != undefined &&
        et.creationTime != undefined &&
        et.title != undefined &&
        et.id != undefined &&
        et.assignee != undefined &&
        et.assignee.id != undefined
      ) {
        console.log(peopleForTasks);
        if (peopleForTasks.get(et.assignee.id)) {
          persColor = peopleForTasks.get(et.assignee.id)?.color;
        } else {
          const stepColor = colors.shift();
          peopleForTasks.set(et.assignee.id, {
            name: et.assignee.name,
            lastname: et.assignee.surname,
            color: stepColor,
          });
          persColor = stepColor;
        }
        const newTask: Task = {
          start: new Date(et.creationTime),
          end: new Date(et.deadline),
          name: et.title,
          id: '' + et.id,
          type: 'task',
          progress: 100,
          isDisabled: false,
          styles: { progressColor: persColor, progressSelectedColor: persColor },
          hideChildren: false,
        };
        tasks.push(newTask);
        setEventTasksPeople(Array.from(peopleForTasks, ([_, peopleTasks]) => peopleTasks));
      }
    }
  }, eventTasks);

  const [activitiesVisible, setActivitiesVisible] = useState(false);
  const [orgsVisible, setOrgsVisible] = useState(false);

  function _getPrivileges(id: number): Set<PrivilegeData> {
    if (id != null && privilegeContext.isPrivilegesForEventLoaded(id)) {
      return privilegeContext.getPrivilegesForEvent(id)!;
    } else {
      updateEventPrivileges(id);
    }
    return new Set();
  }

  useEffect(() => {
    if (id) {
      const privileges = _getPrivileges(parseInt(id));
      setActivitiesVisible(hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES)])));
      setOrgsVisible(hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS)])));
    }
  }, [privilegeContext]);

  const pageTabs: PageTab[] = [];

  pageTabs.push(new PageTab('Описание'));

  if (activitiesVisible) {
    pageTabs.push(new PageTab('Активности'));
  }

  if (orgsVisible) {
    pageTabs.push(new PageTab('Организаторы'));
  }

  pageTabs.push(new PageTab('Участники'));

  // if (tasksVisible) {
  pageTabs.push(new PageTab('Задачи'));
  //}
  const _editOrgs = () => {
    console.log('editing orgs')
  }

  const _editParticipants = () => {
    console.log('editing participants')
  }
  class DialogData {
    heading: string | undefined;
    visible: DialogSelected;
    args: any;
    constructor(heading?: string, visible: DialogSelected = DialogSelected.NONE, args: any = {}) {
      this.heading = heading;
      this.visible = visible;
      this.args = args;
    }
  }
  const [dialogData, setDialogData] = useState(new DialogData());
  const dialogRef = useRef(null);
  enum DialogSelected {
    NONE,
    UPDATE,
    CREATEACTIVITY = 2,
    ADDORGANIZER = 3,
  }

  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.UPDATE:
        component = (
          <UpdateDialogContent
            {...dialogData.args}
            eventId={parseInt(id!)}
            eventInfo={eventResponse}
            onSubmit={() => {
              _closeDialog();
            }}
          />
        );
        break;
      case DialogSelected.CREATEACTIVITY:
        component = (
          <CreateActivityDialog
            {...dialogData.args}
            parentId={parseInt(id!)}
            onSubmit={() => {
              _closeDialog();
            }}
          />
        );
        break;
      case DialogSelected.ADDORGANIZER:
        component = (
          <AddOrganizerDialog
            {...dialogData.args}
            eventId={parseInt(id!)}
            onSubmit={() => {
              _closeDialog();
            }}
          />
        );
        break;
    }
    return (
      <Dialog
        className={appendClassName(styles.dialog, dialogData.visible ? styles.visible : styles.hidden)}
        text={dialogData.heading}
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {component}
      </Dialog>
    );
  };

  const _closeDialog = () => {
    setDialogData(new DialogData());
  };
  const _updateEvent = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDialogData(new DialogData('Редактирование мероприятия', DialogSelected.UPDATE));
    e.stopPropagation();
  };
  const _addActivity = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDialogData(new DialogData('Создать активность', DialogSelected.CREATEACTIVITY));
    e.stopPropagation();
  };
  function _createInfoPage(eventInfo: EventInfo) {
    return (
      <div className={styles.root}>
        <div className={styles.image_box}>{<img className={styles.image} src={eventImageUrl} alt="Event image" />}</div>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_updateEvent}>
              Редактировать информацию о мероприятии
            </Button>
          </div>
        ) : (
          <></>
        )}

        <div className={styles.info_page}>
          <div className={styles.info_column}>
            <div className={styles.description_box}>
              <div className={styles.field_title}>Информация о мероприятии</div>
              {eventInfo.description}
            </div>
            <div className={styles.description_box}>
              <div className={styles.field_title}>Место проведения</div>
              {eventInfo.place}
            </div>
          </div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Сроки регистрации</td>
                <td>
                  <div>{eventInfo.regDates}</div>
                </td>
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

  const [activities, setActivities] = useState([] as Activity[]);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);
  const getActivities = async () => {
    const response = await api.event.getAllOrFilteredEvents(undefined, undefined, parseInt(id!));
    if (response.status == 200) {
      const items = (response.data ?? []) as EventResponse[];
      const activities = items.map(async (a) => {
        const placeResponse = await api.place.placeGet(a.placeId!);
        let place = '';
        let room = '';
        if (placeResponse.status == 200) {
          const data = placeResponse.data;
          place = data.address ?? '';
          room = data.room ?? '';
        } else {
          console.log(response.status);
        }
        let idString = '';
        if(a.id!=null){
          idString = a.id.toString();
        }
        return new Activity(
          idString,
          a.title ?? '',
          place,
          room,
          a.shortDescription ?? '',
          readDate(a.startDate) ?? '',
          getTimeOnly(a.startDate ?? ''),
          readDate(a.endDate) ?? '',
          getTimeOnly(a.endDate ?? '')
        );
      });
      const activitiesPromise = await Promise.all(activities);
      setActivities(activitiesPromise);
      setActivitiesLoaded(true);
    } else {
      console.log(response.status);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  const navigate = useNavigate();
  const _event = (id:string) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID,id));
    window.location.reload();
  }

  function _createActivity(activity: Activity) {
    return (
      <div key={activity.id} className={styles.activity_container} onClick={()=>_event(activity.activityId)}>
        <div className={styles.activity_info_column}>
          <div className={styles.activity_name}>{activity.name}</div>
          <div className={styles.activity_place_container}>
            <div className={styles.activity_place}>{activity.place}</div>
            <div className={styles.activity_place}>{activity.room}</div>
          </div>
          <div className={styles.info_block}>{activity.description}</div>
        </div>
        {activity.endDate == '' || activity.endDate == activity.date ? (
          <div className={styles.activity_time_column}>
            <div className={styles.activity_time}>{activity.date}</div>
            <div className={styles.activity_time}>
              {activity.time} - {activity.endTime}
            </div>
          </div>
        ) : (
          <div className={styles.activity_time_column}>
            <div>
              {activity.date} {activity.time}
            </div>
            <div>
              {activity.endDate} {activity.endTime}
            </div>
          </div>
        )}
      </div>
    );
  }

  function _createActivityList(activities: Activity[]) {
    const items = [];
    for (const activity of activities) {
      items.push(_createActivity(activity));
    }
    return (
      <>
        {add_activity_privilege ? (
           <div className={styles.button_container}>
             <Button className={styles.button} onClick={_addActivity}>Создать активность</Button>
           </div>
         ) : (<></>)}
        {activitiesLoaded ? (
          <div className={styles.data_list}>
            {items}
          </div>)
          :
          (
            <div />
          )}
      </>
    );
  }
  const _addOrganizer = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setDialogData(new DialogData('Добваить организатора', DialogSelected.ADDORGANIZER));
    e.stopPropagation();
  };

  function createOrgPersonRow(person: OrgPerson) {
    return (
      <tr key={person.id}>
        <td>{person.role}</td>
        <td>{person.surname + ' ' + person.name}</td>
        <td>{person.email}</td>
      </tr>
    );
  }

  function createPersonRow(person: Person) {
    return (
      <tr key={person.id}>
        <td>{person.name}</td>
        <td>{person.email}</td>
        <td>{person.info}</td>
        <td>{person.visited ? 'Да' : 'Нет'}</td>
      </tr>
    );
  }

  function _groupRoles(entries: OrgPerson[]) {
    const users: Map<string, OrgPerson> = new Map<string, OrgPerson>([]);

    for (const user of entries) {
      users.set(user.id, user);
    }

    const userRoles: Map<string, string[]> = new Map<string, string[]>([]);

    for (const user of entries) {
      const roles: string[] = userRoles.get(user.id) ?? [];

      roles.push(user.role);
      userRoles.set(user.id, roles);
    }

    const orgList: OrgPerson[] = [] as OrgPerson[];

    userRoles.forEach((value: string[], key: string) => {
      const org: OrgPerson = users.get(key) ?? new OrgPerson('', '', '', '', '');
      orgList.push(new OrgPerson(org.id, org.name, org.surname, org.email, value.join(', ')));
    });

    return orgList;
  }

  function createOrgsTable(persons: OrgPerson[]) {
    const processedPersons: OrgPerson[] = _groupRoles(persons);

    const items = [];

    for (const person of processedPersons) {
      items.push(createOrgPersonRow(person));
    }

    return (
      <>
        {add_organizer_privilege && add_helper_privilege? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_addOrganizer}>
              Добавить
            </Button>
          </div>
        ) : (
          <></>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Роль</th>
              <th>Имя</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
      </>
    );
  }

  function createParticipantsTable(persons: Person[], edit_func: any) {
    const items = [];
    for (const person of persons) {
      items.push(createPersonRow(person));
    }
    return (
      <>
        {edit_privilege ? (
          <div className={styles.button_container}>
            <Button className={styles.buttonXlsx} onClick={edit_func}>
              Выгрузить xlsx
            </Button>
            <Button className={styles.buttonXlsx} onClick={edit_func}>
              Загрузить xlsx
            </Button>
          </div>
        ) : (
          <></>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Комментарий</th>
              <th>Явка</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </table>
      </>
    );
  }

  const [orgs, setOrgs] = useState([] as OrgPerson[]);

  useEffect(() => {
    if (orgsVisible) {
      api
        .withReauth(() => api.event.getUsersHavingRoles(EVENT_ID))
        .then((response) => {
          const list = response.data.map((user) => {
            return new OrgPerson(
              '' + user.id,
              user.name ?? '',
              user.surname ?? '',
              user.login ?? '',
              user.roleName ?? ''
            );
          });

          setOrgs(list);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  },[]);

  const [participants, setParticipants] = useState([] as Person[]);

  useEffect(() => {
    api
      .withReauth(() => api.participants.getParticipants(EVENT_ID))
      .then((response) => {
        // TODO: don't cast types
        const data = response.data as unknown as ParticipantResponse[];
        const list = data.map((user) => {
          return new Person(
            '' + user.id,
            user.name ?? '',
            user.email ?? '',
            user.additionalInfo ?? '',
            user.visited ?? false
          );
        });
        setParticipants(list);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  },[]);

  const locc = 'cz';

  function _createTasksTable() {
    return (
      <div className={styles.tasks}>
        <Gantt tasks={tasks} listCellWidth={''} locale={locc} />
        <div className={styles.tasks__people}>
          {eventTasksPeople.map((human) => (
            <div key={human.color} className={styles.tasks__human}>
              <span style={{ background: human.color }}></span>
              {human.name} {human.lastname}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [selectedTab, setSelectedTab] = useState('Описание');

  function pageTabHandler(tab_name: string) {
    setSelectedTab(tab_name);
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={'Event'} />
          <div className={styles.tabs}>
            <PageTabs value="Описание" handler={pageTabHandler} items={pageTabs} />
          </div>
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.eventData} />}
      bottomRight={
        <Content>
          <div className={styles.content}>
            {event == null || loadingEvent ? <p></p> : selectedTab == 'Описание' && _createInfoPage(event)}
            {selectedTab == 'Активности' && _createActivityList(activities)}
            {selectedTab == 'Организаторы' && createOrgsTable(orgs)}
            {selectedTab == 'Участники' && createParticipantsTable(participants, () => { })}
            {selectedTab == 'Задачи' && _createTasksTable()}
          </div>
          <Fade className={appendClassName(styles.fade, dialogData.visible ? styles.visible : styles.hidden)}>
            <_Dialog />
          </Fade>
        </Content>
      }
    />
  );
}

export default EventActivitiesPage;
