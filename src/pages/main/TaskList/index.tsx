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
import { TaskResponse, TaskResponseTaskStatusEnum } from "@shared/api/generated";
import ApiContext from "@features/api-context";
import { Api } from "@entities/api";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

type TaskTableProps = {
  tasks: TaskResponse[];
  api: Api;
};

const newTaskOptions: DropdownOption<string>[] = [
  new DropdownOption("Новое"),
  new DropdownOption("В работе"),
  new DropdownOption("Выполнено"),
  new DropdownOption("Просрочено"),
];

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

const TaskTable: FC<TaskTableProps> = ({ tasks }) =>
  (
    <div className={styles.content}>
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
        {tasks.map((task) => (
          <TaskTableRow key={task.id}
                        taskId={Number(task.id)} title={String(task.title)} description={task.description || ""}
                        deadline={task.deadline || ""}
                        assigneeName={`${task.assignee?.name} ${task.assignee?.surname}`}
                        eventId={Number(task.event?.eventId)}
                        eventName={task.event?.eventTitle}
                        taskStatus={task.taskStatus as TaskResponseTaskStatusEnum}
                        activityTitle={task.event?.activityTitle} />
        ))}
        </tbody>
      </table>
    </div>
  );

function TaskListPage() {
  const { api } = useContext(ApiContext);

  const { data: tasks = [] } = useQuery({
    queryFn: taskService.getTasks(api),
    queryKey: ["getTasks"],
  });

  const { data: filterEvents = [] } = useQuery({
    queryFn: taskService.getEventsNames(api),
    queryKey: ["getEventsNames"],
  });

  const { mutate: getFilteredTasksByEvent } = useMutation({
    mutationFn: taskService.getEventTasks(api),
    mutationKey: ["getEventTasks"],
    onSuccess: (res) => {
      setFilteredTasks(res);
    },
  });

  const [selectedEvent, setSelectedEvent] = useState<DropdownOption<string> | undefined>();
  const [filteredTasks, setFilteredTasks] = useState<TaskResponse[]>(tasks);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilterClick = () => {
    if (tasks.at(0) !== undefined) {
      if (selectedEvent !== undefined) {
        getFilteredTasksByEvent({
          id: Number(selectedEvent.id),
          userId: Number(tasks.at(0)!.assignee!.id),
        });
      } else {
        setFilteredTasks(tasks);
      }
    }
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Мои задачи" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.taskList} />}
      bottomRight={
        <Content>
          <div className="tasks-filter">
            <h2 className="tasks-filter__title">Фильтр задач</h2>
            <form className={styles.tasksfilter__form}>
              <div className={styles.dropdown}>
                <Dropdown
                  value={selectedEvent}
                  placeholder="Мероприятие"
                  items={filterEvents}
                  toText={(item) => item.value}
                  onChange={setSelectedEvent}
                  onClear={() => {
                    setSelectedEvent(undefined);
                  }}
                />
              </div>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  handleFilterClick();
                }}
              >
                Применить
              </Button>
            </form>
          </div>
          <TaskTable tasks={filteredTasks} api={api} />
        </Content>
      }
    />
  );
}

export default TaskListPage;
