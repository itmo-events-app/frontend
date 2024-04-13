import styles from './index.module.css'
import Button from "@widgets/main/Button";

type AssignProps = {
  messageText: string,
  onDone: () => void
}

const MessageDialogContent = (props: AssignProps) => {

  const _onDoneWrapper = () => {
    props.onDone()
  }

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <div className={styles.dialog_text}>
            {props.messageText}
          </div>
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Ок</Button>
    </div>
  );
}

export default MessageDialogContent;
