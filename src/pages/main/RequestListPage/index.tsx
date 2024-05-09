import { useContext, useEffect, useState } from 'react';
import styles from './index.module.css';
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import Layout from "@widgets/main/Layout";
import Button from "@widgets/main/Button";
import { appendClassName } from "@shared/util.ts";
import ApiContext from '@features/api-context';
import { RegistrationRequestForAdmin, RegistrationRequestForAdminStatusEnum } from '@shared/api/generated/model/registration-request-for-admin.ts';
import type { AxiosResponse } from 'axios';

enum RequestStatus {
  New,
  Approved,
  Declined,
}

class Request {
  id: number;
  email: string;
  name: string;
  surname: string;
  status: RequestStatus;
  sentTime: Date;

  constructor(req: RegistrationRequestForAdmin) {
    this.id = req.id || 0;
    this.email = req.email || "";
    this.name = req.name || "";
    this.surname = req.surname || "";
    switch (req.status || RegistrationRequestForAdminStatusEnum.New) {
      case RegistrationRequestForAdminStatusEnum.New: this.status = RequestStatus.New; break;
      case RegistrationRequestForAdminStatusEnum.Approved: this.status = RequestStatus.Approved; break;
      case RegistrationRequestForAdminStatusEnum.Declined: this.status = RequestStatus.Declined; break;
    }
    this.sentTime = new Date(req.sentTime || "");
  }
}

export default function RequestListPage() {
  const { api } = useContext(ApiContext);
  const [requests, setRequests] = useState([] as Request[]);

  function _fetchData() {
    api
      .auth
      .listRegisterRequests()
      .then((response: AxiosResponse<RegistrationRequestForAdmin[], any>) => {
        if (response.status == 200) {
          setRequests(response.data.map((req) => new Request(req)));
        }
        else {
          console.log("Fail list: " + response.status + " " + response.statusText);
        }
      })
      .catch((reason: any) => console.log("Reject list: " + reason));
  }

  useEffect(_fetchData, []);

  function _approveRequestClick(request: Request) {
    api
      .auth
      .approveRegister(request.id)
      .then((response) => {
        if (response.status == 200) {
          console.log("Request approved", request);
          setRequests(requests.map((r: Request) => {
            if (r == request) {
              r.status = RequestStatus.Approved;
            }
            return r;
          }));
        }
        else {
          console.log("Fail approve: " + response.status + " " + response.statusText);
        }
      })
      .catch((reason: any) => console.log("Reject approve: " + reason));
  }

  function _declineRequestClick(request: Request) {
    api
      .auth
      .declineRegister(request.id)
      .then((response) => {
        if (response.status == 200) {
          console.log("Request decline", request);
          setRequests(requests.map((r: Request) => {
            if (r == request) {
              r.status = RequestStatus.Declined;
            }
            return r;
          }));
        }
        else {
          console.log("Fail decline: " + response.status + " " + response.statusText);
        }
      })
      .catch((reason: any) => console.log("Reject decline: " + reason));
  }

  function _renderButtons(req: Request) {
    if (req.status == RequestStatus.New) {
      return (
        <>
          <Button className={
            styles.button
          } onClick={() => _approveRequestClick(req)}>Утвердить</Button>
          <Button className={
            appendClassName(styles.button, styles.decline_button)
          } onClick={() => _declineRequestClick(req)}>Отклонить</Button>
        </>
      );
    }
    if (req.status == RequestStatus.Approved) {
      return <p className={styles.label}>
        <svg width="34px" height="34px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#008000" />
        </svg>
      </p>;
    }
    return <p className={styles.label}>

      <svg width="30px" height="30px" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2" data-name="Layer 2"><g id="_03.multiple_by" data-name="03.multiple by"><path d="m173 31.47a32.06 32.06 0 0 0 -28.48-28.47 532.59 532.59 0 0 0 -113 0 32.06 32.06 0 0 0 -28.52 28.47 532.59 532.59 0 0 0 0 113 32.06 32.06 0 0 0 28.48 28.53 530 530 0 0 0 113 0 32.06 32.06 0 0 0 28.52-28.49 532.59 532.59 0 0 0 0-113.04zm-65.1 85.72-19.77-19.77-19.76 19.77-9.75-9.75 19.89-19.77-19.37-19.36 9.49-9.49 19.37 19.37 19.37-19.37 9.75 9.75-19.37 19.37 19.63 19.75z" fill="#A52019" /></g></g></svg>
    </p>;
  }

  function _renderRequestEntry(req: Request) {
    return (
      <div className={styles.request_entry} key={req.id}>
        <div className={styles.request_header}>
          <div className={
            (req.status == RequestStatus.New)
              ? styles.request_titles
              : appendClassName(styles.request_titles, styles.responded)}>
            {req.name} {req.surname}, {req.email}, {req.sentTime.toLocaleString()}
          </div>
          <div className={styles.button_panel}>
            {_renderButtons(req)}
          </div>
        </div>
      </div>
    );
  }

  const _renderedRequests: any[] = requests.map((req: Request) => {
    return new PageEntry(() => { return _renderRequestEntry(req) })
  });

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Заявки на регистрацию" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.requestList} />}
      bottomRight=
      {
        (requests.length == 0)
          ? (
            <Content>
              <div className={styles.no_requests}>
                Заявок нет
              </div>
              <Button className={styles.button_reload} onClick={_fetchData}>Перезагрузить</Button>
            </Content>
          )
          : (
            <Content>
              <PagedList page={1} page_size={5} page_step={1} items={_renderedRequests} />
            </Content>
          )
      }
    />
  );
}
