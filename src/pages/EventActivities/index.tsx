import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Content from "@widgets/main/Content";
import PageTabs, {PageTab} from "@widgets/main/PageTabs";

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
            topRight={<PageName text={_eventName} />}
            bottomLeft={<SideBar tabs={_tabs} />}
            bottomRight=
                {
                    <Content>
                        <PageTabs value="Активности" items={_pageTabs}/>
                    </Content>
                }
        />
    );
}

export default EventActivitiesPage;
