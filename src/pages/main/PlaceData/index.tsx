import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import styles from "./index.module.css";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import { useContext, useEffect } from "react";
import ApiContext from "@features/api-context.ts";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "@features/place-service.ts";
import { useNavigate, useParams } from "react-router-dom";

function PlaceDataPage() {
  const { api } = useContext(ApiContext);

  const { place_id: placeId } = useParams();
  const navigate = useNavigate();

  const { data: foundPlace, failureReason } = useQuery({
    queryFn: () => placeService.getPlace(api, Number(placeId)),
    enabled: placeId !== undefined,
    queryKey: ["getPlace"],

  });

  useEffect(() => {
    if (!failureReason) return;
    if ((failureReason as any)?.response.status === 404) {
      navigate(RoutePaths.notFound);
      return;
    }
  }, [failureReason]);

  useEffect(() => {
    if (!foundPlace) return;
    (document.getElementById("itmo-map-iframe") as HTMLIFrameElement).onload = () => {
      setTimeout(() => {
        (document.getElementById("itmo-map-iframe") as HTMLIFrameElement)?.contentWindow?.postMessage({
          type: "showMarker", place: foundPlace,
        }, "*");
      }, 0);
    };
  }, [foundPlace]);

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={foundPlace?.name ?? ""} />
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeData} />}
      bottomRight={
        <Content>
          <div>
            <span className={styles.label}>Адрес: </span>
            <span className={styles.data}>{foundPlace?.address ?? ""}</span>
          </div>
          <div hidden={foundPlace?.room === ""}>
            <span className={styles.label}>Аудитория: </span>
            <span className={styles.data}>{foundPlace?.room}</span>
          </div>
          <div>
            <span className={styles.label}>Координаты: </span>
            <span className={styles.data}>{`${foundPlace?.latitude ?? 0}, ${foundPlace?.longitude ?? 0}`}</span>
          </div>
          <div>
            <span className={styles.label}>Описание: </span>
            <span className={styles.data}>{foundPlace?.description}</span></div>
          <br />
          <iframe id="itmo-map-iframe" src={(window as any).ENV_GEO_URL + "/map.html?fullscreen"} width="100%"
                  height="420px" allow="fullscreen" hidden={foundPlace?.format === "ONLINE"}></iframe>
        </Content>
      }
    />
  );
}

export default PlaceDataPage;
