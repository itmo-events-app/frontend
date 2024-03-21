import Block from "@widgets/Block";
import Button from "@widgets/auth/Button";
import Input from "@widgets/auth/Input";

import styles from './index.module.css';
import Label from "@widgets/auth/InputLabel";


function Root() {
  return (
    <>
      <div>
        <Block className={styles.block}>
          <Label value="Hello"/>
          <Input/>
          <Button>Войти</Button>
        </Block>
      </div>
    </>
  );
}

export default Root;
