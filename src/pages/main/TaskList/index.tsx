import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import Content from "@widgets/main/Content";
import SideBar from "@widgets/main/SideBar";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { RoutePaths } from "@shared/config/routes";
import { FC, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskService } from "../../../service/task-service.ts";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { hasAnyPrivilege } from "@features/privileges.ts";
import { PrivilegeNames } from "@shared/config/privileges.ts";
import { TaskResponse } from "@shared/api/generated";
import PrivilegeContext from "@features/privilege-context.ts";
import { PrivilegeData } from "@entities/privilege-context.ts";

type TaskTableProps = {
  tasks: TaskResponse[];
}

const newTaskOptions: DropdownOption<string>[] = [
  new DropdownOption("Новое"),
  new DropdownOption("В работе"),
  new DropdownOption("Выполнено"),
  new DropdownOption("Просрочено"),
];

const statusTranslation: Record<string, string> = {
  "NEW": "Новое",
  "IN_PROGRESS": "В работе",
  "EXPIRED": "Просрочено",
  "DONE": "Выполнено",
};

const TaskTable: FC<TaskTableProps> = ({ tasks }) => {
  const { privilegeContext } = useContext(PrivilegeContext);
  const [selectedStatus, setStatus] = useState<DropdownOption<string> | undefined>();

  const canChangeTaskStatus = hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
    new PrivilegeData(PrivilegeNames.CHANGE_ASSIGNED_TASK_STATUS),
  ]));

  // для автоматического обновления статуса в бд
  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: taskService.updateTaskStatus,
    mutationKey: ["updateTaskStatus"],
  });

  return (
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
        {tasks.map(task => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
              {format(task.deadline!, "H:mm")} <br />
              {format(task.deadline!, "do MMMM, yyyy", { locale: ru })}
            </td>
            <td>{task.assignee?.name + " " + task.assignee?.surname}
            </td>
            <td>{task.event?.eventTitle}</td>
            <td>{task.event?.activityTitle ? task.event.activityTitle : "-"}</td>
            <td className={styles.dropdown}>
              {canChangeTaskStatus ?
                (<Dropdown placeholder={statusTranslation[task.taskStatus!]}
                           items={newTaskOptions}
                           toText={(item) => item.value}
                           value={selectedStatus}
                           onChange={(sel) => {
                             updateTaskStatus({ newStatus: sel.value, id: task.id! });
                             setStatus(sel);
                           }}
                />) : (<>{statusTranslation[task.taskStatus!]}</>)}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};


function TaskListPage() {

  //todo: можно оптимизировать
  const { data: tasks = [] } = useQuery({
    queryFn: taskService.getTasks,
    queryKey: ["getTasks"],
  });

  const { data: filterEvents = [] } = useQuery({
    queryFn: taskService.getEventsNames,
    queryKey: ["getEventsNames"],
  });

  const { mutate: getFilteredTasksByEvent } = useMutation({
    mutationFn: taskService.getEventTasks,
    mutationKey: ["getEventTasks"],
    onSuccess: (res) => {
      setFilteredTasks(res);
    },
  });

  const [selectedEvent, setSelectedEvent] = useState<DropdownOption<string> | undefined>();
  const [filteredTasks, setFilteredTasks] = useState<TaskResponse[]>(tasks);

  // use effect
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const handleFilterClick = () => {
    if (tasks.at(0) !== undefined) {
      if (selectedEvent !== undefined) {
        getFilteredTasksByEvent({
          id: Number(selectedEvent.value.split(" ")[1]),
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
      bottomRight=
        {
          <Content>
            <div className="tasks-filter">
              <h2 className="tasks-filter__title">Фильтр задач</h2>
              <form className={styles.tasksfilter__form}>
                <div className={styles.dropdown}>
                  <Dropdown value={selectedEvent} placeholder="Мероприятие"
                            items={filterEvents}
                            toText={(item) => item.value.split(" ")[0]}
                            onChange={setSelectedEvent}
                            onClear={() => {
                              setSelectedEvent(undefined);
                            }}
                  />
                </div>
                <Button onClick={(event) => {
                  event.preventDefault();
                  handleFilterClick();
                }}>
                  Применить
                </Button>
              </form>
            </div>
            <TaskTable tasks={filteredTasks} />
          </Content>
        }
    />
  );
}


export default TaskListPage;
