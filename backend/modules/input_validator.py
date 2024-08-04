from web3 import Web3


class InputValidator:
    @staticmethod
    def is_address(address: str):
        # check if the address is valid
        is_address = Web3.is_address(address)
        if not is_address:
            raise ValueError(f"Invalid address: {address}")
