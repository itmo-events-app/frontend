import {uid} from "uid";
import {useContext, useEffect, useRef, useState} from "react";
import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import Content from "@widgets/main/Content";
import PageTabs, {PageTab} from "@widgets/main/PageTabs";
import {RouteParams, RoutePaths} from "@shared/config/routes";
import Button from "@widgets/main/Button";
import {hasAnyPrivilege} from "@features/privileges.ts";
import {PrivilegeNames} from "@shared/config/privileges.ts";
import {useNavigate, useParams} from "react-router-dom";
import {appendClassName} from "@shared/util.ts";
import Fade from "@widgets/main/Fade";
import UpdateDialogContent from "./UpdateDialogContext.tsx";
import Dialog from "@widgets/main/Dialog";
import CreateActivityDialog from "./CreateActivityDialog.tsx";
import {Gantt, Task} from "gantt-task-react";
import {getImageUrl} from "@shared/lib/image.ts";
import ApiContext from "@features/api-context.ts";
import AddOrganizerDialog from "@pages/main/EventData/AddOrganizerDialog.tsx";

import "gantt-task-react/dist/index.css";
import {
  EventResponse,
  ParticipantPresenceRequest,
  ParticipantResponse,
  SetPartisipantsListRequest,
  TaskResponse
} from '@shared/api/generated/index.ts';
import PrivilegeContext from '@features/privilege-context.ts';
import {PrivilegeData} from '@entities/privilege-context.ts';
import Dropdown from "@widgets/main/Dropdown";
import AddTaskDialog from "@pages/main/EventData/AddTaskDialog";
import UpdateTaskDialog from "@pages/main/EventData/UpdateTaskDialog";


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
  parent: number | undefined;

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
    description: string,
    parent: number|undefined
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
    this.parent = parent;
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

class PersonVisitResponse implements ParticipantPresenceRequest {
  participantId: number;
  isVisited: boolean;

  constructor(participantId: number, isVisited: boolean) {
    this.participantId = participantId;
    this.isVisited = isVisited;
  }
}

enum DialogSelected {
  NONE,
  UPDATE,
  CREATEACTIVITY = 2,
  ADDORGANIZER = 3,
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

class ParticipantsListRequest implements SetPartisipantsListRequest {
  participantsFile: File;

  constructor(file: File) {
    this.participantsFile = file;
  }
}

enum VisitStatusList {
  TRUE = 'Да',
  FALSE = 'Нет'
}

const userVisitStatus = Object.values(VisitStatusList);

type OptionsPrivileges = {
  activitiesVisible: boolean,
  orgsVisible: boolean,
  modifyVisitStatus: boolean,
  exportParticipants: boolean,
  importParticipants: boolean,
  tasksVisible: boolean,
  edit: boolean,
  addOrganizer: boolean,
  addHelper: boolean,
  addActivity: boolean,
  createTask: boolean
}

const optionsPrivilegesInitial: OptionsPrivileges = {
  activitiesVisible: false,
  orgsVisible: false,
  modifyVisitStatus: false,
  exportParticipants: false,
  importParticipants: false,
  tasksVisible: false,
  edit: false,
  addOrganizer: false,
  addHelper: false,
  addActivity: false,
  createTask: false
} as const;

interface PeopleTasks {
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

function readDate(dateTime: string | null | undefined) {
  if(dateTime==undefined || dateTime=="" || dateTime==null){
    return "";
  }
  const date = new Date(dateTime);
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate
}

function getIntervalString(start: string | null | undefined, end: string | null | undefined) {
  if (start == null || end == null) {
    return '';
  } else {
    return readDate(start) + ' - ' + readDate(end);
  }
}


function getTimeOnly(dateTimeString: string) {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  const timeOnly = `${hours}:${minutes}:${seconds}`;
  return timeOnly;
}




function EventActivitiesPage() {
  const { api } = useContext(ApiContext);
  const navigate = useNavigate();

  const { privilegeContext, updateEventPrivileges } = useContext(PrivilegeContext);

  const { id } = useParams();
  const [idInt, setIdInt] = useState<number | null>(null)
  const [event, setEvent] = useState<EventInfo | undefined>(undefined);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventResponse, setEventResponse] = useState({});

