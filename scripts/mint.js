const { ethers, utils } = require("ethers");
const fs = require('fs')

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/UniswapLP.sol/UniswapLP.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(configs.contract_address.lp, artifact.abi, wallet)

  const result = await contract.mintNewPosition()
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
