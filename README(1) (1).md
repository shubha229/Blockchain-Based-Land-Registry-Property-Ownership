# 🏠 LandChain — Decentralized Land Registry & Property Ownership

A blockchain-based land registry dApp for transparent property registration, verification, and ownership transfer using Ethereum-compatible smart contracts.

---

## 📖 Description

LandChain is a decentralized land registry application designed to make property ownership management more transparent, secure, and tamper-resistant.

The project uses blockchain smart contracts to maintain property records and manage ownership changes on-chain. It provides role-based access for **Authority**, **Property Owner**, and **User**, allowing each role to perform only the operations permitted to them.

The application demonstrates how blockchain technology can be used to create a transparent digital property registry without relying on a centralized database for ownership records.

### 🎯 Problem Solved

Traditional property records can involve centralized databases, manual verification, paperwork, and limited transparency.

LandChain addresses these challenges by providing:

- Blockchain-based property records
- Transparent ownership information
- Authority-controlled property verification
- Secure ownership transfers
- Role-based access control
- Tamper-resistant transaction history

---

## ✨ Features

### 🏠 Property Registration

- Register properties with unique property IDs
- Store property number
- Store location
- Store area
- Store property type
- Store current owner
- Store previous owner
- Store document hash

### 🛡️ Role-Based Access Control

#### Authority

- Register new properties
- Verify properties
- View property information

#### Property Owner

- View owned properties
- View ownership information
- Transfer property ownership

#### User

- Search and view property information
- View verification status
- View ownership information
- No administrative or ownership-transfer permissions

### ✅ Property Verification

- Only the Authority can verify registered properties
- Verification status is stored on-chain
- Unauthorized accounts cannot verify properties

### 🔄 Ownership Transfer

- Only the current property owner can initiate a transfer
- New owner address is recorded on-chain
- Previous owner is preserved
- Ownership status is updated after transfer

### 🔎 Property Search

- Search properties using Property ID
- View complete property information
- Display current and previous ownership

### 👤 Wallet Integration

- MetaMask wallet connection
- Automatic account detection
- Role detection based on connected wallet
- Wallet-specific permissions

### 📊 Dashboard

- Blockchain network status
- Connected wallet
- Current user role
- Property verification status
- Access permissions
- Recent user activity

### 📋 Recent Activity

- Displays activities performed by the connected wallet
- Property registration activity
- Property verification activity
- Property viewing activity
- Ownership transfer activity

### 🌙 Modern Dark UI

- Full-screen responsive interface
- Dark Web3-inspired design
- Role-specific controls
- Property information cards
- Activity panel
- Wallet information
- Responsive layout

### 🧪 Automated Testing

Smart contract tests cover:

- Admin assignment
- Property registration
- Duplicate property rejection
- Property verification
- Unauthorized verification
- Ownership transfer
- Previous-owner authorization

---

## 🛠️ Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MetaMask
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate into the project:

```bash
cd Blockchain-Land-Registry-Property-Ownership
```

### 2. Install Hardhat Dependencies

From the project root:

```bash
npm install
```

### 3. Install Frontend Dependencies

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Return to the project root:

```bash
cd ..
```

### 4. Compile the Smart Contract

```bash
npx hardhat compile
```

### 5. Run Smart Contract Tests

```bash
npx hardhat test
```

Expected result:

```text
7 passing
```

---

## 🚀 Usage

### Step 1 — Start the Local Blockchain

From the project root:

```bash
npx hardhat node
```

Keep this terminal running.

### Step 2 — Deploy the Smart Contract

Open another terminal from the project root:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Example output:

```text
Deploying LandRegistry...
Admin address: 0xf39...
LandRegistry deployed to: 0x5Fb...
```

### Step 3 — Run the Interaction Script

```bash
npx hardhat run scripts/interact.ts --network localhost
```

The script demonstrates:

```text
Register Property
       ↓
Verify Property
       ↓
Transfer Ownership
       ↓
Read Updated Property
```

### Step 4 — Start the Frontend

```bash
cd frontend
npm run dev
```

Vite will display a local URL, usually:

```text
http://localhost:5173
```

### Step 5 — Connect MetaMask

Configure MetaMask to use the local Hardhat network.

Use the test accounts displayed by:

```bash
npx hardhat node
```

Import the required test account into MetaMask.

> **Important:** Never use Hardhat test private keys on a real network.

---

## 🔄 Application Workflow

```text
                    LANDCHAIN
                        │
                        ▼
                 Connect MetaMask
                        │
                        ▼
                  Detect User Role
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
      Authority        Owner         User
          │             │             │
          ▼             ▼             ▼
      Register        View         Search
      Property       Property      Property
          │             │             │
          ▼             │             │
      Verify            │             │
      Property          │             │
          │             │             │
          └─────────────┼─────────────┘
                        │
                        ▼
                Property Record
                        │
                        ▼
               Ownership Transfer
                        │
                        ▼
             Updated Blockchain Record
```

---

## 🏠 Property Registration Flow

```text
Authority
    ↓
Enter Property Details
    ↓
Property ID
    ↓
Property Number
    ↓
Location
    ↓
Area
    ↓
Property Type
    ↓
Initial Owner
    ↓
Document Hash
    ↓
Register Property
    ↓
MetaMask Confirmation
    ↓
Smart Contract
    ↓
Property Stored On-Chain
```

---

## ✅ Property Verification Flow

```text
Authority
    ↓
Search Property
    ↓
View Property Details
    ↓
Verify Property
    ↓
MetaMask Confirmation
    ↓
Smart Contract
    ↓
Property Verified
```

---

## 🔄 Ownership Transfer Flow

