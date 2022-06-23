import { header, headerName } from "./Header.module.css";

export default function Header() {
  return (
    <section className={header}>
      <div className={headerName}>Bank Admin</div>
    </section>
  );
}