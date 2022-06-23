import { useState } from "react";
import axios from "axios";

export default function TransactionDialog({ closeModal }) {
  const [disable, setDisable] = useState(false);

  async function transact(e) {
    setDisable(true);
    const sender = e.target.sender.value;
    const receiver = e.target.receiver.value;
    const amount = e.target.amount.value;
    await axios.post("http://localhost:1337/api/transfer", {
      data: { sender, receiver, amount },
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
          <h3>Transaction</h3>
          <span
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={closeModal}
          >
            X
          </span>
        </div>
        <form onSubmit={transact}>
          <div className="modal-body content">
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div className="inputField">
                <div className="label">
                  <label>Sender</label>
                </div>
                <div>
                  <input id="sender" type="text" />
                </div>
              </div>
              <div className="inputField">
                <div className="label">
                  <label>Receiver</label>
                </div>
                <div>
                  <input id="receiver" type="text" />
                </div>
              </div>
              <div className="inputField">
                <div className="label">
                  <label>Amount($)</label>
                </div>
                <div>
                  <input id="number" name="amount" type="text" />
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
              Transact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