```text
Property Owner
      ↓
Search Property
      ↓
Verify Current Ownership
      ↓
Enter New Owner Address
      ↓
Transfer Ownership
      ↓
MetaMask Confirmation
      ↓
Smart Contract
      ↓
Current Owner Updated
      ↓
Previous Owner Recorded
```

---

## 🔐 Role Permissions

| Feature | Authority | Property Owner | User |
|---|:---:|:---:|:---:|
| View Properties | ✅ | ✅ | ✅ |
| Read Ownership | ✅ | ✅ | ✅ |
| Register Property | ✅ | ❌ | ❌ |
| Verify Property | ✅ | ❌ | ❌ |
| Transfer Ownership | ❌ | ✅ | ❌ |

---

## ⚙️ Configuration

### Smart Contract Address

After deploying the contract, update the deployed address in:

```text
frontend/src/App.jsx
```

Example:

```javascript
const CONTRACT_ADDRESS =
  "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

Replace the placeholder with the address generated by:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Network Configuration

The project is designed for the local Hardhat blockchain.

```text
Network: Hardhat Local
Chain ID: 31337
```

Make sure MetaMask is connected to the same network.

### Document Hash

Each property contains a document hash.

For testing, you can use:

```text
QmDummyPropertyDocument001
```

For a production implementation, the hash can represent a document stored using decentralized storage such as IPFS.

---

## 🖥️ Screenshots / Demo

Add screenshots of your project inside a `screenshots` folder.

Recommended structure:

```text
screenshots/
├── dashboard.png
├── authority.png
├── property-details.png
└── ownership-transfer.png
```

### Dashboard

![LandChain Dashboard](screenshots/dashboard.png)

### Authority Dashboard

![Authority Dashboard](screenshots/authority.png)

### Property Details

![Property Details](screenshots/property-details.png)

### Ownership Transfer

![Ownership Transfer](screenshots/ownership-transfer.png)

### Demo Video

[▶ Watch LandChain Demo](YOUR_VIDEO_LINK)

---

## 🧪 Testing

The smart contract includes automated tests using **Hardhat**, **Ethers.js**, and **Chai**.

Run:

```bash
npx hardhat test
```

### Test Cases

```text
✓ Deployer becomes admin
✓ Property registration
✓ Duplicate property rejection
✓ Property verification
✓ Unauthorized verification rejection
✓ Ownership transfer
✓ Previous owner cannot transfer after ownership changes
```

Expected result:

```text
7 passing
```

---

## 🏗️ Production Build

To verify that the React frontend can be built successfully:

```bash
cd frontend
npm run build
```

The production files will be generated inside:

```text
frontend/dist/
```

---

## 🧰 Technologies Used

### Blockchain

- Solidity
- Ethereum-compatible blockchain
- Hardhat 3
- Ethers.js

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Wallet

- MetaMask

### Testing

- Hardhat
- Chai
- Ethers.js

### Development Tools

- Visual Studio Code
- Remix IDE
- Git
- GitHub

---

## 📁 Project Structure

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
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── hardhat.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔗 Smart Contract Functions

The `LandRegistry` smart contract provides the core property-management functionality.

### Register Property

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

### Verify Property

```solidity
verifyProperty(
    uint256 propertyId
)
```

### Get Property

```solidity
getProperty(
    uint256 propertyId
)
```

### Get Current Owner

```solidity
getCurrentOwner(
    uint256 propertyId
)
```

### Transfer Ownership

```solidity
transferOwnership(
    uint256 propertyId,
    address newOwner
)
```

---

## 🔒 Security Considerations

The project implements basic smart-contract access restrictions:

- Only the designated Authority can verify properties.
- Only the current property owner can transfer ownership.
- Duplicate property registration is rejected.
- Ownership changes are recorded on-chain.
- Wallet addresses are used for role and ownership identification.
- Unauthorized verification attempts are rejected.
- Unauthorized ownership transfers are rejected.

> **Note:** This project is intended for educational and demonstration purposes and has not undergone a professional smart-contract security audit.

---

## 🤝 Contributing

Contributions are welcome.

### 1. Fork the Repository

Create your own fork of the project.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

### 4. Make Your Changes

Implement and test your changes.

### 5. Commit Your Changes

```bash
git add .
git commit -m "Add your feature"
```

### 6. Push Your Branch

```bash
git push origin feature/your-feature
```

### 7. Create a Pull Request

Open a Pull Request and describe the changes you made.

---

## 📜 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project in accordance with the terms of the MIT License.

If you want to apply the MIT License, create a file named:

```text
LICENSE
```

in the root directory of the project.

---

## 📬 Contact

**Developer:** [Your Name]

**GitHub:** [Your GitHub Profile](https://github.com/YOUR_USERNAME)

**Email:** [YOUR_EMAIL@example.com](mailto:YOUR_EMAIL@example.com)

**LinkedIn:** [Your LinkedIn Profile](YOUR_LINKEDIN_PROFILE)

For questions, suggestions, collaboration, or feedback, feel free to reach out.

---

## ⭐ Acknowledgements

This project was developed as a blockchain/Web3 application to demonstrate decentralized property registration and ownership management using Ethereum-compatible smart contracts.

The project combines smart contracts, blockchain development, wallet integration, automated testing, and a modern React-based user interface.

---

## 🚀 Future Scope

Possible future improvements include:

- Integration with IPFS for decentralized document storage
- Real blockchain event indexing
- Production Ethereum or Layer-2 deployment
- Advanced identity verification
- Property map integration
- Government-authority integration
- Multi-signature property verification
- Professional smart-contract security auditing

> These features are outside the current **Option B** implementation and are listed only as possible future enhancements.
