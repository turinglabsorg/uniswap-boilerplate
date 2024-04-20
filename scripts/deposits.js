const { ethers, utils } = require("ethers");
const fs = require('fs')


async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  const artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/UniswapLP.sol/UniswapLP.json'))
  const provider = new ethers.providers.JsonRpcProvider(configs.provider);
  const wallet = new ethers.Wallet(configs.owner_key).connect(provider)
  const contract = new ethers.Contract(configs.contract_address.lp, artifact.abi, wallet)
  console.log("LP contract address:", configs.contract_address.lp)
  const lpTokenCounter = await contract.lpTokenCounter()
  console.log("LP token counter:", lpTokenCounter.toString())
  const deposits = []
  for (let i = 0; i < lpTokenCounter; i++) {
    const tokenId = await contract.lpTokens(i)
    const deposit = await contract.deposits(tokenId)
    console.log("Token ID:", tokenId.toString())
    console.log("Owner:", deposit.owner)
    console.log("Amount0:", deposit.token0.toString())
    console.log("Amount1:", deposit.token1.toString())
    console.log("Liquidity:", deposit.liquidity.toString())
    console.log("--")
    deposits.push(deposit)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
