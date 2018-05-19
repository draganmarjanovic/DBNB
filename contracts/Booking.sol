pragma solidity ^0.4.21;

import "./House.sol";
import "./Accounts.sol";

contract BookingManager {

    mapping(address => House[]) private accountToHome;
    mapping(address => Account[]) private homeToAccount;

    function addBooking(House house, Account account, uint64 start, uint8 duration) public {
        accountToHome[account].push(house);
        homeToAccount[house].push(account);
        house.makeBooking(account, start, duration);
        //account.confirmBooking(house, start, duration);
    }

    function getAllHomesBooked(Account acc) public view returns (House[]) {
        return accountToHome[acc];
    }

    function getAllAccountsBooked(House house) public view returns (Account[]) {
        return homeToAccount[house];
    }
}