import { FC, HTMLProps } from "react";
import { appendClassName } from "@shared/util";
import styles from "./index.module.css";

type Props = {
  children?: any;
  className?: string;
  type?: "button" | "submit" | "reset";
} & HTMLProps<HTMLButtonElement>;

const Button: FC<Props> = ({ className, children, ...rest }) => (
  <button className={appendClassName(styles.button, className)} {...rest}>{children}</button>
);

export default Button;