  const [eventTasks, setEventTasks] = useState<TaskResponse[]>([]);
  const [eventTasksPeople, setEventTasksPeople] = useState<PeopleTasks[]>([]);

  const [optionsPrivileges, setOptionsPrivileges] = useState<OptionsPrivileges>(optionsPrivilegesInitial);
  const [tasks, setTasks] = useState([] as Task[]);

  const [pageTabs, setPageTabs] = useState<PageTab[]>([]);

  const [dialogData, setDialogData] = useState(new DialogData());
  const dialogRef = useRef(null);

  const [activities, setActivities] = useState([] as Activity[]);
  const [activitiesLoaded, setActivitiesLoaded] = useState(false);

  const [visitStatus, setVisitStatus] = useState(new Map<string, VisitStatusList>([]));

  const [orgs, setOrgs] = useState([] as OrgPerson[]);
  const [participants, setParticipants] = useState([] as Person[]);

  const [selectedTab, setSelectedTab] = useState('Описание');

  const [reloadPage, setReloadPage] = useState(0);

  useEffect(() => {
    if (id) {
      setIdInt(parseInt(id));
    }
  }, [id])

  useEffect(() => {
    if (idInt == null) {
      return;
    }

    const getEvent = async () => {
      try {
        const eventResponse = await api.withReauth(() => api.event.getEventById(idInt));
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
          let parent = undefined;
          if(data.parent){
            parent = data.parent;
          }
          const info = new EventInfo(
            getIntervalString(data.registrationStart, data.registrationEnd),
            getIntervalString(data.preparingStart, data.preparingEnd),
            getIntervalString(data.startDate, data.endDate),
            String(data.participantLimit),
            placeAddress,
            data.format ?? '',
            data.status ?? '',
            data.participantAgeLowest + ' - ' + data.participantAgeHighest,
            data.title ?? '',
            data.fullDescription ?? '',
            parent
          );
          setEvent(info);
          setEventResponse(data);
        } else {
          console.error('Error fetching event list:', eventResponse.statusText);

        }
      } catch (error: any) {
        if (error.response.status == 404) {
          navigate(RoutePaths.notFound);
          return;
        }
        console.error('Error fetching event list:', error);
      }
    };
    getEvent();
    getImageUrl(String(idInt)).then((url) => {
      if (url == '') {
        setEventImageUrl('http://s1.1zoom.ru/big7/280/Spain_Fields_Sky_Roads_488065.jpg');
      } else {
        setEventImageUrl(url);
      }
    });
    setLoadingEvent(false);
  }, [idInt]);

