# LandChain — Smart Contract Documentation

## 1. Contract

The main contract is:

```text
contracts/LandRegistry.sol
```

Contract name:

```solidity
LandRegistry
```

The contract manages property records and ownership state.

---

## 2. Main Responsibilities

The contract is responsible for:

1. Assigning the deployer as administrator.
2. Registering properties.
3. Preventing duplicate property IDs.
4. Verifying properties.
5. Restricting verification to the administrator.
6. Returning property details.
7. Returning the current owner.
8. Transferring ownership.
9. Recording the previous owner.
10. Restricting ownership transfer to the current owner.

---

## 3. Property Information

The property record used by the application contains information such as:

| Field | Purpose |
|---|---|
| Property ID | Unique blockchain identifier |
| Property Number | Human-readable property reference |
| Location | Property location |
| Area | Property area |
| Property Type | Residential or other property classification |
| Current Owner | Current wallet owner |
| Previous Owner | Owner before the latest transfer |
| Verified | Verification state |
| Status | Property lifecycle/verification status |
| Document Hash | Reference/hash associated with property documentation |

---

## 4. Register Property

Function:

```solidity
registerProperty(
    uint256 propertyId,
    string propertyNumber,
    string location,
    uint256 area,
    string propertyType,
    address owner,
    string documentHash
)
```

### Purpose

Creates a new property record.

### Example

```text
Property ID: 1
Property Number: P001
Location: Bangalore
Area: 1200
Property Type: Residential
Owner: <wallet address>
Document Hash: QmDummyPropertyDocument001
```

### Duplicate Protection

The contract rejects a second registration using an existing property ID.

Expected error:

```text
Property already exists
```

---

## 5. Verify Property

Function:

```solidity
verifyProperty(uint256 propertyId)
```

### Purpose

Marks a registered property as verified.

### Authorization

Only the administrator/Authority can perform this operation.

Expected unauthorized error:

```text
Only admin allowed
```

After successful verification, the property is marked as verified and its status is updated.

---

## 6. Get Property

Function:

```solidity
getProperty(uint256 propertyId)
```

### Purpose

Returns the complete property record for the specified property ID.

This function is used by:

- Automated tests
- Interaction script
- Frontend property search

---

## 7. Get Current Owner

Function:

```solidity
getCurrentOwner(uint256 propertyId)
```

### Purpose

Returns the wallet address currently associated with the property.

This is useful for ownership verification and frontend display.

---

## 8. Transfer Ownership

Function:

```solidity
transferOwnership(
    uint256 propertyId,
    address newOwner
)
```

### Purpose

Transfers a property from the current owner to another wallet address.

### Workflow

```text
Current Owner
     ↓
Enter New Owner Address
     ↓
MetaMask Confirmation
     ↓
Smart Contract
     ↓
Current Owner → Previous Owner
New Address   → Current Owner
```

### Authorization

Only the current property owner can transfer ownership.

Expected unauthorized error:

```text
Only property owner allowed
```

---

## 9. Previous Owner Tracking

Before transfer:

```text
Current Owner = Owner A
Previous Owner = previous record
```

After transfer:

```text
Current Owner = Owner B
Previous Owner = Owner A
```

This provides a simple ownership transition record.

---

## 10. Document Hash

The contract stores a document hash string.

Testing example:

```text
QmDummyPropertyDocument001
```

The current project demonstrates storing the hash/reference value. Full IPFS document upload and retrieval are considered future scope.

---

## 11. Security Rules

The contract implements the following core rules:

```text
Only Admin
    ↓
Verify Property

Only Current Owner
    ↓
Transfer Ownership

Existing Property ID
    ↓
Registration Rejected
```

---

## 12. Smart Contract Test Coverage

The contract is tested for:

- Admin assignment
- Property registration
- Duplicate registration rejection
- Property verification
- Unauthorized verification
- Ownership transfer
- Previous-owner transfer rejection

Final result:

```text
7 passing
```

---

## 13. Deployment

The contract can be deployed with:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

The deployment output provides the contract address.

Example local deployment:

```text
LandRegistry deployed to:
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The address can change when the local blockchain is restarted or redeployed.
