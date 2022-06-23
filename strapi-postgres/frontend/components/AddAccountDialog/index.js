import { useState } from "react";
import axios from "axios";

export default function AddAccountDialog({ closeModal }) {
  const [disable, setDisable] = useState(false);

  async function addAccount(e) {
    setDisable(true);
    const accountName = e.target.accountName.value;
    const accountBalance = e.target.accountBalance.value;
    // add account
    await axios.post("http://localhost:1337/api/accounts", {
      data: {
        name: accountName,
        balance: parseFloat(accountBalance),
      },
    });
    setDisable(false);
    closeModal();
    location.reload();
  }

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Account</h3>
          <span
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={closeModal}
          >
            X
          </span>
        </div>
        <form onSubmit={addAccount}>
          <div className="modal-body content">
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div className="inputField">
                <div className="label">
                  <label>Name</label>
                </div>
                <div>
                  <input id="accountName" name="accountName" type="text" />
                </div>
              </div>
              <div className="inputField">
                <div className="label">
                  <label>Balance($):</label>
                </div>
                <div>
                  <input
                    id="accountBalance"
                    name="accountBalance"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={disable}
              className="btn-danger"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button disabled={disable} className="btn" type="submit">
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}