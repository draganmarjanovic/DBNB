pragma solidity ^0.4.21;

contract Rating {
    uint8 private stars; // 0 <= stars <= 5
    
    bytes32 private title; //Non-empty, limited size
    string private comment;

    constructor(uint8 _stars, bytes32 _title, string _comment) public {
        require(0 <= _stars && _stars <= 5, "Rating must be between 0 and 5 stars");
        require(_title.length > 0, "Title must be non-empty");

        title = _title;
        comment = _comment;
        stars = _stars;
    }

    function getStars() external view returns (uint8) {
        return stars;
    }

    function getTitle() external view returns (bytes32) {
        return title;
    }

    function getComment() external view returns (string) {
        return comment;
    }
}
