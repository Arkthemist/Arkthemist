use starknet::ContractAddress;


#[starknet::interface]
pub trait IEscrow<TContractState> {
    fn get_order_amount(self: @TContractState, order_id: u256) -> u256;
    fn get_order_recipient_address(
        self: @TContractState, order_id: u256, recipient: felt252
    ) -> ContractAddress;
    fn create_order(
        ref self: TContractState,
        amount: u256,
        recipients: Array<felt252>,
        addresses: Array<ContractAddress>
    ) -> u256;
    fn cancel_order(ref self: TContractState, order_id: u256);
    fn complete_order(ref self: TContractState, order_id: u256);
    fn pay_order(ref self: TContractState, order_id: u256, token_address: ContractAddress);
}

#[starknet::contract]
pub mod Escrow {
    use starknet::storage::{
        StorageMapReadAccess, StoragePointerReadAccess, StoragePointerWriteAccess,
        StorageMapWriteAccess, Map
    };
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        orders: u256,
        orders_amount: Map<u256, u256>,
        orders_addresses: Map<(u256, felt252), ContractAddress>,
        order_states: Map<u256, felt252>,
        erc20: IERC20Dispatcher,
    }

    #[abi(embed_v0)]
    impl Escrow of super::IEscrow<ContractState> {
        fn get_order_amount(self: @ContractState, order_id: u256) -> u256 {
            self.orders_amount.read(order_id)
        }

        fn get_order_recipient_address(
            self: @ContractState, order_id: u256, recipient: felt252
        ) -> ContractAddress {
            self.orders_addresses.read((order_id, recipient))
        }

        fn create_order(
            ref self: ContractState,
            amount: u256,
            recipients: Array<felt252>,
            addresses: Array<ContractAddress>
        ) -> u256 {
            let order_id = self.orders.read() + 1;
            self.orders.write(order_id);
            self.orders_amount.write(order_id, amount);
            assert(recipients.len() == addresses.len(), 'Different lengths');
            let mut idx = 0;
            loop {
                if idx == recipients.len() {
                    break;
                }
                let recipient = *recipients.at(idx);
                let address = *addresses.at(idx);
                self.orders_addresses.write((order_id, recipient), address);
                idx += 1;
            };

            self.order_states.write(order_id, 'NotPaid');
            order_id
        }

        fn cancel_order(ref self: ContractState, order_id: u256) {
            self.order_states.write(order_id, 'Cancelled');
        }

        fn complete_order(ref self: ContractState, order_id: u256) {
            let state = self.order_states.read(order_id);
            assert(state == 'Paid', 'Order is not paid');
            self.order_states.write(order_id, 'Completed');
        }

        fn pay_order(ref self: ContractState, order_id: u256, token_address: ContractAddress) {
            let state = self.order_states.read(order_id);
            assert(state == 'NotPaid', 'Order is not payable');

            let amount = self.orders_amount.read(order_id);
            let caller = get_caller_address();
            let contract_address = get_contract_address();

            self._validate(caller, token_address, amount);
            let result = self.erc20.read().transfer_from(caller, contract_address, amount);
            assert(result, 'ERC20_TRANSFER_FAILED');

            self.order_states.write(order_id, 'Paid');
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _initialize(ref self: ContractState, token_address: ContractAddress) {
            self.erc20.write(IERC20Dispatcher { contract_address: token_address });
        }

        fn _validate(
            ref self: ContractState,
            buyer: ContractAddress,
            token_address: ContractAddress,
            amount: u256
        ) {
            self._initialize(token_address);
            let buyer_balance = self.erc20.read().balance_of(buyer);
            assert(buyer_balance >= amount, 'ERC20_NOT_SUFFICIENT_AMOUNT');
        }
    }
}
