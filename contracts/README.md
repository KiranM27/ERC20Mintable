# NodeERC20 Token

NodeERC20 is an ERC20-compliant token with additional features such as burnable, pausable, and role-based access control, deployed on the Sepolia testnet. This README provides an overview of the token, instructions for setting up the development environment, running tests, deploying the contract, and verifying it on Etherscan.

## Table of Contents
- [Overview](#overview)
- [Testnet Overview](#testnet-overview)
- [Project Setup](#project-setup)
- [Running Tests](#running-tests)
- [Setting Up Environment Variables](#setting-up-environment-variables)
- [Deployment Guide](#deployment-guide)
- [Verifying on Etherscan](#verifying-on-etherscan)
- [Customizing the Contract](#customizing-the-contract)
- [Design Considerations](#design-considerations)

## Overview

NodeERC20 is a smart contract that implements an ERC20 token with the following features:
- **Burnable**: Allows tokens to be burned, reducing the total supply.
- **Pausable**: Allows token transfers to be paused and unpaused.
- **Role-Based Access Control**: Uses OpenZeppelin's `AccessControl` for managing roles such as `DEFAULT_ADMIN_ROLE`, `PAUSER_ROLE`, and `MINTER_ROLE`.

## Testnet Overview

The contract is deployed on the Sepolia testnet. Ensure you have a funded account on Sepolia to cover the deployment gas costs. If you need some test tokens, you can request them from the Sepolia faucet, which can be found [here](https://www.alchemy.com/faucets/ethereum-sepolia).

## Project Setup
To set up the project, install all the dependencies by running the following command:

```bash
yarn
```

## Running Tests

The project includes comprehensive test cases to verify the functionality and security of the smart contract. The test cases cover:

- **Mintable ERC20**:
  - Tests whether minters can mint tokens.
  - Ensures non-minters cannot mint tokens.

- **Burnable ERC20**:
  - Verifies that token holders can burn their tokens.
  - Ensures non-holders cannot burn tokens.

- **Pausable Access Control**:
  - Confirms that admins can grant and revoke the `PAUSER_ROLE`.
  - Checks if only users with the `PAUSER_ROLE` can pause the contract.
  - Ensures non-admins cannot grant or revoke the `PAUSER_ROLE`.

- **Minter Access Control**:
  - Confirms that admins can grant and revoke the `MINTER_ROLE`.
  - Checks if only users with the `MINTER_ROLE` can mint tokens.
  - Ensures non-admins cannot grant or revoke the `MINTER_ROLE`.

- **Transferrable ERC20**:
  - Verifies that token holders can transfer tokens.
  - Ensures non-holders cannot transfer tokens.

To run the tests, execute the following command:

```bash
npx hardhat test
```

## Setting Up Environment Variables

Before deploying the contract or running any scripts, set up your environment variables by creating a `.env` file in the root directory of the project. You can use the `.env.template` file as a reference.

`.env.template`
```env
# for verification of the contract that will be deployed 
ETHERSCAN_API_KEY="api_key_here"

# rpc urls
SEPOLIA_ETH_TESTNET_RPC_URL="rpc_url_here"

# wallet private keys
# keys used for deploying the contracts 
DEPLOYER_PRIVATE_KEY="private_key_here"
```

- `ETHERSCAN_API_KEY`: Your Etherscan API key for verifying the contract on Etherscan. You can get an API key by creating an account on [Etherscan](https://etherscan.io/).
- `SEPOLIA_ETH_TESTNET_RPC_URL`: The RPC URL for the Sepolia testnet. If you don't have one, you can use a public RPC URL such as https://ethereum-sepolia-rpc.publicnode.com
- `DEPLOYER_PRIVATE_KEY`: The private key of the account that will deploy the contract. Ensure the account has enough funds to cover the deployment gas costs.

## Deployment Guide
To deploy the contract on the sepolia testnet, we will be using the HardHat Ignition system. This allows us to deploy the contract to the sepolia testnet with a single command.

To deploy the contract, run the following command:

```bash
npx hardhat ignition deploy ./ignition/modules/NodeERC20Module.ts --network sepolia --deployment-id nodeerc20
```

Feel free to change the deployment id to something else if you want to deploy the contract with a different id. Once deployed, note down the contract address and the transaction hash since we will be using them to verify the contract on Etherscan.

## Verifying on Etherscan

To verify the smart contract on Sepolia Etherscan, use the Hardhat verification plugin. Run the following command:

```bash
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS> "<constructor_argument_1>" "<constructor_argument_2>" "<constructor_argument_3>"
```

Replace the placeholders with the following values:
- `<DEPLOYED_CONTRACT_ADDRESS>`: The address of the deployed contract.
- `<constructor_argument_1>`: The deployer address.
- `<constructor_argument_2>`: The deployer address.
- `<constructor_argument_3>`: The deployer address.


## Customizing the Contract

To customize the name, symbol, and other parameters of the `NodeERC20` contract, you need to modify the constructor parameters in the contract source file. Specifically, edit the following lines in the `NodeERC20.sol` file:

### NodeERC20.sol
```solidity
constructor(
    address defaultAdmin,
    address pauser,
    address minter
) ERC20("Node", "NODE") {
    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);
    _grantRole(MINTER_ROLE, minter);
}
```

- Token Name: Change the first argument of the `ERC20` constructor to set the token name.
- Token Symbol: Change the second argument of the `ERC20` constructor to set the token symbol.


### Ignition Module

If you want to change the constructor arguments when deploying the contract, you should also update the corresponding line in the Ignition module (`NodeERC20Module.ts`):
```typescript
const token = m.contract("NodeERC20", [deployer, deployer, deployer]);
```

Ensure that the deployer address is set correctly based on your setup and the new contract parameters.
After making these changes, recompile the contract and follow the deployment steps outlined earlier to deploy your customized contract.

## Design Considerations

The NodeERC20 contract is designed to be a versatile and extensible ERC20 token implementation with the following key features:

1. **Transferrable, Mintable, and Burnable**: The contract supports token transfers, minting new tokens, and burning existing ones. These features fulfill common requirements for an ERC20 token, making it suitable for a wide range of applications.


Additional features can be added to enhance the token's functionality and security. Some of the possible extensions include:

1. **Potential for a Mint Cap**: While the current implementation does not impose a maximum limit on the number of tokens that can be minted, this feature can be easily added using OpenZeppelin's `ERC20Capped` extension. This would enforce a cap on the total supply, preventing excessive token inflation.

2. **Permit Functionality**: The `Permit` extension, part of OpenZeppelin's `ERC20Permit` contract, allows for off-chain signatures. This feature can be useful for authorizing token transfers and approvals without requiring on-chain transactions, thereby reducing gas costs and improving user experience.

3. **Additional Features**: 
   - **Timelocks**: Implementing a timelock mechanism can restrict certain operations until a specified time has passed, adding an extra layer of security.
   - **Staking and Reward Distribution**: Integrating staking mechanisms and reward distribution can enhance the token's utility, especially in DeFi applications.

These features have not been implemented in the current version to keep the contract lightweight and maintain extensibility. However, they can be added seamlessly by extending the existing contract with the relevant OpenZeppelin libraries and custom logic.

The modular nature of the contract design allows for easy integration of additional features, making it adaptable to various use cases and evolving project requirements. This flexibility ensures that the NodeERC20 token can grow and adapt alongside the needs of its users and developers.