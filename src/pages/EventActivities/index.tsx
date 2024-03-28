import { uid } from 'uid'
import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import styles from './index.module.css'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, {PageTab} from "@widgets/main/PageTabs";
import EventHeader from "@widgets/EventHeader";

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

class Activity {
    id: string
    name: string
    place: string
    room: string
    description: string
    date: string
    time: string

    constructor(
        activityName: string,
        place: string,
        room: string,
        description: string,
        date: string,
        time: string
    ) {
        this.id = uid();
        this.name = activityName;
        this.place = place;
        this.room = room;
        this.description = description;
        this.date = date;
        this.time = time;
    }
}

const _activities: Activity[] = [
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00"),
    new Activity("Самый красивый колос",
        "Кронверкский пр. 49",
        "Ауд. 1265",
        "ПОКАЖИ СВОЙ КОЛОС ИЛИ КОЛОСОК?",
        "11.06.2024",
        "15:30 - 17:00")
]

function EventActivitiesPage() {

    const _brandLogoClick = () => {
        console.log('brand logo!')
    }

    function _createActivity(activity: Activity) {
        return (
            <div className={styles.activity_container}>
                <div className={styles.activity_info_column}>
                    <div className={styles.activity_name}>{activity.name}</div>
                    <div className={styles.activity_place_container}>
                        <div className={styles.activity_place}>{activity.place}</div>
                        <div className={styles.activity_place}>{activity.room}</div>
                    </div>
                    <div className={styles.activity_info}>{activity.description}</div>
                </div>
                <div className={styles.activity_time_column}>
                    <div className={styles.activity_time}>{activity.date}</div>
                    <div className={styles.activity_time}>{activity.time}</div>
                </div>
            </div>
        )
    }

    function _createActivityTable(activities: Activity[]) {
        const items = []
        for (const activity of activities) {
            items.push(_createActivity(activity));
        }
        return (
            <div className={styles.activity_table}>
                {items}
            </div>
        )
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
                        <EventHeader
                            eventInfo={_eventInfo}
                            regDates={_regDates}
                            dates={_dates}
                            vacantSlots={_vacantSlots}
                            place={_place}
                            eventStatus={_status}
                        />
                        <PageTabs value="Активности" items={_pageTabs}/>
                        {_createActivityTable(_activities)}
                    </Content>
                }
        />
    );
}

export default EventActivitiesPage;
