import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import Content from "@widgets/main/Content";
import SideBar from "@widgets/main/SideBar";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { RoutePaths } from "@shared/config/routes";
import { FC, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskService } from "@features/task-service.ts";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { TaskListShowInEventTaskStatusEnum, TaskResponse, TaskResponseTaskStatusEnum } from "@shared/api/generated";
import ApiContext from "@features/api-context";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import PageTabs, { PageTab } from "@widgets/main/PageTabs";
import Pagination, { PageProps, PageEntry } from "@widgets/main/PagedList/pagination";

const newTaskOptions: DropdownOption<string>[] = [
  new DropdownOption("Новое"),
  new DropdownOption("В работе"),
  new DropdownOption("Выполнено"),
  new DropdownOption("Просрочено"),
];

type FilterType = {
  eventId: number | undefined,
  taskStatus: TaskListShowInEventTaskStatusEnum | undefined;
  [key: string]: number | TaskListShowInEventTaskStatusEnum | undefined;
}

const initialFilters : FilterType = {
  eventId: undefined,
  taskStatus: undefined,
};

const statusTranslation: Record<string, string> = {
  NEW: "Новое",
  IN_PROGRESS: "В работе",
  EXPIRED: "Просрочено",
  DONE: "Выполнено",
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
}

const TaskTableRow: FC<TaskTableRowProps> = ({
                                               taskId,
                                               title,
                                               description,
                                               deadline,
                                               assigneeName,
                                               eventId, eventName,
                                               taskStatus,
                                               activityTitle,
                                             }) => {
  const [selectedStatus, setStatus] = useState<DropdownOption<string> | undefined>();
  const navigate = useNavigate();
  const canChangeTaskStatus = true;

  const { api } = useContext(ApiContext);


  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: taskService.updateTaskStatus(api),
    mutationKey: ["updateTaskStatus"],
  });

  const redirectToEvent = (id: number) => {
    const path = `/events/${id}`;
    navigate(path);
  };

  return (<tr>
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
                {"Описание задачи:"}
                <br />
                <br />
              </div>
              <div className={styles.popupContent}>{description}</div>
              <div className={styles.popupButton}>
                <Button onClick={close}>Скрыть</Button>
              </div>
            </div>
          )) as unknown as ReactNode
        }
      </Popup>
    </td>
    <td>
      {format(deadline, "H:mm")} <br />
      {format(deadline, "do MMMM, yyyy", { locale: ru })}
    </td>
    <td>{assigneeName}</td>
    <td>
      <Button onClick={() => redirectToEvent(eventId)}>{eventName}</Button>
    </td>
    <td>{activityTitle ?? "-"}</td>
    <td className={styles.dropdown}>
      {canChangeTaskStatus ? (
        <Dropdown
          placeholder={statusTranslation[taskStatus]}
          items={newTaskOptions}
          toText={(item) => item.value}
          value={selectedStatus}
          onChange={(sel) => {
            updateTaskStatus({ newStatus: sel.value, id: taskId });
            setStatus(sel);
          }}
        />
      ) : (
        <>{statusTranslation[taskStatus]}</>
      )}
    </td>
  </tr>);
};

const ListWrapper: FC<{child?:ReactNode[]}> = ({child}) => {
  return <div className={styles.content}>
  <table className={styles.table}>
    <thead>
    <tr>
      <th>Название</th>
      <th>Описание</th>
      <th>Дедлайн</th>
      <th>Ответственный</th>
      <th>Мероприятие</th>
      <th>Активность*</th>
      <th>Статус</th>
    </tr>
    </thead>
    <tbody>
      {child}
    </tbody>
      </table>
    </div>
}

const taskResponsesToPageEntries = (tasks: TaskResponse[]) => {
  return tasks.map((task)=>{
    return new PageEntry(() => {
      return (
        <TaskTableRow key={task.id}
                      taskId={Number(task.id)} title={String(task.title)} description={task.description || ""}
                      deadline={task.deadline || ""}
                      assigneeName={`${task.assignee?.name} ${task.assignee?.surname}`}
                      eventId={Number(task.event?.eventId)}
                      eventName={task.event?.eventTitle}
                      taskStatus={task.taskStatus as TaskResponseTaskStatusEnum}
                      activityTitle={task.event?.activityTitle} />);
    });
  })
}

type DropdownOptionMap = {
  key: DropdownOption<string>,
  value: DropdownOption<string>[],
}

