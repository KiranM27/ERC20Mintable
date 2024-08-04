from web3 import Web3
from modules.constants import SEPOLIA_ETH_TESETNET_RPC_URL


def get_web3_provider(rpc_url: str) -> Web3:
    return Web3(Web3.HTTPProvider(rpc_url))


def get_sepolia_eth_testnet_web3() -> Web3:
    return get_web3_provider(SEPOLIA_ETH_TESETNET_RPC_URL)
