# LandChain — Deployment & Setup Guide

## 1. Prerequisites

Install:

- Node.js
- npm
- Git
- Visual Studio Code
- MetaMask browser extension

Optional:

- Remix IDE for Solidity experimentation

---

## 2. Clone the Repository

Replace the URL with the actual GitHub repository URL:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd Blockchain-Land-Registry-Property-Ownership
```

---

## 3. Install Root Dependencies

From the project root:

```bash
npm install
```

---

## 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

---

## 5. Compile the Contract

```bash
npx hardhat compile
```

A successful compilation should report that the Solidity contract was compiled.

---

## 6. Run Tests

```bash
npx hardhat test
```

Expected final result:

```text
7 passing
```

---

## 7. Start the Local Blockchain

Open a terminal in the project root:

```bash
npx hardhat node
```

Keep this terminal running.

The node provides local test accounts and their private keys.

### Important

The displayed private keys are development/test keys only. Never use them with real funds or production networks.

---

## 8. Deploy the Contract

Open a second terminal.

Run:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Example output:

```text
Deploying LandRegistry...
Admin address: 0xf39...
LandRegistry deployed to: 0x5Fb...
```

Copy the deployed contract address.

---

## 9. Run Interaction Script

The project includes:

```text
scripts/interact.ts
```

Run:

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

---

## 10. Configure Frontend Contract Address

Open:

```text
frontend/src/App.jsx
```

Find the contract address configuration.

Example:

```javascript
const CONTRACT_ADDRESS =
  "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

Replace it with the address produced by deployment.

---

## 11. Start Frontend

```bash
cd frontend
npm run dev
```

Vite normally displays a local URL similar to:

```text
http://localhost:5173
```

Open that address in the browser.

---

## 12. Configure MetaMask

Add/use the local Hardhat network.

Typical local configuration:

```text
Network: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

Import one of the test accounts printed by:

```bash
npx hardhat node
```

Use the Authority/admin account for Authority operations.

Use another Hardhat account for Owner/User testing.

---

## 13. Test Authority Workflow

Connect the Authority account.

Test:

```text
Register Property
      ↓
Verify Property
      ↓
Search Property
      ↓
View Property Details
```

---

## 14. Test Owner Workflow

Switch MetaMask to the current property owner's account.

Test:

```text
Search Property
      ↓
View Property
      ↓
Transfer Ownership
      ↓
Enter New Wallet Address
      ↓
Confirm MetaMask Transaction
```

---

## 15. Test User Workflow

Connect a normal account.

Confirm that:

```text
View Properties       ✓
Read Ownership        ✓
Register Property     ✕
Verify Property       ✕
Transfer Ownership    ✕
```

---

## 16. Production Build

From the frontend directory:

```bash
npm run build
```

This creates the production build in:

```text
frontend/dist/
```

---

## 17. Common Issues

### Contract Address Error

Make sure the frontend uses the latest deployed contract address.

### Wrong Network

Make sure MetaMask is connected to:

```text
Chain ID: 31337
```

### Transaction Failure

Check:

- Correct MetaMask account
- Correct network
- Correct property ID
- Caller has the required role
- Local Hardhat node is still running

### Empty/Invalid Contract Response

Make sure the frontend is connected to the same deployed contract and network.

### Local Blockchain Restart

Restarting the Hardhat node resets the local blockchain state. Redeploy the contract and update the frontend address if necessary.

---

## 18. Recommended Terminal Layout

### Terminal 1

```bash
npx hardhat node
```

### Terminal 2

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Terminal 3

```bash
cd frontend
npm run dev
```

### Optional Terminal 4

```bash
npx hardhat test
```
