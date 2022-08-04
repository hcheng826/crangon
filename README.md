# Crangon
Crangon is a fork of Liquity on BSC.
App URL: https://crangon.web.app
## Fork it on hardhat fork mode from BSC
start local fork mode
```
yarn start-bsc-fork-network
```
open a new terminal and deploy the contract
```
yarn bsc-fork-deploy
```
start a local front-end to interact with the deployed contract
```
yarn start-dev-frontend
// or try
yarn start-demo:dev-frontend
```
import this Private Key to MetaMask account: `0xeaa445c85f7b438dEd6e831d06a4eD0CEBDc2f8527f84Fcda6EBB5fCfAd4C0e9`. It has 10000 ETH balance.
## Fork it on BSC testnet
Things to note:
- Change everything related to ETH to BNB
- Change everything related to uniswap to pancakeswap
- Customize LUSD and LQTY to a BSC version

deploy to BSC testnet to use real price feed on BNB
```
yarn deploy --network bsctestnet --use-real-price-feed true --create-uniswap-pair true
```

## Forking customization focus
### Naming
- Forking project name: Crangon
- Stablecoin name (LUSD): CUSD
- Secondary token name (LQTY): CGN
- Need logo for CGN and CUSD
### Tokenomics and Token Distribution
- How to prepare the multisig account for 1. Bug bounty and 2. Team lockup account?
- Should we follow the design of original Liquity?
    - Tokenomics, Launch details: [Liquity](https://medium.com/liquity/liquity-launch-details-4537c5ffa9ea), [Yeti](https://blog.yetifinance.co/the-arrival-of-yetinomics-d93a78004c3b)
    - Launch sequence and vesting process: [doc ref](https://github.com/liquity/dev#launch-sequence-and-vesting-process)
        - We can directly follow this with the modifications on parameters below.
    - Relation with Pancakeswap
        - Admin creates a pool in Pancakeswap and deploy `Unipool` (LP reward contract), which knows the adress of the pool. LQTY will be minted to the `Unipool` contract.
### Custimizable Parameters
- Threshold of minimum 1800 LUSD debt to open a trove: [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/Dependencies/LiquityBase.sol#L31)
    - change to 100 CUSD
- Gas compensation for liquidation reward of 200 LUSD: [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/Dependencies/LiquityBase.sol#L28)
    - change to 10 CUSD
- Basefee for redemption and borrowing:
    - redemption min and max (0.5%, 5%): [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/TroveManager.sol#L47-L48)
        - change to (0.1%, 3%)
    - borrowing (0.5%): [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/Dependencies/LiquityBase.sol#L36)
        - change to (0.1%)
    - more details about fee calculation: [doc ref](https://github.com/liquity/dev#liquity-system-fees)
- Lockup time of 1 year: [code ref](https://github.com/hcheng826/liquity-fork/blob/3f1aa7b7f0bc319d71774ffd35a3edd47631be91/packages/contracts/contracts/LQTY/LockupContractFactory.sol#L32)
    - lockup time of 1 month
- 14-day block for redemption after launching: [code ref](https://github.com/hcheng826/liquity-fork/blob/3f1aa7b7f0bc319d71774ffd35a3edd47631be91/packages/contracts/contracts/TroveManager.sol#L51)
    - no change

## Contract Q&A (find the code implementation)
### How does LUSD maintain peg?
- Up force (price floor)
    - User can use 1 LUSD to make redemption and get 1 USD-valued ETH (reduce the LUSD in circulation) (redemption method: [code ref](https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L925)).

- Down force
    - If LUSD price > 1.1, User can open a trove with 110% CR, sell the minted LUSD, and just don't repay the debt. (increase LUSD in circulation)
### How does it check the condition for liquidataion?
- Normal mode: [code ref](https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L767)
- Recovery mode: [code ref1](https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L716), [code ref2](https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L736)
### How does it check min debt?
[code ref](https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/BorrowerOperations.sol#L173)
### How is LQTY minted and distributed?
- [code ref](https://github.com/hcheng826/liquity-fork/blob/3f1aa7b7f0bc319d71774ffd35a3edd47631be91/packages/contracts/contracts/LQTY/LQTYToken.sol#L138-L154)
- https://github.com/liquity/dev/blob/main/README.md#launch-sequence-and-vesting-process

### What are the fees?
- redemption fee: when LUSD holder redempt ETH with LUSD, a cut of the ETH is given to the LQTY staking pool. ([code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/TroveManager.sol#L1006))
- debt issuance: when borrower mint more LUSD with their trove, a cut of the LUSD is given to the LQTY staking pool.
    - openTrove: [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/BorrowerOperations.sol#L170)
    - adjustTrove: [code ref](https://github.com/hcheng826/liquity-fork/blob/b76a54fe758eb6ec1e298f79a236c8b43c88a265/packages/contracts/contracts/BorrowerOperations.sol#L276)

### Where does this `total` come from?
[code ref](https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L731)
(guess it's a default empty struct?)

### What is `hint` used in the contracts?
- used for inserting the trove to the sorted list.

## Design pattern/practice
- Contract cache? [code ref](https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/TroveManager.sol#L646)
- Write the deployed addresses to a json file
- Use setAddress function to set up all the dependencies (connect all together) after deploying all the contracts [code ref](https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/BorrowerOperations.sol#L98)
- BaseContract setting up all the constants



## README from original Repo: https://github.com/liquity/dev/blob/main/README.md
