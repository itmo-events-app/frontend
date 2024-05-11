import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import Content from "@widgets/main/Content";
import SideBar from "@widgets/main/SideBar";
import Button from "@widgets/main/Button";
import Dropdown, {DropdownOption} from "@widgets/main/Dropdown";
import {RoutePaths} from "@shared/config/routes";
import {FC, ReactNode, useContext, useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {taskService} from "@features/task-service.ts";
import {format} from "date-fns";
import {ru} from "date-fns/locale/ru";
import {FileDataResponse, TaskResponse, TaskResponseTaskStatusEnum} from "@shared/api/generated";
import ApiContext from "@features/api-context";
import {useNavigate} from "react-router-dom";
import Popup from "reactjs-popup";
import PageTabs, {PageTab} from "@widgets/main/PageTabs";
import Pagination, {PageEntry, PageProps} from "@widgets/main/PagedList/pagination";
import {hasAnyPrivilege} from "@features/privileges.ts";
import {PrivilegeData} from "@entities/privilege-context.ts";
import {PrivilegeNames} from "@shared/config/privileges.ts";
import PrivilegeContext from "@features/privilege-context.ts";

const newTaskOptions: DropdownOption<string>[] = [
  new DropdownOption("Новое"),
  new DropdownOption("В работе"),
  new DropdownOption("Выполнено"),
  new DropdownOption("Просрочено"),
];

type FilterType = {
  eventId: string | undefined,
  activityId: string | undefined,
  expired: boolean,
  [key: string]: string | boolean | undefined;
}

const initialFilters: FilterType = {
  eventId: undefined,
  activityId: undefined,
  expired: false,
};

const statusTranslation: Record<string, string> = {
  NEW: "Новое",
  IN_PROGRESS: "В работе",
  EXPIRED: "Просрочено",
  DONE: "Выполнено",
};

const statusColorClass: Record<string, string> = {
  "Новое": styles.color_blue,
  "В работе": styles.color_blue,
  "Просрочено": styles.color_red,
  "Выполнено": styles.color_lime,
};

type TaskTableRowProps = {
  taskId: number;
  title: string;
  description: string;
  deadline: string;
  assigneeName: string;
  eventId: number;
  eventName?: string;
  taskStatus: TaskResponseTaskStatusEnum;
  activityTitle?: string;
  activityId?: number;
  files?: FileDataResponse[];
}

type OptionsPrivileges = {
  changeTaskStatus: boolean,
}

const optionsPrivilegesInitial: OptionsPrivileges = {
  changeTaskStatus: false,
} as const;

const TaskTableRow: FC<TaskTableRowProps> = ({
                                               taskId,
                                               title,
                                               description,
                                               deadline,
                                               assigneeName,
                                               eventId, eventName,
                                               taskStatus,
                                               activityTitle,
                                               activityId, files
                                             }) => {
  const [selectedStatus, setStatus] = useState<DropdownOption<string> | undefined>();
  const [idInt] = useState<number>(eventId)

  const navigate = useNavigate();

  const {privilegeContext, updateEventPrivileges} = useContext(PrivilegeContext);
  const [optionsPrivileges, setOptionsPrivileges] = useState<OptionsPrivileges>(optionsPrivilegesInitial);

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
        changeTaskStatus: hasAnyPrivilege(privileges, new Set([new PrivilegeData(PrivilegeNames.CHANGE_ASSIGNED_TASK_STATUS)])),
      })
    } else {
      setOptionsPrivileges(optionsPrivilegesInitial)
    }
  }, [idInt, privilegeContext]);

  const {api} = useContext(ApiContext);

  const {mutate: updateTaskStatus} = useMutation({
    mutationFn: taskService.updateTaskStatus(api),
    mutationKey: ["updateTaskStatus"],
  });

  const redirectToEvent = (id: number) => {
    const path = `/events/${id}`;
    navigate(path);
  };
  const status = selectedStatus?.value ? selectedStatus?.value : statusTranslation[taskStatus];
  return (
    <tr>
      <td>{title}</td>
      <td>
        <Popup
          trigger={
            <div>
              {description!.slice(0, 20)}
              {description!.length! > 20 && <span>...</span>}
            </div>
          }
          modal
          nested
        >
          {
            ((close: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined) => (
              <div className={styles.popup__wrapper}>
                <div className={styles.popupContentBold}>
                  {title}
                  <br/>
                </div>
                <div className={`${styles.popupContent} ${styles.bold}`}>Описание:</div>
                <div className={styles.popupContent}>{description}</div>
                <div className={`${styles.popupContent} ${styles.bold}`}>Статус:</div>
                {optionsPrivileges.changeTaskStatus ? (
                  <Dropdown
                    placeholder={statusTranslation[taskStatus]}
                    items={newTaskOptions}
                    toText={(item) => item.value}
                    value={selectedStatus}
                    onChange={(sel) => {
                      updateTaskStatus({newStatus: sel.value, id: taskId});
                      setStatus(sel);
                    }}
                  />
                ) : (
                  <>{statusTranslation[taskStatus]}</>
                )}
                <div className={styles.popupButton}>
                  <Button onClick={close}>Скрыть</Button>
                </div>
              </div>
            )) as unknown as ReactNode
          }
        </Popup>
      </td>
      <td>
        {format(deadline, "H:mm")} <br/>
        {format(deadline, "do MMMM, yyyy", {locale: ru})}
      </td>
      <td>{assigneeName}</td>
      <td>
        <div onClick={() => redirectToEvent(eventId)}>{eventName}</div>
      </td>
      <td>{activityId ?
        <div style={{cursor: 'pointer'}} onClick={() => redirectToEvent(activityId)}>{activityTitle}</div> :
        <div>-</div>}</td>
      <td>
        <Popup
          trigger={
            <div className={statusColorClass[status]}>{status}</div>
          }
          modal
          nested
        >
          {
            ((close: ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined) => (
              <div className={styles.popup__wrapper}>
                <div className={styles.popupContentBold}>
                  {title}
                  <br/>
                </div>
                <div className={`${styles.popupContent} ${styles.bold}`}>Описание:</div>
                <div className={styles.popupContent}>{description}</div>
                <div className={`${styles.popupContent} ${styles.bold}`}>Статус:</div>
                {optionsPrivileges.changeTaskStatus ? (
                  <Dropdown
                    placeholder={statusTranslation[taskStatus]}
                    items={newTaskOptions}
                    toText={(item) => item.value}
                    value={selectedStatus}
                    onChange={(sel) => {
                      updateTaskStatus({newStatus: sel.value, id: taskId});
                      setStatus(sel);
                    }}
                  />
                ) : (
                  <>{statusTranslation[taskStatus]}</>
                )}
                <div className={styles.popupButton}>
                  <Button onClick={close}>Скрыть</Button>
                </div>
              </div>
            )) as unknown as ReactNode
          }
        </Popup>
      </td>
      <td>
        {files?.length ? files?.map(file => <div key={file.filename}>
          <a href={file.presignedUrl} download>{file.filename}</a>
          <br/><br/>
        </div>) : <></>}
      </td>
    </tr>
  );
};

