import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react";
import abi from '../utils/GoodLuckSGWToken.json';
const getEthereumObject =()=>window.ethereum;

export default function erc20info(){

    const contractAddress =  "0x7110aB4fe48fF04E6b22639c6F1b52B3eb7c28C2";
    const contractABI = abi.abi;
  
    const [currentAccount, setCurrentAccount] = useState("");
    const [totalsupply, Settotalsupply] = useState("");
    const [balanceOf, SetbalanceOf] = useState("");
    const [ReiceiveAddress, setReceiveAdress] = useState("");
    const [amount, seTamount] = useState("");
    const connectWallet = async () => {
        try{
          const ethereum = await getEthereumObject();
          if(!ethereum){
            alert("Install MetaMask");
            return;
          }
          const accounts = await ethereum.request({method : "eth_requestAccounts"});
          setCurrentAccount(accounts[0]);
          alert("Wallet Connect Success!!!");
        }catch(err)
        {
          console.error(err);
        }
      }
      const checkIfWalletIsConnected = async () => {
        try {
          const { ethereum } = window;
          if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
          } else {
            console.log("We have the ethereum object", ethereum);
          }
    
          const accounts = await ethereum.request({ method: 'eth_accounts' });
    
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
          } else {
            console.log("No authorized account found")
          }
        } catch (error) {
          console.log(error);
        }
      }
      const getInfo =async () => {
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const erc20Contract = new ethers.Contract(contractAddress, contractABI, signer);
                console.log("welcome");
                let tmp_supply:any = await erc20Contract.totalSupply();
                Settotalsupply(tmp_supply.toString());
                tmp_supply = await erc20Contract.balanceOf("0xedd3c4096e5a308718d63c4383dafbf113cd55d5");
                SetbalanceOf(tmp_supply.toString());
            }
        }catch(err){
            console.log(err);
        }
      }
      const SendAmount =async()=>{
        try{
              const {ethereum} = window;
            if(ethereum){
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const erc20Contract = new ethers.Contract(contractAddress, contractABI, signer);
              console.log("welcome");
              let tmp_supply:boolean = await erc20Contract.transfer(ReiceiveAddress,BigNumber.from(amount));
              if(tmp_supply)
              {
                alert("Sucess!!");
              }
              else{
                alert("Failed!!");
              }
          }
        }catch(err){
          console.log(err);
        }
      }
      useEffect(()=>{
        checkIfWalletIsConnected();
      },[]);
    return(
        <div className="w-screen">
            <div className="mt-[50px] ml-[40px]">
                <div className="">
                    <div className="flex justify-start">
                        <h1>Supply</h1>
                        <p className="ml-5">{totalsupply}</p>
                    </div>
                    <div className="mt-5 flex justify-start">
                        <h1>Balance</h1>
                        <p className="ml-5">{balanceOf}</p>
                    </div>

                    <div className="mt-[30px]">
                        <div className="flex flex-wrap">
                            <button className="px-4 py-2 text-lg border-solid border-black border-2 rounded-full" onClick={()=>connectWallet()}>
                                Connect
                            </button>
                            <button className="ml-5 px-4 py-2 text-lg border-solid border-black border-2 rounded-full" onClick={()=>getInfo()}>
                                GetInfo
                            </button>
                        </div>
                        <div className="mt-5 flex flex-wrap">
                          <input type="text" className="text-center border-solid border-black border-2" placeholder="Address recipient" value={ReiceiveAddress} 
                            onChange={(e)=> setReceiveAdress(e.target.value)}/>
                          <input type="number" className="text-center ml-4 border-solid border-black border-2 " placeholder="amount" value={amount}
                            onChange={(e)=> seTamount(e.target.value)}/>
                          <button className="ml-5 px-4 py-2 text-lg border-solid border-black border-2 rounded-full" 
                            onClick={()=>SendAmount()}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}