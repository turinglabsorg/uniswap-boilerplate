const { ethers, utils } = require("ethers");
const fs = require('fs')

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./scripts/utils/uniswap.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", artifact, wallet)

  const result = await contract.wrapETH(utils.parseEther("10"), { value: utils.parseEther("10") })
  console.log("Waiting at:", result.hash)
  const receipt = await result.wait()
  console.log("💸 Gas used:", receipt.gasUsed.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
