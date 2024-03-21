import { useState } from "react";
import { ReactLogo, ViteLogo } from "@shared/ui/icons/index";
import styles from "./Root.module.css";
import ButtonAuth from "@widgets/ButtonAuth";

function Root() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <ButtonAuth className={styles.button}>Войти</ButtonAuth>
      </div>
    </>
  );
}

export default Root;
