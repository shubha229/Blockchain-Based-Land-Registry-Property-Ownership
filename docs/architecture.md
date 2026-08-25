# LandChain — System Architecture

## 1. Overview

LandChain is a blockchain-based decentralized land registry and property ownership application.

The system combines:

- Solidity smart contracts
- Hardhat 3
- Ethers.js
- React
- Vite
- MetaMask
- Chai
- A local Hardhat blockchain

The application provides property registration, verification, property lookup, ownership transfer, wallet-based role detection, and role-specific UI access.

---

## 2. High-Level Architecture

```text
┌─────────────────────────────────────────────┐
│                  USER                       │
│ Authority / Property Owner / User           │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              React + Vite UI                 │
│  Dashboard • Search • Property • Activity   │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│                  MetaMask                    │
│       Wallet connection & transactions       │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│                  Ethers.js                   │
│     Contract calls & transaction handling    │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│          LandRegistry.sol                    │
│ Registration • Verification • Transfer       │
│ Property lookup • Ownership tracking         │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│           Hardhat Local Blockchain           │
│              Chain ID: 31337                 │
└─────────────────────────────────────────────┘
```

---

## 3. Main Components

### 3.1 Smart Contract

`contracts/LandRegistry.sol`

The smart contract is the core blockchain layer. It stores property records and enforces protected operations.

Main operations:

- Register property
- Verify property
- Read property
- Read current owner
- Transfer ownership

### 3.2 Hardhat

Hardhat provides:

- Solidity compilation
- Local blockchain
- Deployment
- Automated testing
- Development tooling

### 3.3 Frontend

The frontend is located inside:

```text
frontend/
```

Main files include:

```text
frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── public/
├── package.json
└── vite.config.js
```

### 3.4 MetaMask

MetaMask provides the wallet connection used to:

- Identify the connected address
- Approve blockchain transactions
- Switch accounts
- Interact with the local Hardhat network

### 3.5 Ethers.js

Ethers.js connects the frontend/scripts to the deployed contract.

It is used for:

- Contract instances
- Signers
- Read calls
- Transaction submission
- Waiting for transaction confirmation

---

## 4. Data Flow

### Read Operation

```text
User
 ↓
React UI
 ↓
Ethers.js
 ↓
LandRegistry.getProperty()
 ↓
Blockchain
 ↓
Property data
 ↓
React UI
```

### Write Operation

```text
User
 ↓
React UI
 ↓
Ethers.js
 ↓
MetaMask confirmation
 ↓
LandRegistry function
 ↓
Hardhat Blockchain
 ↓
Transaction confirmed
 ↓
UI updated
```

---

## 5. Property Lifecycle

```text
Property does not exist
        ↓
Register Property
        ↓
Property Created
        ↓
Verify Property
        ↓
Property Verified
        ↓
Transfer Ownership
        ↓
New Owner Recorded
        ↓
Previous Owner Preserved
```

---

## 6. Project Structure

```text
Blockchain-Land-Registry-Property-Ownership/
│
├── contracts/
│   └── LandRegistry.sol
│
├── scripts/
│   ├── deploy.ts
│   └── interact.ts
│
├── test/
│   └── LandRegistry.test.ts
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── artifacts/
├── cache/
├── types/
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 7. Design Principle

The architecture separates responsibilities:

- **Blockchain layer:** trusted property state and authorization rules
- **Wallet layer:** user identity and transaction approval
- **Frontend layer:** user experience and role-specific controls
- **Testing layer:** validation of smart-contract behavior
- **Scripts layer:** deployment and command-line interaction

This separation makes the application easier to test, maintain, and extend.
