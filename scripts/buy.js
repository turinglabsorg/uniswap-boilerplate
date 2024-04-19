const { ethers, utils } = require("ethers");
const fs = require('fs')

async function approve(address, amount) {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./scripts/utils/erc20.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", artifact, wallet)

  const result = await contract.approve(address, amount)

  console.log("Approved at:", result.hash)
  const receipt = await result.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
  return true
}

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/UniswapSwap.sol/UniswapSwap.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(configs.contract_address.swap, artifact.abi, wallet)

  const amount = ethers.utils.parseEther("1002").toString()

  console.log("Approving..")
  await approve(configs.contract_address.swap, amount)
  console.log("Approving..")
  await approve(configs.constructor_arguments.swap[0], amount)
  console.log("Approve done.")
  const result = await contract.buyDAI(amount)
  console.log("Bought at:", result.hash)
  const receipt = await result.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
