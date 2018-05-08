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
    mapping(address => Account) accountsMap;

    function addAccount(string name, string email) public {
        Account a = new Account(name, email, msg.sender);
        require(accountsMap[msg.sender] == address(0));
        accounts.push(a);
        accountsMap[msg.sender] = a;
    }

    function getAllAccounts() public view returns (Account[]) {
        return accounts;
    }

    function getAccount(address a) public view returns (Account) {
        return accountsMap[a];
    }
}