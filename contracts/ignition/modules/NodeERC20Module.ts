import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NodeERC20Module", (m) => {
  const deployer = m.getAccount(0);
  // get the deployer address
  const token = m.contract("NodeERC20", [deployer, deployer, deployer]);

  return { token };
});