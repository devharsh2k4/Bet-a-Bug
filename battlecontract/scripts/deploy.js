async function main() {
    // Get the contract factory for CodingBattle
    const CodingBattle = await ethers.getContractFactory("CodingBattle");
  
    // Deploy the contract (constructor is payable, so deploy with initial ETH if needed)
    const codingBattle = await CodingBattle.deploy();
    await codingBattle.deployed();
  
    console.log("CodingBattle deployed to:", codingBattle.address);
  }
  
  // Execute the main function
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  