
# Backend Documentation

## Table of Contents

- [Overview](#overview)
- [Setting Up the Local Environment](#setting-up-the-local-environment)
    - [Creating a Virtual Environment](#creating-a-virtual-environment)
    - [Installing Requirements](#installing-requirements)
    - [Running the Backend](#running-the-backend)
    - [Using Docker](#using-docker)
- [API Methods](#api-methods)
- [Deployed Links](#deployed-links)

## Overview

This documentation provides an overview of the Python FastAPI backend designed to interact with the specified smart contract. The backend offers a series of endpoints for interacting with the blockchain, facilitating various operations on the smart contract.

## Setting Up the Local Environment

### 1. **Creating a Virtual Environment**

To set up the local environment, users should first create a virtual environment. Follow this guide to create a virtual environment in Python: [How to Create a Virtual Environment in Python](https://medium.com/@KiranMohan27/how-to-create-a-virtual-environment-in-python-be4069ad1efa).

### 2. **Installing Requirements**

After setting up the virtual environment, install the required dependencies by running:

```bash
pip install -r requirements.txt
```

### 3. **Running the Backend**

To start the backend, execute the `run.sh` script:

```bash
source ./run.sh
```
This script will start the FastAPI server, making the backend accessible.

- Note: The backend can be accessed locally at http://127.0.0.1:8000.


### 4. **Using Docker**

Alternatively, you can use Docker to run the backend. To build and run the Docker container, use the following commands:

```bash
docker build -t backend-image .
docker run -p 80:80 backend-image
```

This will expose the backend on port 80.

## API Methods

The backend provides several methods for interacting with the smart contract. Below are the key endpoints:

- **`hello_world`**: A basic endpoint for testing the API.
- **`get_token_info`**: Retrieves information about the token, such as name, symbol, and total supply.
- **`get_balance`**: Retrieves the token balance of a specified address.
- **`is_paused`**: Checks if the smart contract is paused.
- **`is_pauser`**: Verifies if a specified address has the role of a pauser.
- **`is_minter`**: Verifies if a specified address has the role of a minter.
- **`is_admin`**: Verifies if a specified address has administrative privileges.

For detailed information on these and other endpoints, refer to the API documentation.

## Deployed Links

Here are the links to access the deployed API and its documentation:

- **API Base URL**: [https://erc20mintable-production.up.railway.app](https://erc20mintable-production.up.railway.app)
- **API Documentation**: [https://erc20mintable-production.up.railway.app/docs](https://erc20mintable-production.up.railway.app/docs)

These links provide access to the backend API and its interactive documentation, where users can explore and test the available endpoints.