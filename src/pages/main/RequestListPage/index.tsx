import { useEffect, useState } from 'react';
import styles from './index.module.css'
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import Layout from "@widgets/main/Layout";
import { uid } from "uid";
import Button from "@widgets/main/Button";
import { appendClassName, truncateTextByWords } from "@shared/util.ts";
import { ArrowDown } from "@shared/ui/icons";

enum RequestStatus {
  New,
  Approved,
  Declined,
}

class Request {
  email: string
  name: string
  surname: string
  status: RequestStatus
  sentTime: Date

  constructor(email: string, name: string, surname: string, status: RequestStatus, sentTime: Date) {
    this.email = email
    this.name = name
    this.surname = surname
    this.status = status
    this.sentTime = sentTime
  }
}

const _requests: Request[] = [
  new Request("one@itmo.ru", "Один", "Одинов", RequestStatus.New, new Date(2024, 3, 14, 10, 1, 34)),
  new Request("two@itmo.ru", "Два", "Дваев", RequestStatus.New, new Date(2024, 3, 14, 10, 1, 34))
]

class RequestEntry {
  id: number
  data: Request

  constructor(id: number, data: Request) {
    this.id = id;
    this.data = data;
  }
}

export default function RequestListPage() {
  var startEntries: Array<RequestEntry> = [];
  const [requests, setRequests] = useState(_requests)
  for (var i: number = 0; i < requests; i++)
    startEntries.push(new RequestEntry(i, requests[i]));
  const [requestEntries, setRequestEntries] = useState(startEntries)

  useEffect(() => {setRequestEntries(startEntries)}, [requests])

  const _approveRequest = (request: Request) => {
    console.log("Request approved", request)
  }

  const _declineRequest = (request: Request) => {
    console.log("Request declined", request)
  }

  function _approveEntryClick(requestEntry: RequestEntry) {
    // some callback to server?
    _approveRequest(requestEntry.data)
    setRequests(requests.map((r: Request) => {
      if (r == requestEntry.data) {
        r.status = RequestStatus.Approved;
      }
      return r;
    }))
  }

  function _declineEntryClick(requestEntry: RequestEntry) {
    // some callback to server?
    _declineRequest(requestEntry.data)
    setRequests(requests.map((r: Request) => {
      if (r == requestEntry.data) {
        r.status = RequestStatus.Declined;
      }
      return r;
    }))
  }

  function _renderButtons(req: RequestEntry) {
    if (req.data.status == RequestStatus.New) {
      return (
        <>
          <Button className={styles.approve_button} onClick={() => _approveEntryClick(req)}>Одобрить</Button>
          <Button className={styles.approve_button} onClick={() => _declineEntryClick(req)}>Отклонить</Button>
        </>
      )
    }
    if (req.data.status == RequestStatus.Approved) {
      return <p>Одобрено</p>
    }
    return <p>Отклонено</p>
  }

  function _renderRequestEntry(req: RequestEntry) {
    return (
      <div className={styles.request_entry} key={req.id}>
        <div className={styles.request_header}>
          <span className={styles.request_titles}>
            {req.data.name} | {req.data.surname} | {req.data.email} | {req.data.sentTime}
          </span>
        </div>

        <div className={styles.request_respond}>
          {_renderButtons(req)}
        </div>
      </div>
    );
  }
  const _renderedRequestEntries: any[] = requestEntries.map((req: RequestEntry) => {
    return new PageEntry(() => { return _renderRequestEntry(req) })
  })

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Заявки на регистрацию" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.requestList} />}
      bottomRight=
      {
        (
          <Content>
            <PagedList page={1} page_size={5} page_step={5} items={_renderedRequestEntries} />
          </Content>
        )
      }
    />
  );
}
