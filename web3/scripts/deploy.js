async function main() {
    const Battle = await ethers.getContractFactory("CodingBattle");
    const battle = await Battle.deploy();
    await battle.deployed();
    console.log("Battle deployed to:", battle.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  