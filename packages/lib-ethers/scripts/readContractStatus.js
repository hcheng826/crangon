/* eslint-disable @typescript-eslint/no-var-requires */
const { ethers } = require("hardhat");

async function main() {
    const borrowerOperationAddress = '0xD39dBFcd745800583Fbf381A18D521b1c55698b8';
    const boAbi = require('../abi/BorrowerOperations.json');

    const [account] = await ethers.getSigners();

    const boContract = await ethers.getContractAt(boAbi, borrowerOperationAddress, account);

    console.log('boContract MIN_NET_DEBT', await boContract.MIN_NET_DEBT());
}

main();
