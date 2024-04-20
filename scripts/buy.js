const { ethers, utils } = require("ethers");
const fs = require('fs')

async function approve(address, amount) {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./scripts/utils/erc20.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", artifact, wallet)
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
  const artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/UniswapSwap.sol/UniswapSwap.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(configs.contract_address.swap, artifact.abi, wallet)

  const amountToApprove = ethers.utils.parseEther("10000").toString()
  const amountToBuy = ethers.utils.parseEther("10").toString()

  console.log("Approving:", configs.contract_address.swap)
  await approve(configs.contract_address.swap, amountToApprove)
  console.log("Approving:", configs.constructor_arguments.swap[0])
  await approve(configs.constructor_arguments.swap[0], amountToApprove)
  console.log("Amount to buy:", amountToBuy)
  console.log("Approve done.")
  const result1 = await contract.buyDAI(amountToBuy, { gasLimit: 10000000 })
  console.log("Bought DAI at:", result1.hash)
  const receipt = await result1.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
  const result2 = await contract.buyUSDC(amountToBuy, { gasLimit: 10000000 })
  console.log("Bought USDC at:", result2.hash)
  const receipt2 = await result2.wait()
  console.log("💸 Gas used:", receipt2.gasUsed.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
