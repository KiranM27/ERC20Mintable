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

    def get_balance(self, address: str):
        # call the get balance function of the contract
        return self.contract.functions.balanceOf(address).call()

    def is_paused(self):
        # call the is paused function of the contract
        return self.contract.functions.paused().call()

    def is_pauser(self, address: str):
        # get the representation of the pauser role
        pauser_role = self.contract.functions.PAUSER_ROLE().call()

        # call the is pauser function of the contract
        return self.contract.functions.hasRole(pauser_role, address).call()

    def is_minter(self, address: str):
        # get the representation of the minter role
        minter_role = self.contract.functions.MINTER_ROLE().call()

        # call the is minter function of the contract
        return self.contract.functions.hasRole(minter_role, address).call()

    def is_admin(self, address: str):
        # get the representation of the admin role
        admin_role = self.contract.functions.DEFAULT_ADMIN_ROLE().call()

        # call the is admin function of the contract
        return self.contract.functions.hasRole(admin_role, address).call()
