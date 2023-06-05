import { useEffect, useState } from 'react';
import { alchemy, utils } from "./alchemy_config";

function Block({ address, setAddress }) {
    const [currentBlockNumber, setCurrentBlockNumber] = useState("");
    const [blockNumber, setBlockNumber] = useState("");
    const [blockAttrs, setBlockAttrs] = useState({});
    const [blockTxs, setBlockTxs] = useState([]);
    const [displayAtts, setDisplayAtts] = useState(false);
    const [displayTxs, setDisplayTxs] = useState(false);
  
    async function getCurrentBlockNumber() {
        setBlockNumber(await alchemy.core.getBlockNumber());
        document.getElementById("attrs").style.display = "none";
        setDisplayAtts(false);
        setDisplayTxs(false);
    }

    async function setBlockNum(evt) {
      const blockNum = evt.target.value;
      setBlockNumber(blockNum);
    }

    async function setAddresstoMiner() {
      setAddress(blockAttrs.miner);
    }

    async function getAttributes(evt) {
        evt.preventDefault();

        let response = await alchemy.core.getBlockWithTransactions(blockNumber);
        response['gasPct'] = response.gasUsed / response.gasLimit;
        response.gasLimit = response.gasLimit.toString();
        response.gasUsed = response.gasUsed.toString();
        response.gasPct = parseFloat(response.gasPct * 100).toFixed(2) + "%";
        response.timestamp = new Date(response.timestamp * 1000).toUTCString();
        response['numTransactions'] = response.transactions.length;
        console.log(response.transactions);
        setBlockTxs(response.transactions);

        setBlockAttrs(response);
        document.getElementById("attrs").style.display = "";

    }

    async function getTransactions(evt) {
      evt.preventDefault();

      setDisplayTxs(true);
    }

  
    return (
      <div className="container block">
        <h1>Block Explorer</h1>
        <button type="button" className="button" onClick={getCurrentBlockNumber}>Use Current Block</button>
        <label>
        Block Number
        <input value={blockNumber} onChange={setBlockNum}></input>
        </label>
        <button type="button" className="button" onClick={getAttributes}>Get Block Attributes</button>
        <div id="attrs" style={{display: displayAtts ? "" : "none" }}>
          <ul>
              <li>Hash: {blockAttrs.hash}</li>
              <li>parentHash: {blockAttrs.parentHash}</li>
              <li># of Transactions: {blockAttrs.numTransactions}</li>
              <li>timestamp: {blockAttrs.timestamp}</li>
              <li>gasLimit: {blockAttrs.gasLimit}</li>
              <li>gasUsed: {blockAttrs.gasUsed}</li>
              <li>gasPct: {blockAttrs.gasPct}</li>
              <li>
              <a onClick={setAddresstoMiner}>miner: {blockAttrs.miner}</a>
              </li>
          </ul>
        </div>
        <button type="button" className="button" onClick={getTransactions}>Show Transactions</button>
        <div id="txs" style={{display: displayTxs ? "" : "none" }}>
        <ul id="tx_list">
          {blockTxs.map((tx, index) => {
            const truncatedFrom = tx.from ? tx.from.slice(0, 6) + "...": "Unknown";
            const truncatedTo = tx.to ? tx.to.slice(0, 6) + "...": "Unknown";

            const setAddresstoX = (address) => {
              setAddress(address);
            };

            return (
              <li key={index}>
                from:{" "}
                <a onClick={() => setAddresstoX(tx.from)}>{truncatedFrom}</a>
                , to:{" "}
                <a onClick={() => setAddresstoX(tx.to)}>{truncatedTo}</a>, value:{" "}
                {Number(utils.formatEther(tx.value._hex)).toFixed(2)}
              </li>
            );
          })}
        </ul>
        </div>
      </div>
    );
  }

  export default Block;