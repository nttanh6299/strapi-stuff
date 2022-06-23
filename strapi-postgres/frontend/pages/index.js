import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import AccountCard from "../components/AccountCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionDialog from "../components/TransactionDialog";
import AddAccountDialog from "../components/AddAccountDialog";

export default function Home() {
  const [accounts, setAccounts] = useState([]);
  const [showTransactModal, setShowTransactModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:1337/api/accounts");
      setAccounts(data?.data);
    }
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Bank Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <div className={styles.breadcrumb}>
          <div>
            <span style={{ margin: "1px" }}>
              <button onClick={() => setShowTransactModal(true)}>
                Transact
              </button>
            </span>
            <span style={{ margin: "1px" }}>
              <button onClick={() => setShowAddAccountModal(true)}>
                Add Account
              </button>
            </span>
          </div>
        </div>
        <div className={styles.accountcontainer}>
          <div className={styles.youraccounts}>
            <h3>Accounts</h3>
          </div>
          <div>
            {accounts.map((account, i) => (
              <React.Fragment key={i}>
                <AccountCard account={account} />
                <hr />
              </React.Fragment>
            ))}
          </div>
        </div>
        {showAddAccountModal ? (
          <AddAccountDialog
            closeModal={() => setShowAddAccountModal((pV) => !pV)}
          />
        ) : null}
        {showTransactModal ? (
          <TransactionDialog
            closeModal={() => setShowTransactModal((pV) => !pV)}
          />
        ) : null}
      </main>
    </div>
  );
}
