from fastapi import FastAPI
from modules.helpers import get_sepolia_eth_testnet_web3
from modules.constants import SEPOLIA_ETH_TESTNET_NODE_ERC20_ADDRESS
from modules.web3 import NodeERC20Interface

app = FastAPI()


# route to check if the server is running
@app.get("/")
async def hello_world():
    return {"message": "Hello World"}


# route to get the token info
@app.get("/get_token_info")
async def get_token_info():
    response = {
        "message": "Token details not found.",
        "data": {
            "name": "",
            "symbol": "",
            "decimals": 0,
            "total_supply": 0,
            "is_paused": False,
        },
    }

    try:
        # setup the constants
        web3 = get_sepolia_eth_testnet_web3()
        contract_address = SEPOLIA_ETH_TESTNET_NODE_ERC20_ADDRESS
        contract_abi_path = "./abis/NodeERC20.json"

        # get the token details
        node_erc20_interface = NodeERC20Interface(
            web3, contract_address, contract_abi_path
        )
        [name, symbol, decimals, total_supply, is_paused] = (
            node_erc20_interface.get_token_details()
        )

        # format the response
        response["message"] = "Token details found."
        response["data"] = {
            "name": name,
            "symbol": symbol,
            "decimals": decimals,
            "total_supply": total_supply,
            "is_paused": is_paused,
        }

        return response

    except Exception as e:
        response["message"] = "An error occurred. Error: {}".format(str(e))
        return response
