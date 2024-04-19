const { ethers, utils } = require("ethers");
const fs = require('fs')

async function balance(contractAddress) {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./scripts/utils/erc20.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(contractAddress, artifact, wallet)
  const balance = await contract.balanceOf(wallet.address)
  console.log("Balance:", balance.toString())
}

async function main() {
  await balance("0x6B175474E89094C44Da98b954EedeAC495271d0F")
  await balance("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
  await balance("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
