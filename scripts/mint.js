const { ethers, utils } = require("ethers");
const fs = require('fs')

async function approve(address, amount, token) {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./scripts/utils/erc20.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(token, artifact, wallet)
  const balance = await contract.balanceOf(wallet.address)
  console.log("Balance:", balance.toString())
  console.log("Approving:", address, "with amount:", amount)
  const result = await contract.approve(address, amount)
  console.log("Approved at:", result.hash)
  const receipt = await result.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
  const allowance = await contract.allowance(wallet.address, address)
  console.log("Allowance:", allowance.toString())
  return allowance.toString()
}

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/UniswapLP.sol/UniswapLP.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(configs.contract_address.lp, artifact.abi, wallet)
  const amount0 = ethers.utils.parseEther("3000").toString()
  const amount1 = ethers.utils.parseEther("1").toString()
  await approve(configs.contract_address.lp, amount0, "0x6B175474E89094C44Da98b954EedeAC495271d0F")
  await approve(configs.contract_address.lp, amount1, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
  const result = await contract.mintNewPosition(amount0, amount1)
  console.log("Waiting at:", result.hash)
  const receipt = await result.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
  console.log("Mint done.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
