# BSC Fork Plan
## Fork it on hardhat fork mode from BSC
start local fork mode
```
yarn start-bsc-fork-network
```
open a new terminal and deploy the contract
```
yarn bsc-fork
```
start a local front-end to interact with the deployed contract
```
yarn start-dev-frontend
```
import this Private Key to MetaMask account: `0xeaa445c85f7b438dEd6e831d06a4eD0CEBDc2f8527f84Fcda6EBB5fCfAd4C0e9`. It has 10000 ETH balance.
## Fork it on BSC testnet
Things to note:
- Change everything related to ETH to BNB
- Change everything related to uniswap to pancakeswap
- Customize LUSD and LQTY to a BSC version

deploy to BSC testnet to use real price feed on BNB
```
yarn deploy --network bsctestnet --use-real-price-feed true
```

## Customization ideas/questions
- Lower the threshold of minimum 1800 LUSD debt to open a trove? (Defined in `LiquityBase.sol`)

## Contract Q&A (find the code implementation)
### How does LUSD maintain peg?
- Up force
    - User can use 1 LUSD to make redemption and get 1 USD-valued ETH (reduce the LUSD in circulation) (redemption method: https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L925).

- Down force
    - If LUSD price > 1.1, User can open a trove with 110% CR, sell the minted LUSD, and just don't repay the debt. (increase LUSD in circulation)
### How does it check the condition for liquidataion?
- Normal mode: https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L767
- Recovery mode: https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L716, https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L736
### How does it check min debt?
https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/BorrowerOperations.sol#L173
### How is LQTY minted and distributed?

### Where does this `total` come from?
https://github.com/hcheng826/liquity-fork/blob/d65f27d6c20ba1f66f23ebaeed0135ad4e718138/packages/contracts/contracts/TroveManager.sol#L731
(guess it's a default empty struct?)

## Design pattern/practice
- Contract cache? https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/TroveManager.sol#L646
- Write the deployed addresses to a json file
- Use setAddress function to set up all the dependencies (connect all together) after deploying all the contracts https://github.com/hcheng826/liquity-fork/blob/6dbfd73baefdcac49d20b50a4c1c9a8c1c4afdf9/packages/contracts/contracts/BorrowerOperations.sol#L98
- BaseContract setting up all the constants



## README from original Repo: https://github.com/liquity/dev/blob/main/README.md