const ListWrapper: FC<{ child?: ReactNode[] }> = ({child}) => {
  return <div className={styles.content}>
    <table className={styles.task_table}>
      <thead>
      <tr>
        <th>Название</th>
        <th>Описание</th>
        <th>Дедлайн</th>
        <th>Исполнитель</th>
        <th>Мероприятие</th>
        <th>Активность</th>
        <th>Статус</th>
        <th>Файлы</th>
      </tr>
      </thead>
      <tbody>
      {child}
      </tbody>
    </table>
  </div>
}

const taskResponsesToPageEntries = (tasks: TaskResponse[]) => {
  return tasks.map((task) => {
    return new PageEntry(() => {
      return (
        <TaskTableRow key={task.id}
                      taskId={Number(task.id)} title={String(task.title)} description={task.description || ""}
                      deadline={task.deadline || ""}
                      assigneeName={`${task.assignee?.name} ${task.assignee?.surname}`}
                      eventId={Number(task.event?.eventId)}
                      activityId={Number(task.event?.activityId)}
                      eventName={task.event?.eventTitle}
                      taskStatus={task.taskStatus as TaskResponseTaskStatusEnum}
                      activityTitle={task.event?.activityTitle}
                      files={task.fileData}/>);
    });
  })
}


type ActivityTasks = {
  activity: DropdownOption<string>,
  tasks: TaskResponse[],
}
type EventActivities = {
  event: DropdownOption<string>,
  activities: ActivityTasks[],
  tasks: TaskResponse[],
}

