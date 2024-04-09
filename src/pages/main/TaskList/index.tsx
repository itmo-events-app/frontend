import styles from "./index.module.css";
import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import Content from "@widgets/main/Content";
import SideBar from "@widgets/main/SideBar";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { RoutePaths } from "@shared/config/routes";
import { FC, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { taskService } from "../../../service/task-service.ts";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { hasAnyPrivilege } from "@features/privileges.ts";
import { PrivilegeContext, PrivilegeData } from "@features/PrivilegeProvider.tsx";
import { PrivilegeNames } from "@shared/config/privileges.ts";
import { TaskResponse } from "@shared/api/generated";

type TaskTableProps = {
  tasks: TaskResponse[];
}

const newTaskOptions: DropdownOption[] = [
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

  const canAssignTaskToOther = hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
    new PrivilegeData(PrivilegeNames.REPLACE_TASK_EXECUTOR),
  ])); // todo: использовать эту проверку?

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
            <td>{task.assignee!.name + " " + task.assignee!.surname}</td>
            <td>{task.eventId}</td>
            {/*todo: ждем доработку бэка чтобы вывести мероприятие и активность*/}
            <td>{"-"}</td>
            <td className={styles.dropdown}>
              {canChangeTaskStatus ? (<Dropdown placeholder={statusTranslation[task.taskStatus!]}
                                                items={newTaskOptions}
                                                onSelect={({ text }) => {
                                                  updateTaskStatus({ newStatus: text, id: task.id! });
                                                }} />
              ) : (<>{statusTranslation[task.taskStatus!]}</>)}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};


function TaskListPage() {

  const { data: tasks = [] } = useQuery({
    queryFn: taskService.getTasks,
    queryKey: ["getTasks"],
  });

  const { data: eventsNames = [] } = useQuery({
    queryFn: taskService.getTasks,
    queryKey: ["getTasks"],
  });

  const filterEvent: DropdownOption[] = [
    new DropdownOption("Мероприятие 1"),
    new DropdownOption("Мероприятие 2"),
  ];

  const filterActivity: DropdownOption[] = [
    new DropdownOption("Активность 1"),
    new DropdownOption("Активность 2"),
    new DropdownOption("Активность 3"),
  ];

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
                  <Dropdown placeholder="Мероприятие" items={filterEvent} clearable />
                </div>
                <div className={styles.dropdown}>
                  <Dropdown placeholder="Активность" items={filterActivity} clearable />
                </div>
                <Button onClick={() => {
                  console.log("Применить");
                }}>
                  Применить
                </Button>
              </form>
            </div>
            <TaskTable tasks={tasks} />
          </Content>
        }
    />
  );
}


export default TaskListPage;
