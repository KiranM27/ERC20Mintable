from fastapi import FastAPI
from modules.helpers import get_sepolia_node_erc20_interface
from modules.constants import ERROR_MESSAGE, RESPONSE

app = FastAPI()


# route to check if the server is running
@app.get("/")
async def hello_world():
    return {"message": "Hello World"}


# route to get the token info
@app.get("/get_token_info")
async def get_token_info():
    # initilize the response
    response = RESPONSE
    response["message"] = "Token details not found."
    response["data"] = {
        "name": "",
        "symbol": "",
        "decimals": 0,
        "total_supply": 0,
        "is_paused": False,
    }

    try:
        # get the token details
        node_erc20_interface = get_sepolia_node_erc20_interface()
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
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message
        return response


# route to get the balance of an address
@app.get("/get_balance/{address}")
async def get_balance(address: str):
    # initilize the response
    response = RESPONSE
    response["message"] = "Balance not found."
    response["data"] = {
        "balance": 0,
    }

    try:
        # get the balance
        node_erc20_interface = get_sepolia_node_erc20_interface()
        balance = node_erc20_interface.get_balance(address)

        # format the response
        response["message"] = "Balance found."
        response["data"] = {
            "balance": balance,
        }

        return response

    except Exception as e:
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message


# route to check if the contract is paused
@app.get("/is_paused")
async def is_paused():
    # initilize the response
    response = RESPONSE
    response["message"] = "Contract is not paused."
    response["data"] = {
        "is_paused": False,
    }

    try:
        # check if the contract is paused
        node_erc20_interface = get_sepolia_node_erc20_interface()
        is_paused = node_erc20_interface.is_paused()

        # format the response
        if is_paused:
            response["message"] = "Contract is paused."
        response["data"] = {
            "is_paused": is_paused,
        }

        return response

    except Exception as e:
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message


# route to check if an address is a pauser
@app.get("/is_pauser/{address}")
async def is_pauser(address: str):
    # initilize the response
    response = RESPONSE
    response["message"] = "Address is not a pauser."
    response["data"] = {
        "is_pauser": False,
    }

    try:
        # check if the address is a pauser
        node_erc20_interface = get_sepolia_node_erc20_interface()
        is_pauser = node_erc20_interface.is_pauser(address)

        # format the response
        if is_pauser:
            response["message"] = "Address is a pauser."
        response["data"] = {
            "is_pauser": is_pauser,
        }

        return response

    except Exception as e:
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message


# route to check if an address is a minter
@app.get("/is_minter/{address}")
async def is_minter(address: str):
    # initilize the response
    response = RESPONSE
    response["message"] = "Address is not a minter."
    response["data"] = {
        "is_minter": False,
    }

    try:
        # check if the address is a minter
        node_erc20_interface = get_sepolia_node_erc20_interface()
        is_minter = node_erc20_interface.is_minter(address)

        # format the response
        if is_minter:
            response["message"] = "Address is a minter."
        response["data"] = {
            "is_minter": is_minter,
        }

        return response

    except Exception as e:
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message


# route to check if an address is an admin
@app.get("/is_admin/{address}")
async def is_admin(address: str):
    # initilize the response
    response = RESPONSE
    response["message"] = "Address is not an admin."
    response["data"] = {
        "is_admin": False,
    }

    try:
        # check if the address is an admin
        node_erc20_interface = get_sepolia_node_erc20_interface()
        is_admin = node_erc20_interface.is_admin(address)

        # format the response
        if is_admin:
            response["message"] = "Address is an admin."
        response["data"] = {
            "is_admin": is_admin,
        }

        return response

    except Exception as e:
        message = ERROR_MESSAGE.format(str(e))
        print(message)
        response["message"] = message
        return response
