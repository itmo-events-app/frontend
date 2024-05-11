import { useEffect, useState } from "react";
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
import { api } from "@shared/api";
import { NotificationResponse } from "@shared/api/generated";
import PagedListStupid from "@widgets/main/PagedList2";
import { useNavigate } from "react-router-dom";


class Notification {
  id: number
  title: string
  description: string
  seen: boolean
  sent_time: string
  link: string


  constructor(notificationResponse: NotificationResponse) {
    if (notificationResponse.id === undefined ||
      notificationResponse.title === undefined ||
      notificationResponse.description === undefined ||
      notificationResponse.seen === undefined ||
      notificationResponse.sent_time === undefined ||
      notificationResponse.link === undefined) {
      console.warn(`One of the fields of NotificationResponse is unidentified - possible errors in render`, notificationResponse)
    }

    this.id = notificationResponse.id!
    this.title = notificationResponse.title!
    this.description = notificationResponse.description!
    this.seen = notificationResponse.seen!
    this.sent_time = notificationResponse.sent_time!
    this.link = notificationResponse.link!
  }
}

class NotificationEntry {
  data: Notification
  expanded: boolean

  constructor(data: Notification, expanded: boolean) {
    this.data = data;
    this.expanded = expanded;
  }
}


export default function NotificationListPage() {
  const navigate = useNavigate();

  function _navigateToNotification(notificationLink: string) {
    navigate(new URL(notificationLink).pathname);
  }

  const [notifications, setNotifications] = useState<Notification[]>(new Array<Notification>())
  const [notificationEntries, setNotificationEntries] = useState<NotificationEntry[]>(new Array<NotificationEntry>())
  const [renderedNotificationEntries, setRenderedNotificationEntries] = useState<PageEntry[]>(new Array<PageEntry>())

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(1)

  useEffect(() => {
    _updateNotifications()
  }, [page, pageSize]);

  const _updateNotifications = () => {
    api.notification.getNotifications(page - 1, pageSize)
      .then(result => {
        setNotifications((result.data.content!).map(notificationResponse => new Notification(notificationResponse)))
        setTotalPages((result.data.totalPages)!)
        setTotalElements((result.data.totalElements)!)
      })
      .catch(reason => {
        console.error("Невозможно получить уведомления:", reason.response.data)
      })
  }

  // update every 5 sec
  useEffect(() => {
    const intervalId = setInterval(() => {
      _updateNotifications()
    }, 5000);

    return () => clearInterval(intervalId);
  }, [page]);

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

  useEffect(() => {
    setRenderedNotificationEntries(notificationEntries.map(ne => {
      return new PageEntry(() => _renderNotificationEntry(ne))
    }))
  }, [notificationEntries]);

  function _renderNotificationEntry(ne: NotificationEntry) {
    return (
      <div className={styles.notification_entry} key={ne.data.id}>
        <div className={styles.notification_header}>
          <span className={styles.notification_titles} onClick={() => {
            console.log(ne.data.link)
            _navigateToNotification(ne.data.link)
          }}>
            {ne.data.title}
          </span>

          <div className={styles.notification_date_and_expand_container}>
            <span className={styles.notification_date_time}>
              {formatDateTime(ne.data.sent_time).date} <br />
              {formatDateTime(ne.data.sent_time).time}
            </span>

            <div>
              {
                ne.data.description.split(" ").length > 10 ?
                  <ArrowDown
                    onClick={() => _expandEntryClick(ne)}
                    className={ne.expanded ? styles.arrow : appendClassName(styles.arrow, styles.arrow_up)}
                  /> : <div/>
              }
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
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Уведомления" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.notifications} />}
      bottomRight=
        {
          <Content>
            <PagedListStupid
              page={page}
              setPage={setPage}
              page_size={pageSize}
              setPageSize={setPageSize}
              page_step={5}
              total_pages={totalPages}
              total_elements={totalElements}
              items={renderedNotificationEntries}
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
  );
}
