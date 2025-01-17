# Arkthemist Project Contracts

## Escrow Contract

The Escrow contract provides a secure way to handle transactions between parties using ERC20 tokens. It implements a system where orders can be created, paid for, and completed, with built-in safety mechanisms.

### Overview

The contract uses OpenZeppelin's ERC20 implementation and provides functionality for:

- Creating and managing orders
- Handling payments
- Completing transactions with designated winners
- Cancelling orders when needed

### Contract Functions

#### View Functions

1. `get_order_amount(order_id: u256) -> u256`

   - Returns the amount of tokens associated with a specific order

2. `get_order_recipient_address(order_id: u256, recipient: felt252) -> ContractAddress`

   - Returns the address of a specific recipient for a given order

3. `get_order_state(order_id: u256) -> felt252`

   - Returns the current state of an order
   - Possible states: 'NotPaid', 'Paid', 'Completed', 'Cancelled'

#### Transaction Functions

1. `create_order(amount: u256, recipients: Array<felt252>, addresses: Array<ContractAddress>) -> u256`

   - Creates a new order with specified amount and recipients
   - Returns the newly created order ID
   - Validates that recipients and addresses arrays have the same length

2. `cancel_order(order_id: u256)`

   - Cancels an existing order
   - Sets the order state to 'Cancelled'

3. `complete_order(order_id: u256, winner: felt252)`

   - Completes an order by transferring tokens to the winner
   - Requires the order to be in 'Paid' state
   - Transfers the specified amount to the winner's address

4. `pay_order(order_id: u256)`
   - Processes payment for an order
   - Requires the order to be in 'NotPaid' state
   - Transfers tokens from the caller to the contract

### Internal Functions

1. `_validate(buyer: ContractAddress, amount: u256)`
   - Internal function to validate buyer's token balance
   - Ensures the buyer has sufficient tokens for the transaction

### Dependencies

- OpenZeppelin Contracts (ERC20 implementation)
- Starknet Standard Library

### Contract States

Orders in the system can have the following states:

- `NotPaid`: Initial state when an order is created
- `Paid`: State after successful payment
- `Completed`: State after order completion with winner selected
- `Cancelled`: State when order is cancelled

### Storage Structure

The contract maintains several storage mappings:

- `orders`: Counter for order IDs
- `orders_amount`: Maps order IDs to token amounts
- `orders_addresses`: Maps order IDs and recipients to addresses
- `order_states`: Maps order IDs to their current state
- `erc20`: ERC20 token dispatcher
- `token_address`: Address of the ERC20 token contract

### Security Considerations

- The contract includes balance validation before transfers
- State transitions are properly checked and enforced
- Uses OpenZeppelin's secure ERC20 implementation
- Includes proper assertions for critical operations

## Development

This project is currently under development. For more information about contributing or using these contracts, please contact the project maintainers.

## Deployment Guide

### Prerequisites

- Scarb installed (for building Cairo contracts)
- Starkli installed (for contract deployment)
- Access to Starknet Sepolia testnet

### Step 1: Build the Contract

```bash
scarb build
```

### Step 2: Setup Starkli Account and Keystore

Before declaring or deploying contracts, you need to set up your account and keystore:

1. Create a new keystore:

```bash
starkli signer keystore new /path/to/key.json
```

- You'll be prompted to enter a password
- Save the keystore path:

```bash
export STARKNET_KEYSTORE="/path/to/key.json"
```

2. Initialize an account:

```bash
starkli account oz init /path/to/account.json
```

3. Fund and deploy the account:

```bash
starkli account deploy /path/to/account.json
```

- You'll need to fund the displayed address with ETH
- After funding, press ENTER to continue deployment
- Save the account path:

```bash
export STARKNET_ACCOUNT="/path/to/account.json"
```

### Step 3: Declare the Contract

```bash
starkli declare --watch ./target/dev/escrow_escrow.sierra.json --account path/to/account.json --keystore path/to/keystore
```

- Save the class hash from the output, you'll need it for deployment
- The declaration transaction can be verified on [Starkscan](https://sepolia.starkscan.co/) or [Voyager](https://sepolia.voyager.online/)

### Step 4: Deploy the Contract

```bash
starkli deploy <class-hash> 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d --account path/to/account.json --keystore path/to/keystore
```

Where:

- `<class-hash>` is the hash received from the declare command
- The constructor argument is the STRK token address on Sepolia: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`

### Step 5: Verify Deployment

After deployment, you'll receive a contract address. You can interact with your deployed contract through:

- [Starkscan Explorer](https://sepolia.starkscan.co/)
- [Voyager Explorer](https://sepolia.voyager.online/)

Enter your contract address in either explorer to view and interact with your contract. Remember to switch to Sepolia testnet in the explorer.
