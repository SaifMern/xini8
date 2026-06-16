import clsx from "clsx";
export default function Card({ children, className = "" }) {
  return <div className={clsx("xini-card rounded-3xl p-5 xini-soft-shadow sm:p-6", className)}>{children}</div>;
}
