pragma solidity ^0.4.21;

contract Account {

    address private accountOwner;

    string private _name;
    string private _email;

    constructor(string name, string email, address owner) public {
        accountOwner = owner;
        _name = name;
        _email = email;
    }

    function getName() public view returns (string) {
        return _name;
    }

    function setName(string name) public {
        _name = name;
    }

    function getEmail() public view returns (string) {
        return _email;
    }

    function setEmail(string email) public {
        _email = email;
    }

    function getOwner() public view returns (address) {
        return accountOwner;
    }
}

contract AccountManagement {

    Account[] private accounts;

    function addAccount(string name, string email) public {
        accounts.push(new Account(name, email, msg.sender));
    }

    function getAllAccounts() public view returns (Account[]) {
        return accounts;
    }
}