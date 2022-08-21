import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import WalletConnectProvider from '@walletconnect/ethereum-provider';

const rpcUrls = {
    4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed4.binance.org',
    97: 'https://data-seed-prebsc-1-s2.binance.org:8545'
}

export let walletconnectConnector = new WalletConnectConnector({
    supportedChainIds: [4, 56, 97],
    rpc: rpcUrls,
    infuraId: "9314801b93074c97b219cbf254837442",
    bridge: 'https://bridge.walletconnect.org',
    chainId: 97
    // qrcode: true,
});
