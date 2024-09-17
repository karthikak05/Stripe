import StripeCheckout from "../../components/Stripe";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <StripeCheckout/>
    </div>
  );
}
