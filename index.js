
import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw


async function connect(){
    if (typeof window.ethereum !== "undefined") {
        try {
          await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
          console.log(error)
        }
        connectButton.innerHTML = "Connected"
        // const accounts = await ethereum.request({ method: "eth_accounts" })
        // console.log(accounts)
      } else {
        connectButton.innerHTML = "Please install MetaMask"
      }
}  

async function getBalance(){
    if(typeof window.ethereum != undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance));
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log("fund");
    console.log(`Funding with ${ethAmount}...`)
    if(typeof window.ethereum != undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
        const txResponse = await contract.fund({value : ethers.utils.parseEther(ethAmount)})
        await listenForTxMined(txResponse, provider)
        console.log("Done");
        }catch(e){
            console.log(e);
        }
     } else {
    }
}

async function withdraw(){
    if(typeof window.ethereum != undefined){
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const txResponse = await contract.withdraw()
            listenForTxMined(txResponse, provider)
        }catch (error){
            console.log(error);
        }
    }
}

function listenForTxMined(txresponse, provider){
    console.log(`Mining ${txresponse.hash}...`);
    return new Promise((resolve, reject)=>{
        provider.once(txresponse.hash, (txReceipt)=>{
            console.log(`Completed with ${txReceipt.confirmations} confirmations`);
            resolve()
        })
    })
}