# LandChain — User Guide

## 1. Introduction

This guide explains how to use the LandChain Web3 interface after the local blockchain, contract, frontend, and MetaMask have been configured.

---

## 2. Connect Wallet

Open the application and select:

```text
Connect Wallet
```

Approve the connection in MetaMask.

The dashboard should show the connected wallet address and network status.

---

## 3. Authority Workflow

Connect the configured Authority/admin wallet.

### Register a Property

Enter:

- Property ID
- Property Number
- Location
- Area
- Property Type
- Owner Wallet Address
- Document Hash

Submit the transaction through MetaMask.

### Verify Property

Search for the registered property.

Select the verification action.

Approve the MetaMask transaction.

The property should become verified.

---

## 4. Property Owner Workflow

Connect the wallet that is currently recorded as the property owner.

Search for the property.

Review:

- Property number
- Location
- Area
- Property type
- Current owner
- Previous owner
- Verification state

### Transfer Ownership

Enter the new owner's wallet address.

Select:

```text
Transfer Ownership
```

Approve the transaction in MetaMask.

After confirmation, the new wallet becomes the current owner and the previous owner is preserved.

---

## 5. User Workflow

Connect a normal wallet.

A User can:

- Search properties
- View property details
- Read ownership information

A User cannot:

- Register properties
- Verify properties
- Transfer ownership

---

## 6. Property Search

Enter the unique property ID.

Example:

```text
1
```

The application queries the smart contract and displays the corresponding property record.

---

## 7. Understanding Activity

The activity area is intended to show actions relevant to the connected application/session.

Examples:

```text
Property registered
Property verified
Property viewed
Ownership transferred
```

Activity shown in the UI should correspond to the current connected wallet/session rather than being presented as another user's activity.

---

## 8. Wallet Switching

To test different roles:

1. Open MetaMask.
2. Switch to another local Hardhat account.
3. Refresh or reconnect the application if necessary.
4. Confirm the displayed role and permissions.
5. Perform the appropriate workflow.

---

## 9. Important Notes

The application uses a local blockchain for demonstration.

Restarting the Hardhat node resets the local blockchain.

When the blockchain is reset:

1. Start Hardhat again.
2. Deploy the contract again.
3. Copy the new contract address.
4. Update the frontend configuration if required.
5. Restart the frontend.

---

## 10. Expected Role Experience

### Authority

```text
Register ✓
Verify ✓
View ✓
Transfer ✕
```

### Property Owner

```text
Register ✕
Verify ✕
View ✓
Transfer ✓
```

### User

```text
Register ✕
Verify ✕
View ✓
Transfer ✕
```
