from web3 import Web3
from modules.files import FileHelpers


class NodeERC20Interface:
    def __init__(self, web3: Web3, contract_address: str, contract_abi_path: str):
        # load the contract abi
        contract_abi = FileHelpers(contract_abi_path).read_json()

        # set the web3 and the contract in the class
        self.web3 = web3
        self.contract = self.web3.eth.contract(
            address=contract_address, abi=contract_abi
        )

    def get_token_details(self):
        # call the get token details function of the contract
        return self.contract.functions.getTokenDetails().call()
