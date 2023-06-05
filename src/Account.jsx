import { useEffect, useState } from 'react';
import { alchemy, utils } from "./alchemy_config";

function Account({ address, setAddress }) {
    const [balance, setBalance] = useState("");
    const [transactionCount, setTransactionCount] = useState("");
    const [nftCount, setNftCount] = useState("");
    const [ensAddress, setEnsAddress] = useState("");

    async function getAttributes(evt) {
        evt.preventDefault();

        const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
        const nfts = await alchemy.nft.getNftsForOwner(address, {contractAddresses: [ensContractAddress],});
        if (nfts && nfts.ownedNfts && nfts.ownedNfts.length > 0) {
          setEnsAddress(nfts.ownedNfts[0].title);
        } else {
          setEnsAddress("No ENS address on file")
        }


        const response = await alchemy.core.getBalance(address);
        const balEth = utils.formatEther(response.toString())
        setBalance(balEth);

        const tCount = await alchemy.core.getTransactionCount(address);
        setTransactionCount(tCount);

        const nftCount = (await alchemy.nft.getNftsForOwner(address)).totalCount;
        setNftCount(nftCount);

        document.getElementById("add_attrs").style.display = "";

    }


    async function displayAddress(evt) {
      const address =  evt.target.value;
      setAddress(address);
    }
  
    return (
      <div className="container block">
        <h1>Account Explorer</h1>
        <label>
        Account Name
        <input placeholder="Type an address, for example: 0x985..." value={address} onChange={displayAddress}></input>
      </label>
        <button type="button" className="button" onClick={getAttributes}>Get Address Details</button>
        <div id="add_attrs" style={{display: "none"}}>
          <ul>
              <li>ENS Domain: {ensAddress}</li>
              <li>Balance: {balance} ETH</li>
              <li>Transaction Count: {transactionCount}</li>
              <li>NFT Count: {nftCount}</li>
          </ul>          
        </div>
      </div>
    );
  }

  export default Account;