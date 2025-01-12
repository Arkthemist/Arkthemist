use starknet::ContractAddress;

#[starknet::interface]
pub trait IEscrow<TContractState> {
    fn get_order_amount(self: @TContractState, order_id: u256) -> u256;
    fn get_order_recipient_address(self: @TContractState, order_id: u256, recipient: felt252) -> ContractAddress;
    fn create_order(ref self: TContractState, amount: u256, recipients: Array<felt252>, addresses: Array<ContractAddress>) -> u256;
}

#[starknet::contract]
pub mod Escrow {
    use starknet::storage::{
        StorageMapReadAccess, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapWriteAccess, Map
    };
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        orders: u256,
        orders_amount: Map<u256, u256>,
        orders_addresses: Map<(u256, felt252), ContractAddress>,
        order_states: Map<u256, bool>,
    }

    #[abi(embed_v0)]
    impl Escrow of super::IEscrow<ContractState> {
        fn get_order_amount(self: @ContractState, order_id: u256) -> u256 {
            self.orders_amount.read(order_id)
        }

        fn get_order_recipient_address(self: @ContractState, order_id: u256, recipient: felt252) -> ContractAddress {
            self.orders_addresses.read((order_id, recipient))
        }

        fn create_order(
            ref self: ContractState, amount: u256, recipients: Array<felt252>, addresses: Array<ContractAddress>
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

            self.order_states.write(order_id, true);
            order_id
        }
    }
}
