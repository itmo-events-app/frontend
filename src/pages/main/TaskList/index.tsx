import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { RoutePaths } from '@shared/config/routes';



function TaskListPage() {
    const _createEvent = () => {
        console.log('creating event!');
    }

    return (
        <Layout
            topLeft={<BrandLogo />}
            topRight={<PageName text="Задачи" />}
            bottomLeft={<SideBar currentPageURL={RoutePaths.taskList} />}
            bottomRight=
            {
                <Content>
                    123
                </Content>
            }
        />
    );
}

export default TaskListPage;
