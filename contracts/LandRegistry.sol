// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    address public admin;

    enum PropertyStatus {
        REGISTERED,
        VERIFIED,
        TRANSFERRED
    }

    struct Property {
        uint256 propertyId;
        string propertyNumber;
        string location;
        uint256 area;
        string propertyType;
        address currentOwner;
        address previousOwner;
        string documentHash;
        bool verified;
        PropertyStatus status;
        uint256 registeredAt;
        uint256 lastTransferredAt;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => bool) public propertyExists;

    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner
    );

    event PropertyVerified(
        uint256 indexed propertyId
    );

    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier propertyMustExist(uint256 _propertyId) {
        require(propertyExists[_propertyId], "Property does not exist");
        _;
    }

    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(
            msg.sender == properties[_propertyId].currentOwner,
            "Only property owner allowed"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerProperty(
        uint256 _propertyId,
        string memory _propertyNumber,
        string memory _location,
        uint256 _area,
        string memory _propertyType,
        address _initialOwner,
        string memory _documentHash
    ) public onlyAdmin {

        require(
            !propertyExists[_propertyId],
            "Property already exists"
        );

        require(
            _initialOwner != address(0),
            "Invalid owner address"
        );

        require(
            _area > 0,
            "Area must be greater than zero"
        );

        require(
            bytes(_documentHash).length > 0,
            "Document hash required"
        );

        properties[_propertyId] = Property(
            _propertyId,
            _propertyNumber,
            _location,
            _area,
            _propertyType,
            _initialOwner,
            address(0),
            _documentHash,
            false,
            PropertyStatus.REGISTERED,
            block.timestamp,
            0
        );

        propertyExists[_propertyId] = true;

        emit PropertyRegistered(
            _propertyId,
            _initialOwner
        );
    }

    function verifyProperty(
        uint256 _propertyId
    )
        public
        onlyAdmin
        propertyMustExist(_propertyId)
    {
        require(
            !properties[_propertyId].verified,
            "Property already verified"
        );

        properties[_propertyId].verified = true;
        properties[_propertyId].status =
            PropertyStatus.VERIFIED;

        emit PropertyVerified(_propertyId);
    }

    function transferOwnership(
        uint256 _propertyId,
        address _newOwner
    )
        public
        propertyMustExist(_propertyId)
        onlyPropertyOwner(_propertyId)
    {
        require(
            properties[_propertyId].verified,
            "Property is not verified"
        );

        require(
            _newOwner != address(0),
            "Invalid new owner"
        );

        address oldOwner =
            properties[_propertyId].currentOwner;

        properties[_propertyId].previousOwner =
            oldOwner;

        properties[_propertyId].currentOwner =
            _newOwner;

        properties[_propertyId].lastTransferredAt =
            block.timestamp;

        properties[_propertyId].status =
            PropertyStatus.TRANSFERRED;

        emit OwnershipTransferred(
            _propertyId,
            oldOwner,
            _newOwner
        );
    }

    function getProperty(
        uint256 _propertyId
    )
        public
        view
        propertyMustExist(_propertyId)
        returns (Property memory)
    {
        return properties[_propertyId];
    }

    function getCurrentOwner(
        uint256 _propertyId
    )
        public
        view
        propertyMustExist(_propertyId)
        returns (address)
    {
        return properties[_propertyId].currentOwner;
    }
}