  useEffect(() => {
    if (idInt == null) {
      return;
    }
    api
      .withReauth(() => api.task.taskListShowInEvent(idInt))
      .then((response) => {
        if (response.data != undefined) {
          setEventTasks(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, [idInt]);


  useEffect(() => {
    const peopleForTasks = new Map<number, PeopleTasks>();
    const curTasks = [];
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
        curTasks.push(newTask);
        setEventTasksPeople(Array.from(peopleForTasks, ([_, peopleTasks]) => peopleTasks));
        setTasks(curTasks);
      }
    }
  }, [eventTasks]);

  function _getPrivileges(id: number): Set<PrivilegeData> {
    if (id != null && privilegeContext.isPrivilegesForEventLoaded(id)) {
      return privilegeContext.getPrivilegesForEvent(id)!;
    } else {
      updateEventPrivileges(id);
    }
    return new Set();
  }

  useEffect(() => {
    if (idInt != null) {
      const privileges = _getPrivileges(idInt);
      setOptionsPrivileges({
        activitiesVisible: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.VIEW_EVENT_ACTIVITIES)])),
        orgsVisible: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.VIEW_ORGANIZER_USERS)])),
        modifyVisitStatus: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.WORK_WITH_PARTICIPANT_LIST)])),
        exportParticipants: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.EXPORT_PARTICIPANT_LIST_XLSX)])),
        importParticipants: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.IMPORT_PARTICIPANT_LIST_XLSX)])),
        tasksVisible: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENT_TASKS)])),
        edit: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.EDIT_EVENT_INFO)])),
        addOrganizer: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.ASSIGN_ORGANIZER_ROLE)])),
        addHelper: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.ASSIGN_ASSISTANT_ROLE)])),
        addActivity: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_EVENT_ACTIVITIES)])),
        createTask: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.CREATE_TASK)])),
      })
    } else {
      setOptionsPrivileges(optionsPrivilegesInitial)
    }
  }, [idInt, privilegeContext]);

  useEffect(() => {
    const tabs = [];

    tabs.push(new PageTab('Описание'));


    if (optionsPrivileges.activitiesVisible) {
      tabs.push(new PageTab('Активности'));
    }

    if (optionsPrivileges.orgsVisible) {
      tabs.push(new PageTab('Организаторы'));
    }

    tabs.push(new PageTab('Участники'));

    if (optionsPrivileges.tasksVisible) {
      tabs.push(new PageTab('Задачи'));
    }

    setPageTabs(tabs);
  }, [optionsPrivileges])


  const _Dialog = () => {
    let component = <></>;
    switch (dialogData.visible) {
      case DialogSelected.UPDATE:
        component = (
          <UpdateDialogContent
            {...dialogData.args}
            eventId={idInt}
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
            parentId={idInt}
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
            eventId={idInt}
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
        {optionsPrivileges.edit ? (
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

  const getActivities = async (id: number) => {
    const response = await api.event.getAllOrFilteredEvents(undefined, undefined, id);
    if (response.status == 200) {
      const items = (response.data.items ?? []) as EventResponse[];
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
        if (a.id != null) {
          idString = a.id.toString();
        }
        return new Activity(
          idString,
          a.title ?? '',
          place,
          room,
          a.shortDescription ?? '',
          a.startDate ? readDate(a.startDate) : '',
          a.startDate ? getTimeOnly(a.startDate) : '',
          a.endDate ? readDate(a.endDate) : '',
          a.endDate ? getTimeOnly(a.endDate) : ''
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
    if (idInt != null) {
      getActivities(idInt);
    }
  }, [idInt]);

  const _event = (id: string) => {
    navigate(RoutePaths.eventData.replace(RouteParams.EVENT_ID, id));
    setTimeout(() => { location.reload() }, 500);
  }

  function _createActivity(activity: Activity) {
    return (
      <div key={activity.id} className={styles.activity_container} onClick={() => _event(activity.activityId)}>
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
        {optionsPrivileges.addActivity ? (
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
    setDialogData(new DialogData('Добавить организатора', DialogSelected.ADDORGANIZER));
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
        {optionsPrivileges.modifyVisitStatus ?
          (
            <td>
              <Dropdown
                placeholder="Явка"
                items={userVisitStatus}
                value={visitStatus.get(person.id)}
                onChange={(status) => {
                  setVisitStatus(visitStatus.set(person.id, status));
                  setReloadPage(reloadPage + 1);

                  if (id) {
                    api
                      .withReauth(() => api.participants.changePresence(idInt!,
                        new PersonVisitResponse(+person.id, visitStatus.get(person.id) === VisitStatusList.TRUE)))
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }}
                toText={(input: string) => {
                  return input;
                }}
              />
            </td>
          ) : (
            <td>{person.visited ? 'Да' : 'Нет'}</td>
          )
        }
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
        {optionsPrivileges.addOrganizer && optionsPrivileges.addHelper ? (
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

  function export_xlsx() {
    if (idInt != null) {
      api
        .withReauth(() => api.participants.getParticipantsXlsxFile(idInt))
        // Yars: TODO check if something is needed here
        .catch((error) => {
          console.log(error);
        });
    }
  }


  function handleFileChange(event: any) {
    event.preventDefault();

    if (optionsPrivileges.importParticipants && idInt != null) {
      api.participants
        .setPartisipantsList(
          idInt!,
          new ParticipantsListRequest(event.target.files[0] ?? new File([], '')),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data; boundary=AaBbCc'
            }
          }
        )
        .then((response) => {
          console.log(response);
          setReloadPage(reloadPage + 1);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }

  function createParticipantsTable(persons: Person[]) {
    const items = [];
    for (const person of persons) {
      items.push(createPersonRow(person));
    }
    return (
      <>
        {(optionsPrivileges.exportParticipants || optionsPrivileges.importParticipants) ?
          (
            <div className={styles.button_container}>
              {optionsPrivileges.exportParticipants ?
                (
                  <Button className={styles.buttonXlsx} onClick={export_xlsx}>
                    Скачать xlsx
                  </Button>
                 ) : (
                  <></>
                )
              }
              {optionsPrivileges.importParticipants ?
                (
                  <>
                    <label className={styles.file_input} htmlFor="uploadParticipants">Загрузить xlsx</label>
                    <input
                      className={styles.file_input_actual}
                      type="file"
                      name="participantsFile"
                      id="uploadParticipants"
                      onChange={handleFileChange}
                    />
                  </>
                ) : (
                  <></>
                )
              }
            </div>
          ) : (
            <></>
          )
        }
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

  useEffect(() => {
    if (optionsPrivileges.orgsVisible && idInt != null) {
      api
        .withReauth(() => api.event.getUsersHavingRoles(idInt))
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
  }, [optionsPrivileges, idInt]);

  useEffect(() => {
    if (idInt != null) {
      api
        .withReauth(() => api.participants.getParticipants(idInt))
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
    }
  }, [idInt, reloadPage]);

  const locc = 'cz';

  // async function _getUserData() {
  //   try {
  //     // Вызываем функцию getUserInfo, чтобы получить данные о пользователе
  //     const userInfo = await profileService.getUserInfo(api);
  //     //let userId;
  //
  //     // Проверяем, что данные успешно получены
  //     if (userInfo) {
  //       //userId = userInfo.userId;
  //       // Выводим данные о пользователе
  //       console.log(idInt);
  //     } else {
  //       // Обработка ситуации, если данные не были получены
  //       console.log("Данные о пользователе недоступны");
  //     }
  //   } catch (error) {
  //     // Обработка ошибок, возникших при получении данных о пользователе
  //     console.error("Ошибка при получении данных о пользователе:", error);
  //   }
  //
  // }
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);


  const openModalCreate = () => {
    setCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    setCreateModalOpen(false);
    refetch();
  };

  const openModalUpdate = () => {
    setUpdateModalOpen(true);
  };

  const closeModalUpdate = () => {
   setUpdateModalOpen(false);
    refetch()
  };

  const _onCreate = () => {
    openModalCreate();
  };

  const _onUpdate = () => {
    openModalUpdate();
  };

  function _createTasksTable() {
    return (
      <>
      <div className={styles.tasks}>
        {optionsPrivileges.createTask ? (
          <div className={styles.button_container}>
            <Button className={styles.button} onClick={_onCreate}>
              Создать
            </Button>
            <Button className={styles.button} onClick={_onUpdate}>
              Изменить / Удалить
            </Button>
          </div>
        ) : (
          <></>
        )}
        {
          tasks.length > 0 ?
            <Gantt tasks={tasks} listCellWidth={''} locale={locc} />
            : <></>
        }
        <div className={styles.tasks__people}>
          {eventTasksPeople.map((human) => (
            <div key={human.color} className={styles.tasks__human}>
              <span style={{ background: human.color }}></span>
              {human.name} {human.lastname}
            </div>
          ))}
        </div>
      </div>
        {isCreateModalOpen && <AddTaskDialog idInt={idInt} onClose={closeModalCreate}/>}
        {isUpdateModalOpen && <UpdateTaskDialog idInt={idInt} onClose={closeModalUpdate}/>}
      </>
    );
  }



  function pageTabHandler(tab_name: string) {
    setSelectedTab(tab_name);
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={event?.eventName ?? ''} />
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
            {selectedTab == 'Участники' && createParticipantsTable(participants)}
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
