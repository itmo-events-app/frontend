import { useContext, useEffect, useState } from "react";
import styles from './index.module.css'
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import { PageEntry } from "@widgets/main/PagedList";
import Layout from "@widgets/main/Layout";
import Button from "@widgets/main/Button";
import { appendClassName, formatDateTime, truncateTextByWords } from "@shared/util.ts";
import { ArrowDown } from "@shared/ui/icons";
import { NotificationResponse } from "@shared/api/generated";
import PagedList2 from "@widgets/main/PagedList2";
import ApiContext from "@features/api-context";


class Notification {
  id: number
  title: string
  description: string
  seen: boolean
  sent_time: string


  constructor(notificationResponse: NotificationResponse) {
    if (notificationResponse.id === undefined ||
      notificationResponse.title === undefined ||
      notificationResponse.description === undefined ||
      notificationResponse.seen === undefined ||
      notificationResponse.sent_time === undefined) {
      console.warn(`One of the fields of NotificationResponse is unidentified - possible errors in render`, notificationResponse)
    }

    this.id = notificationResponse.id!
    this.title = notificationResponse.title!
    this.description = this.title + notificationResponse.description!
    this.seen = notificationResponse.seen!
    this.sent_time = notificationResponse.sent_time!
  }
}

class NotificationEntry {
  data: Notification
  expanded: boolean

  //TODO: delete that
  eventName: string
  activityName: string
  taskName: string

  constructor(data: Notification, expanded: boolean) {
    this.data = data;
    this.expanded = expanded;

    // Заглушка до исправления прототипа
    this.eventName = "Event"
    this.activityName = "Activity"
    this.taskName = "Task"
  }
}


export default function NotificationListPage() {
  const {api} = useContext(ApiContext);
  const [notifications, setNotifications] = useState<Notification[]>(new Array<Notification>())
  const [notificationEntries, setNotificationEntries] = useState<NotificationEntry[]>(new Array<NotificationEntry>())

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(1)

  useEffect(() => {
    api.withReauth(() => api.notification.getNotifications(page - 1, pageSize))
      .then(result => {
        setNotifications(result.data.content!.map(notificationResponse => new Notification(notificationResponse)))
        setTotalPages(result.data.totalPages!)
        setTotalElements(result.data.totalElements!)
      })
      .catch(reason => {
        console.error("Невозможно получить уведомления:", reason.response.data)
      })
  }, [page, pageSize]);

  useEffect(() => {
    setNotificationEntries(notifications.map(n => new NotificationEntry(n, false)))
  }, [notifications])

  const _readNotification = (notification: Notification) => {
    api.notification.setOneAsSeenNotification(notification.id)
      .catch(reason => console.error("Не получилось поменять статус уведомления", reason.response.data))
  }

  const _readAllNotificationsOnPage = () => {
    api.notification.setAllAsSeenNotifications(page, pageSize)
      .catch(reason => console.error("Не получилось прочитать все уведомления", reason.response.data))
  }

  const _renderedNotificationEntries: any[] = notificationEntries.map(n => {
    return new PageEntry(() => { return _renderNotificationEntry(n) })
  })

  function _renderNotificationEntry(ne: NotificationEntry) {
    return (
      <div className={styles.notification_entry} key={ne.data.id}>
        <div className={styles.notification_header}>
          <span className={styles.notification_titles}>
            {ne.eventName} | {ne.activityName} | {ne.taskName}
          </span>

          <div className={styles.notification_date_and_expand_container}>
            <span className={styles.notification_date_time}>
              {formatDateTime(ne.data.sent_time).date} <br />
              {formatDateTime(ne.data.sent_time).time}
            </span>

            <div>
              <ArrowDown
                onClick={() => _expandEntryClick(ne)}
                className={ne.expanded ? styles.arrow : appendClassName(styles.arrow, styles.arrow_up)}
              />
            </div>
          </div>
        </div>

        <div className={styles.notification_text}>
          {ne.expanded ? ne.data.description : truncateTextByWords(ne.data.description, 10)}
        </div>

        <div className={styles.notification_read}>
          <Button className={ne.data.seen ? styles.read_button : styles.not_read_button}
                  onClick={() => _readEntry(ne)}>
            {ne.data.seen ? 'Прочитано' : 'Прочитать'}
          </Button>
        </div>
      </div>
    );
  }

  function _expandEntryClick(notificationEntry: NotificationEntry) {
    setNotificationEntries(notificationEntries.map(ne => {
      if (ne.data.id === notificationEntry.data.id) {
        ne.expanded = !ne.expanded
      }
      return ne;
    }))
  }

  function _readEntry(notificationEntry: NotificationEntry) {
    // some callback to server?
    _readNotification(notificationEntry.data)
    setNotifications(notifications.map(n => {
      if (n == notificationEntry.data) {
        n.seen = true;
      }
      return n;
    }))
  }

  function _readAllNotReadNotifications() {
    _readAllNotificationsOnPage()
    setNotifications(notifications.map(n => {
      n.seen = true;
      return n;
    }))
  }

  return (
    <div>
      <Layout
        topLeft={<BrandLogo />}
        topRight={<PageName text="Уведомления" />}
        bottomLeft={<SideBar currentPageURL={RoutePaths.notifications} />}
        bottomRight=
          {
            <Content>
              <PagedList2
                pageState={[page, setPage]}
                pageSizeState={[pageSize, setPageSize]}
                page_step={5}
                total_pages={totalPages}
                total_elements={totalElements}
                items={_renderedNotificationEntries}
              />

              <div className={styles.read_all_button_div}>
                <Button className={styles.not_read_button + styles.read_all_button}
                        onClick={() => _readAllNotReadNotifications()}>
                  Прочитать все
                </Button>
              </div>
            </Content>
          }
      />
    </div>
  );
}
