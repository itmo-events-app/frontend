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
      case RegistrationRequestForAdminStatusEnum.New: this.status= RequestStatus.New; break;
      case RegistrationRequestForAdminStatusEnum.Approved: this.status= RequestStatus.Approved; break;
      case RegistrationRequestForAdminStatusEnum.Declined: this.status= RequestStatus.Declined; break;
    }
    this.sentTime = new Date(req.sentTime || "");
  }
}

export default function RequestListPage() {
  const { api } = useContext(ApiContext);
  const [requests, setRequests] = useState([] as Request[]);

  useEffect(() => {
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
  }, [requests]);

  function _approveRequestClick(request: Request) {
    api
      .auth
      .approveRegister(request.id)
      .then((response) =>{
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
  };

  function _declineRequestClick(request: Request) {
    api
      .auth
      .declineRegister(request.id)
      .then((response) =>{
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
  };

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
      return <p className={styles.label}>Утверждено</p>;
    }
    return <p className={styles.label}>Отклонено</p>;
  };

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
  };

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
            <div className={styles.no_requests}>Заявок нет</div>
          </Content>
        )
        : (
          <Content>
            <PagedList page={1} page_size={5} page_step={5} items={_renderedRequests} />
          </Content>
        )
      }
    />
  );
}
