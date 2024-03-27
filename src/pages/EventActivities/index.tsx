import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, {PageTab} from "@widgets/main/PageTabs";
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

const _eventName: string = "Славянский Зажим: Поединок за Колосом";

const _eventInfo: string = "Присоединяйтесь к нам на захватывающий славянский мукамольный турнир, где лучшие мукамолы из разных уголков земли сойдутся в смешных и острых схватках за звание Короля (или Королевы) Муки! Участники будут соревноваться в различных видах муканья, в том числе в муканье кукурузы, муканье муки через сито, а также в конкурсе на самый оригинальный муканьяльный костюм. Вас ждут веселые призы и масса улыбок! Приходите и окунитесь в мир старинных славянских традиций!";

const _regDates: string = "01.06.2024 - 10.06.2024";

const _dates: string = "11.06.2024 - 19.06.2024";

const _vacantSlots: string = "40/100";

const _place: string = "Кронверкский проспект 49";

const _status: string = "Активное";

const _pageTabs: PageTab[] = [
    new PageTab("Активности"),
    new PageTab("Организаторы"),
    new PageTab("Участники"),
    new PageTab("Задачи")
]

function EventActivitiesPage() {
    const _brandLogoClick = () => {
        console.log('brand logo!')
    }

    return (
        <Layout
            topLeft={<BrandLogo onClick={_brandLogoClick} />}
            topRight=
                {
                    <PageName text={_eventName} />
                }
            bottomLeft={<SideBar tabs={_tabs} />}
            bottomRight=
                {
                    <Content>
                        <div className={styles.info_entry}>
                            <p>{_eventInfo}</p>
                        </div>
                        <div className={styles.info_entry}>
                            <p>Сроки регистрации:</p>
                            <p>{_regDates}</p>
                        </div>
                        <div className={styles.info_entry}>
                            <p>Сроки проведения:</p>
                            <p>{_dates}</p>
                        </div>
                        <div className={styles.info_entry}>
                            <p>Количество свободных мест:</p>
                            <p>{_vacantSlots}</p>
                        </div>
                        <div className={styles.info_entry}>
                            <p>Место проведения:</p>
                            <p>{_place}</p>
                        </div>
                        <div className={styles.info_entry}>
                            <p>Статус:</p>
                            <p>{_status}</p>
                        </div>
                        <PageTabs value="Активности" items={_pageTabs}/>
                    </Content>
                }
        />
    );
}

export default EventActivitiesPage;
