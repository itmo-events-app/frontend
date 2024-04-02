import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Input from "@widgets/main/Input";
import { uid } from 'uid'
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { RoutePaths } from '@shared/config/routes';



function TaskListPage() {
    class Task {
        id: string
        name: string
        event: string
        act: string
        deadline: string
        status: string
        user: string
        doo: string

        constructor(
            name: string,
            event: string,
            act: string,
            deadline: string,
            status: string,
            user: string,
            doo: string,
        ) {
            this.id = uid();
            this.name = name;
            this.event = event;
            this.act = act;
            this.deadline = deadline;
            this.status = status;
            this.user = user;
            this.doo = doo;
        }
    }
    const _tasks: Task[] = [
        new Task("Задача новая",
            "Мероприятие 1",
            "Сходка программистов",
            "11.06.2024",
            "В работе",
            "Иванов Иван Иванович",
            "Взять"),
        new Task("Задача новая",
            "Мероприятие 1",
            "Сходка программистов",
            "11.06.2024",
            "В работе",
            "Иванов Иван Иванович",
            "Отказаться"),
        new Task("Задача новая",
            "Мероприятие 1",
            "Сходка программистов",
            "11.06.2024",
            "В работе",
            "Иванов Иван Иванович",
            "Редактировать"),
    ]
    const filterEvent: DropdownOption[] = [
        new DropdownOption("Мероприятие 1"),
        new DropdownOption("Мероприятие 2")
    ]

    const filterUser: DropdownOption[] = [
        new DropdownOption("Пользователь 1"),
        new DropdownOption("Пользователь 2")
    ]

    const filterActivity: DropdownOption[] = [
        new DropdownOption("Активность 1"),
        new DropdownOption("Активность 2"),
        new DropdownOption("Активность 3")
    ]

    function _createTaskRow(task: Task) {
        return (
            <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.deadline}</td>
                <td>{task.user}</td>
                <td>{task.event}</td>
                <td>{task.act}</td>
                <td>{task.status}</td>
                <td>
                    <Button>{task.doo}</Button>
                </td>
            </tr>
        )
    }

    function _createTaskTable(tasks: Task[], edit_func: any) {
        const items = []
        for (const task of tasks) {
            items.push(_createTaskRow(task));
        }
        return (
            <div className={styles.content}>
                {/* {edit_privilege ? (
                    <Button onClick={edit_func}>Редактировать</Button>
                ) : <></>} */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Дедлайн</th>
                            <th>Ответственный</th>
                            <th>Мероприятие</th>
                            <th>Активность*</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items}
                    </tbody>
                </table>
            </div>
        )
    }
    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Задачи" />}
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
                                <Dropdown placeholder="Пользователь" items={filterUser} clearable />
                            </div>
                            <div className={styles.dropdown}>
                                <Dropdown placeholder="Активность" items={filterActivity} clearable />
                            </div>
                            <Button>Применить</Button>
                        </form>
                    </div>
                    {_createTaskTable(_tasks)}
                </Content>
            }
        />
    );
}

export default TaskListPage;
