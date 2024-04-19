const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const configs = JSON.parse(fs.readFileSync(process.env.CONFIG).toString())
  console.log('Deploying contract..')

  // Deploy LP
  const LP = await hre.ethers.getContractFactory(configs.contract_name.lp);
  const contractLP = await LP.deploy(...configs.constructor_arguments.lp);
  console.log('Deploy transaction is: ' + contractLP.deployTransaction.hash)
  await contractLP.deployed();
  console.log("Contract deployed to:", contractLP.address);
  configs.contract_address.lp = contractLP.address

  // Deploy swap
  const Swap = await hre.ethers.getContractFactory(configs.contract_name.swap);
  const contractSwap = await Swap.deploy(...configs.constructor_arguments.swap);
  console.log('Deploy transaction is: ' + contractSwap.deployTransaction.hash)
  await contractSwap.deployed();
  console.log("Contract deployed to:", contractSwap.address);
  configs.contract_address.swap = contractSwap.address

  // Save to disk
  fs.writeFileSync(process.env.CONFIG, JSON.stringify(configs, null, 4))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