function TaskListPage() {
  const {api} = useContext(ApiContext);

  //tabs
  const pageTabs: PageTab[] = [];
  pageTabs.push(new PageTab("Текущие"));
  pageTabs.push(new PageTab("Прошедшие"));
  const [selectedTab, setSelectedTab] = useState(pageTabs[0].text);
  const [pageProps, setPageProps] = useState<PageProps>({page: 1, size: 5, total: 0});
  const [itemList, setItemList] = useState<PageEntry[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<EventActivities[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DropdownOption<string> | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<DropdownOption<string> | undefined>();
  let allTasks: TaskResponse[] = [];
  const fetchFirstData = async () => {
    try {
      const tempAllTasks = await taskService.getAllTasks(api)();
      const result: EventActivities[] = [];
      tempAllTasks.forEach(task => {
        let eventActivities: EventActivities | undefined = result.find(eventDropdown => eventDropdown.event.id === task.event?.eventId?.toString());
        if (!eventActivities && task.event && task.event.eventId) {
          const event = new DropdownOption<string>(task.event.eventTitle ? task.event.eventTitle : "", task.event.eventId.toString())
          eventActivities = {event: event, activities: [], tasks: []};
          result.push(eventActivities);
        }
        if (task.event?.activityId) {
          let activityTasks: ActivityTasks | undefined = eventActivities?.activities.find(activityDropdown => activityDropdown.activity.id === task.event?.activityId?.toString());
          if (!activityTasks && task.event && task.event.activityId) {
            const activity = new DropdownOption<string>(task.event.activityTitle ? task.event.activityTitle : "", task.event.activityId.toString())
            activityTasks = {activity: activity, tasks: []};
            eventActivities?.activities.push(activityTasks);
          }
          activityTasks?.tasks.push(task);
        } else {
          eventActivities?.tasks.push(task);
        }
      });
      allTasks = tempAllTasks;
      setDropdownOptions(result);
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
  }

  const [filters, setFilters] = useState(initialFilters);
  const getTaskList = async (page: number = 1, size: number = 15) => {
    try {
      await fetchFirstData();
      let filteredTasks: TaskResponse[] = [];
      if (filters.eventId) {
        for (const eventActivities of dropdownOptions) {
          if (filters.activityId) {
            const activityTasks = eventActivities.activities.find(activityTasks => activityTasks.activity.id === filters.activityId);
            if (activityTasks) {
              filteredTasks.push(...activityTasks.tasks);
              break;
            }
          } else {
            if (eventActivities.event.id === filters.eventId) {
              eventActivities.activities.forEach(activityTasks => {
                filteredTasks.push(...activityTasks.tasks);
              });
              filteredTasks.push(...eventActivities.tasks);
            }
          }
        }
      } else filteredTasks = allTasks;
      filteredTasks = filteredTasks.filter((task) => ((task.taskStatus === TaskResponseTaskStatusEnum.Expired) === filters.expired));
      const total = filteredTasks.length;
      filteredTasks = filteredTasks.slice((page - 1) * size, page * size);
      setPageProps({page: page, size: size, total: total});
      setItemList(taskResponsesToPageEntries(filteredTasks));
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
  };

  useEffect(() => {
    getTaskList();
  }, [filters]);

  const _pageTabHandler = (tab_name: string) => {
    setFilters((prev) => ({
      ...prev,
      expired: (tab_name === "Прошедшие"),
    }));
    setSelectedTab(tab_name);
  }
  const _dropdownHandler = (event: DropdownOption<string> | undefined, isEvent: boolean) => {
    if (isEvent) {
      setSelectedEvent(event);
      setSelectedActivity(undefined);
      setFilters((prev) => ({
        ...prev,
        eventId: event?.id,
        activityId: undefined,
      }))
    } else {
      setSelectedActivity(event);
      setFilters((prev) => ({
        ...prev,
        activityId: event?.id,
      }))
    }
  }

  const activityOptions = dropdownOptions.find(obj => obj.event.id === selectedEvent?.id)?.activities;
  return (
    <Layout
      topLeft={<BrandLogo/>}
      topRight={<PageName text="Мои задачи"/>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.taskList}/>}
      bottomRight={
        <>
          <div className={styles.tabs}>
            <PageTabs value={selectedTab} handler={_pageTabHandler} items={pageTabs}/>
          </div>
          <Content>
            <div className={styles.events_page}>
              <div className={styles.filters}>
                <div className={styles.filter_group}>
                  <div className={styles.dropdownfilter}>
                    <Dropdown
                      placeholder="Мероприятие"
                      items={dropdownOptions.map(obj => obj.event)}
                      value={selectedEvent}
                      onChange={(item) => _dropdownHandler(item, true)}
                      onClear={() => _dropdownHandler(undefined, true)}
                      toText={(item) => {
                        return item.value
                      }}/>
                  </div>
                  <div className={styles.dropdownfilter}>
                    <Dropdown
                      placeholder="Активность"
                      items={activityOptions ? activityOptions?.map(obj => obj.activity) : []}
                      value={selectedActivity}
                      onChange={(item) => _dropdownHandler(item, false)}
                      onClear={() => _dropdownHandler(undefined, false)}
                      toText={(item) => {
                        return item.value
                      }}/>
                  </div>
                </div>
              </div>
              <div className={styles.event_list_container}>
                <Pagination pageProps={pageProps} onPageChange={(page, size) => getTaskList(page, size)}
                            items={itemList} pageSpread={1} listWrapper={<ListWrapper/>}/>
              </div>
            </div>
          </Content>
        </>
      }
    />
  );
}

export default TaskListPage;
