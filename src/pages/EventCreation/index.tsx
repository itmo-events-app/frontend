import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import styles from './index.module.css';
import Input from "@widgets/auth/Input";
import Button from "@widgets/auth/Button";
import Dropdown from "@widgets/auth/Dropdown";
import Block from "@widgets/Block";

const _tabs: SideBarTab[] = [
    new SideBarTab('Мероприятия', <Menu />, [
        new SideBarTab('Доступные'),
        new SideBarTab('Участия'),
        new SideBarTab('Организуемые'),
        new SideBarTab('Создание', undefined, [], true),
    ], true, true),
    new SideBarTab('Площадки', <Home />, [
        new SideBarTab('Доступные'),
        new SideBarTab('Создание'),
    ]),
    new SideBarTab('Уведомления', <Noted />),
    new SideBarTab('Профиль', <Users />),

]

function EventCreationPage() {
    const _brandLogoClick = () => {
        console.log('brand logo!')
    }

    const _createEvent = () => {
        console.log('creating event!');
    }

    return (
        <Layout
            topLeft={<BrandLogo onClick={_brandLogoClick} />}
            topRight={<PageName text="Создание мероприятия" />}
            bottomLeft={<SideBar tabs={_tabs} />}
            bottomRight=
                {
                <Content>
                    <Block>
                        <div className={styles.event_form}>
                            <div className={styles.event_form_item}>
                                <Input type="text" placeholder="Введите название мероприятия"/>
                            </div>
                            <div className={styles.event_form_item}>
                                <Dropdown placeholder="Выберите главного организатора"/>
                            </div>
                            <div className={styles.event_form_button}>
                                <Button onClick={_createEvent()}>Создать</Button>
                            </div>
                        </div>
                    </Block>
                </Content>
                }
        />
    );
}

export default EventCreationPage;
