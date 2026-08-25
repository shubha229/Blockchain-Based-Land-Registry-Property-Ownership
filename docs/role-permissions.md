# LandChain — Role-Based Access Control

## 1. Overview

LandChain uses three logical application roles:

- Authority
- Property Owner
- User

The connected MetaMask wallet determines the account being used. The frontend presents role-specific controls, while protected smart-contract functions enforce critical authorization.

---

## 2. Permission Matrix

| Feature | Authority | Property Owner | User |
|---|:---:|:---:|:---:|
| Connect Wallet | ✅ | ✅ | ✅ |
| View Properties | ✅ | ✅ | ✅ |
| Search Property | ✅ | ✅ | ✅ |
| Read Ownership | ✅ | ✅ | ✅ |
| Register Property | ✅ | ❌ | ❌ |
| Verify Property | ✅ | ❌ | ❌ |
| Transfer Ownership | ❌ | ✅ | ❌ |

---

## 3. Authority

### Responsibilities

Authority is responsible for:

- Registering properties
- Verifying properties
- Viewing property information

### UI

The Authority dashboard should expose:

```text
Register Property
Verify Property
Search Property
Property Details
Activity
```

### Protected Operations

```text
registerProperty()
verifyProperty()
```

---

## 4. Property Owner

### Responsibilities

A property owner can:

- View properties
- Read ownership
- Transfer ownership of a property they currently own

### UI

The Owner dashboard should expose:

```text
Properties
Property Details
Transfer Ownership
Activity
```

### Protected Operation

```text
transferOwnership()
```

The contract checks that the connected account is the current owner.

---

## 5. User

### Responsibilities

A normal user can:

- Connect wallet
- Search properties
- View property details
- Read ownership information

A normal user cannot:

- Register properties
- Verify properties
- Transfer ownership

---

## 6. Frontend Access Control

The frontend should not simply hide unauthorized features; it should also communicate why an action is unavailable.

Example:

```text
✓ View properties
✓ Read ownership
× Register properties
× Verify properties
× Transfer ownership
```

This makes the permissions understandable to the user.

---

## 7. Smart Contract vs UI Security

Frontend role restrictions are primarily a user-experience layer.

The actual security boundary for protected blockchain operations is the smart contract.

Therefore:

```text
Frontend
   ↓
Shows/blocks UI actions
   ↓
Smart Contract
   ↓
Authorizes/rejects transaction
```

A user should never be considered authorized merely because a button is visible.

---

## 8. Role Detection

The application can compare the connected wallet address against the configured Authority/admin address and determine ownership-related permissions from the property record.

Wallet address example:

```text
0x7099...79c8
```

The complete address should be used internally; shortened addresses are only for display.

---

## 9. Recommended UI States

### Not Connected

```text
Role: Not connected
Access: Connect MetaMask
```

### Authority

```text
Role: Authority
Access:
✓ View
✓ Register
✓ Verify
✕ Transfer
```

### Property Owner

```text
Role: Property Owner
Access:
✓ View
✓ Read ownership
✓ Transfer owned property
✕ Register
✕ Verify
```

### User

```text
Role: User
Access:
✓ View
✓ Read ownership
✕ Register
✕ Verify
✕ Transfer
```

---

## 10. Security Note

Role-based UI improves usability but does not replace smart-contract authorization.

The project is an educational prototype and has not undergone a professional security audit.
