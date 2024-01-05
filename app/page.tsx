import Chatscreen from "@/components/Chatscreen";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Chatscreen />
    </main>
  );
}
