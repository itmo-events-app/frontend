import { useEffect, useState } from 'react';
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes.ts';
import Content from '@widgets/main/Content';
import PagedList, { PageEntry } from '@widgets/main/PagedList';
import Layout from '@widgets/main/Layout';
import { uid } from 'uid';
import Button from '@widgets/main/Button';
import { appendClassName, truncateTextByWords } from '@shared/util.ts';
import { ArrowDown } from '@shared/ui/icons';

class Notification {
  id: string;
  eventName: string;
  activityName: string;
  taskName: string;
  date: string;
  time: string;
  text: string;
  isRead: boolean;

  constructor(
    eventName: string,
    activityName: string,
    taskName: string,
    date: string,
    time: string,
    text: string,
    isRead: boolean
  ) {
    this.id = uid();
    this.eventName = eventName;
    this.activityName = activityName;
    this.taskName = taskName;
    this.date = date;
    this.time = time;
    this.text = text;
    this.isRead = isRead;
  }
}

const _notifications: Notification[] = [
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    false
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    false
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'At vero eos et accusamus et iusto odio dignissimos ducimus, consectetur adipiscing elit, sunt in culpa qui officia deserunt mollit anim id est laborum!\n' +
      '\n' +
      'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.\n' +
      '\n' +
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, nisi ut aliquid ex ea commodi consequatur?\n' +
      '\n' +
      'Ut enim ad minima veniam, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Nemo enim ipsam voluptatem, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quis autem vel eum iure reprehenderit, consectetur adipiscing elit, nisi ut...',
    false
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    false
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
  new Notification(
    'At vero eos',
    'et accusamus',
    'et iusto',
    '31.10.2008',
    '20:31',
    'Quis autem vel eum iure reprehenderit, quis nostrum exercitationem ullam corporis suscipit laboriosam, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
    true
  ),
];

class NotificationEntry {
  data: Notification;
  expanded: boolean;

  constructor(data: Notification, expanded: boolean) {
    this.data = data;
    this.expanded = expanded;
  }
}

export default function NotificationListPage() {
  const [notifications, setNotifications] = useState(_notifications);
  const [notificationEntries, setNotificationEntries] = useState(
    notifications.map((n) => new NotificationEntry(n, false))
  );

  useEffect(() => {
    setNotificationEntries(notifications.map((n) => new NotificationEntry(n, false)));
  }, [notifications]);

  const _readNotification = (notification: Notification) => {
    console.log('Notification read', notification);
  };

  const _renderedNotificationEntries: any[] = notificationEntries.map((n) => {
    return new PageEntry(() => {
      return _renderNotificationEntry(n);
    });
  });

  function _renderNotificationEntry(ne: NotificationEntry) {
    return (
      <div className={styles.notification_entry} key={ne.data.id}>
        <div className={styles.notification_header}>
          <span className={styles.notification_titles}>
            {ne.data.eventName} | {ne.data.activityName} | {ne.data.taskName}
          </span>

          <div className={styles.notification_date_and_expand_container}>
            <span className={styles.notification_date_time}>
              {ne.data.date} <br /> {ne.data.time}
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
          {ne.expanded ? ne.data.text : truncateTextByWords(ne.data.text, 10)}
        </div>

        <div className={styles.notification_read}>
          <Button
            className={ne.data.isRead ? styles.read_button : styles.not_read_button}
            onClick={() => _readEntryClick(ne)}
          >
            {ne.data.isRead ? 'Прочитано' : 'Прочитать'}
          </Button>
        </div>
      </div>
    );
  }

  function _expandEntryClick(notificationEntry: NotificationEntry) {
    setNotificationEntries(
      notificationEntries.map((ne) => {
        if (ne.data.id === notificationEntry.data.id) {
          ne.expanded = !ne.expanded;
        }
        return ne;
      })
    );
  }

  function _readEntryClick(notificationEntry: NotificationEntry) {
    // some callback to server?
    _readNotification(notificationEntry.data);
    setNotifications(
      notifications.map((e) => {
        if (e == notificationEntry.data) {
          e.isRead = !e.isRead;
        }
        return e;
      })
    );
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Уведомления" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.notifications} />}
      bottomRight={
        <Content>
          <PagedList page={1} page_size={5} page_step={5} items={_renderedNotificationEntries} />
        </Content>
      }
    />
  );
}