function TaskListPage() {
  const { api } = useContext(ApiContext);
  //tabs
  const pageTabs : PageTab[] = [];
  pageTabs.push(new PageTab("Текущие"));
  pageTabs.push(new PageTab("Прошение"));
  const [selectedTab, setSelectedTab] = useState(pageTabs[0].text);
  const _pageTabHandler = (tab_name: string) => {
    setSelectedTab(tab_name);
  }

  const [pageProps, setPageProps] = useState<PageProps>({page:1,size:5,total:0});
  const [itemList, setItemList] = useState<PageEntry[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptionMap[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DropdownOption<string> | undefined>();
  const [selectedActivity, setSelectedActivity] = useState<DropdownOption<string> | undefined>();
  let allTasks: TaskResponse[]  = []
  const fetchFirstData = async() => {
    try {
      if (allTasks.length===0)
      allTasks = await taskService.getAllTasks(api)();
      const optionMap = allTasks
        .map((task) => ({
          eventId: task.event?.eventId,
          eventTitle: task.event?.eventTitle,
        }))
        .filter((value, index, self) => self.findIndex((el) => el.eventId === value.eventId) === index)
        .map((uniqueEvent) : DropdownOptionMap => ({key: new DropdownOption<string>(uniqueEvent.eventTitle?uniqueEvent.eventTitle:"",uniqueEvent.eventId?uniqueEvent.eventId.toString():""),value:[]}));

      allTasks.filter((task) => (task.event?.activityId!==undefined))
        .map((task) => ({
          eventId: task.event?.eventId,
          activityTitle: task.event?.activityTitle,
          activityId: task.event?.activityId,
      })).filter((value, index, self) => self.findIndex((el) => el.activityId === value.activityId) === index).forEach((act)=>{
        optionMap.forEach((event)=>{
          if (event.key.id===act.eventId?.toString()) {
            event.value.push(new DropdownOption<string>(act.activityTitle?act.activityTitle:"",act.activityId?act.activityId.toString():""))
          }
        })
      })
      setDropdownOptions(optionMap);
      setItemList(taskResponsesToPageEntries(allTasks));
      setPageProps((prev)=>({
        ...prev,
        total: allTasks.length
      }));
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
  }
  //fetch all tasks in the first mount
  useEffect(()=>{
    fetchFirstData();
  }, [])

  const [filters, setFilters] = useState(initialFilters);
  const getTaskList = async (page: number = 1, size: number = 15) => {
    try {
      console.log("eventid "+filters.eventId);
      const data = await taskService.getFilteredTasks(
        api,
        filters.eventId,
        undefined,
        filters.taskStatus,
        undefined,
        undefined,
        page-1,
        size
      );
      if (data.total===undefined||data.items===undefined) throw new Error("Incomplete data received from the server");
      const items: PageEntry[] = taskResponsesToPageEntries(data.items);
      setPageProps({page:page,size:size,total:data.total});
      setItemList(items);
    } catch (error) {
      console.error("Error fetching event list:", error);
    }
  };
  useEffect(() => {
    getTaskList();
  }, [filters]);

  // const { data: filterEvents = [] } = useQuery({
  //   queryFn: taskService.getAllEventsByAssignee(api),
  //   queryKey: ["getEventsNames"],
  // });

  const _dropdownHandler = (event: DropdownOption<string> | undefined,isParent: boolean) => {
    if (isParent) {
      setSelectedEvent(event);
      setSelectedActivity(undefined);
    }
    else setSelectedActivity(event);
    setFilters((prev)=>({
      ...prev,
      eventId: event===undefined?undefined:parseInt(event.id),
    }))
  }
  const activityOptions = dropdownOptions.find(obj => obj.key === selectedEvent)?.value;

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Мои задачи" />
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.taskList} />}
      bottomRight={
        <>
        <div className={styles.tabs}>
          <PageTabs value={selectedTab} handler={_pageTabHandler} items={pageTabs} />
        </div>
        <Content>
          <div className={styles.events_page}>

            <div className={styles.filters}>
              <div className={styles.filter_group}>
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Мероприятие"
                    items={dropdownOptions.map(obj => obj.key)}
                    value={selectedEvent}
                    onChange={(item)=>_dropdownHandler(item,true)}
                    onClear={()=>_dropdownHandler(undefined,true)}
                    toText={(item) => {return item.value}} />
                </div>
                <div className={styles.dropdownfilter}>
                  <Dropdown
                    placeholder="Активность"
                    items={activityOptions!==undefined?activityOptions:[]}
                    value={selectedActivity}
                    onChange={(item)=>_dropdownHandler(item,false)}
                    onClear={()=>_dropdownHandler(undefined,false)}
                    toText={(item) => {return item.value}} />
                </div>
              </div>
            </div>
            <Pagination pageProps={pageProps} onPageChange={(page,size)=>getTaskList(page,size)} items={itemList} pageSpread={1} listWrapper={<ListWrapper/>}/>
          </div>
        </Content>
        </>
      }
    />
  );
}

export default TaskListPage;
