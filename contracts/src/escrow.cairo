use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
pub struct Order {
    pub recipients_addresses: Array<ContractAddress>,
    pub amount: u256,
}

#[starknet::interface]
pub trait IEscrow<TContractState> {
    fn get_order(self: @TContractState, order_id: u256) -> Order;
}

#[starknet::contract]
pub mod Escrow {
    use core::starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess};
    use super::Order;

    #[storage]
    struct Storage {
        orders: Map<u256, Order>,
    }

    #[abi(embed_v0)]
    impl Escrow of super::IEscrow<ContractState> {
        fn get_order(self: @ContractState, order_id: u256) -> Order {
            self.orders.entry(order_id).read()
        }
    }
}
