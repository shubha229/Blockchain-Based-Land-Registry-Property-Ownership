import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  "function admin() view returns (address)",

  "function registerProperty(uint256,string,string,uint256,string,address,string)",

  "function verifyProperty(uint256)",

  "function getProperty(uint256) view returns (tuple(uint256 propertyId,string propertyNumber,string location,uint256 area,string propertyType,address currentOwner,address previousOwner,string documentHash,bool verified,uint8 status,uint256 registeredAt,uint256 lastTransferredAt))",

  "function getCurrentOwner(uint256) view returns (address)",

  "function transferOwnership(uint256,address)"
];

function App() {
  /* =====================================================
     WALLET / ROLE
  ===================================================== */

  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");
  const [network, setNetwork] = useState("");

  /* =====================================================
     PROPERTY
  ===================================================== */

  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState(null);

  /* =====================================================
     TRANSFER
  ===================================================== */

  const [newOwner, setNewOwner] = useState("");

  /* =====================================================
     UI
  ===================================================== */

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================================================
     AUTHORITY REGISTRATION FORM
  ===================================================== */

  const [form, setForm] = useState({
    propertyId: "",
    propertyNumber: "",
    location: "",
    area: "",
    propertyType: "",
    owner: "",
    documentHash: ""
  });

  /* =====================================================
     ACTIVITY
  ===================================================== */

  const [activities, setActivities] = useState([]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const shortAddress = (address) => {
    if (!address) return "—";

    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getError = (error) => {
    return (
      error?.reason ||
      error?.shortMessage ||
      error?.message ||
      "Transaction failed."
    );
  };

  /*
   * IMPORTANT:
   * Every activity now stores the wallet that
   * performed the action.
   *
   * This prevents Admin activity appearing
   * in the User dashboard.
   */

  const addActivity = (title, description) => {
    if (!account) return;

    setActivities((previous) => [
      {
        title,
        description,

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),

        actor: account.toLowerCase(),

        activityRole: role
      },

      ...previous
    ]);
  };

  const copyAddress = async (address) => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);

      setMessage("Address copied to clipboard.");
    } catch {
      setMessage("Unable to copy address.");
    }
  };

  /* =====================================================
     WALLET
  ===================================================== */

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage("Please install MetaMask.");
        return;
      }

      const accounts =
        await window.ethereum.request({
          method: "eth_requestAccounts"
        });

      if (!accounts.length) return;

      await setupWallet(accounts[0]);
    } catch (error) {
      setMessage(getError(error));
    }
  };

  const setupWallet = async (walletAddress) => {
    try {
      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const contract =
        new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          provider
        );

      const adminAddress =
        await contract.admin();

      const networkInfo =
        await provider.getNetwork();

      const detectedNetwork =
        networkInfo.chainId === 31337n
          ? "Hardhat Local"
          : `Chain ${networkInfo.chainId}`;

      setNetwork(detectedNetwork);

      /*
       * Reset account-specific UI when
       * MetaMask changes account.
       */

      setProperty(null);
      setPropertyId("");
      setNewOwner("");
      setActivities([]);

      if (
        walletAddress.toLowerCase() ===
        adminAddress.toLowerCase()
      ) {
        setRole("Authority");
      } else {
        setRole("User");
      }

      setAccount(walletAddress);
    } catch (error) {
      setMessage(getError(error));
    }
  };

  /* =====================================================
     CONTRACT
  ===================================================== */

  const getContract = async () => {
    const provider =
      new ethers.BrowserProvider(
        window.ethereum
      );

    const signer =
      await provider.getSigner();

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
  };

  /* =====================================================
     VIEW PROPERTY
  ===================================================== */

  const viewProperty = async () => {
    if (!propertyId) {
      setMessage("Enter a property ID.");
      return;
    }

    if (!account) {
      setMessage("Connect your wallet first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const contract =
        await getContract();

      const result =
        await contract.getProperty(
          propertyId
        );

      const owner =
        result.currentOwner;

      const isOwner =
        account &&
        owner.toLowerCase() ===
          account.toLowerCase();

      /*
       * Authority remains Authority.
       *
       * Non-authority accounts become:
       * Property Owner OR User
       */

      if (role !== "Authority") {
        setRole(
          isOwner
            ? "Property Owner"
            : "User"
        );
      }

      const propertyData = {
        id: result.propertyId.toString(),

        number:
          result.propertyNumber,

        location:
          result.location,

        area:
          result.area.toString(),

        type:
          result.propertyType,

        currentOwner:
          result.currentOwner,

        previousOwner:
          result.previousOwner,

        documentHash:
          result.documentHash,

        verified:
          result.verified,

        status:
          result.status.toString()
      };

      setProperty(propertyData);

      /*
       * This activity belongs ONLY to
       * the connected wallet.
       */

      addActivity(
        "Property viewed",
        `Property ${result.propertyNumber}`
      );

      setMessage(
        "Property loaded successfully."
      );
    } catch (error) {
      setProperty(null);

      setMessage(
        getError(error)
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     REGISTER PROPERTY
  ===================================================== */

  const registerProperty = async (event) => {
    event.preventDefault();

    if (role !== "Authority") {
      setMessage(
        "Only the Authority can register properties."
      );

      return;
    }

    try {
      setLoading(true);

      const contract =
        await getContract();

      const tx =
        await contract.registerProperty(
          form.propertyId,
          form.propertyNumber,
          form.location,
          form.area,
          form.propertyType,
          form.owner,
          form.documentHash
        );

      setMessage(
        "Registration transaction submitted..."
      );

      await tx.wait();

      addActivity(
        "Property registered",
        `${form.propertyNumber} • ${form.location}`
      );

      setMessage(
        "Property registered successfully."
      );

      setForm({
        propertyId: "",
        propertyNumber: "",
        location: "",
        area: "",
        propertyType: "",
        owner: "",
        documentHash: ""
      });
    } catch (error) {
      setMessage(
        getError(error)
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     VERIFY PROPERTY
  ===================================================== */

  const verifyProperty = async () => {
    if (role !== "Authority") {
      setMessage(
        "Only the Authority can verify properties."
      );

      return;
    }

    if (!property) {
      setMessage(
        "Select a property first."
      );

      return;
    }

    try {
      setLoading(true);

      const contract =
        await getContract();

      const tx =
        await contract.verifyProperty(
          property.id
        );

      setMessage(
        "Verification transaction submitted..."
      );

      await tx.wait();

      addActivity(
        "Property verified",
        `Property ${property.number}`
      );

      setProperty({
        ...property,

        verified: true,

        status: "1"
      });

      setMessage(
        "Property verified successfully."
      );
    } catch (error) {
      setMessage(
        getError(error)
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     TRANSFER OWNERSHIP
  ===================================================== */

  const transferOwnership = async () => {
    if (!property) {
      setMessage(
        "Select a property first."
      );

      return;
    }

    if (!isCurrentOwner) {
      setMessage(
        "Only the current owner can transfer this property."
      );

      return;
    }

    if (!ethers.isAddress(newOwner)) {
      setMessage(
        "Enter a valid Ethereum address."
      );

      return;
    }

    if (
      newOwner.toLowerCase() ===
      account.toLowerCase()
    ) {
      setMessage(
        "New owner must be different from the current owner."
      );

      return;
    }

    try {
      setLoading(true);

      const contract =
        await getContract();

      const tx =
        await contract.transferOwnership(
          property.id,
          newOwner
        );

      setMessage(
        "Ownership transfer submitted..."
      );

      await tx.wait();

      addActivity(
        "Ownership transferred",
        `${property.number} → ${shortAddress(
          newOwner
        )}`
      );

      setProperty({
        ...property,

        previousOwner:
          property.currentOwner,

        currentOwner:
          newOwner,

        status: "2"
      });

      setNewOwner("");

      setMessage(
        "Ownership transferred successfully."
      );
    } catch (error) {
      setMessage(
        getError(error)
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     ACCOUNT CHANGE
  ===================================================== */

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged =
      (accounts) => {
        if (!accounts.length) {
          setAccount("");
          setRole("");
          setNetwork("");
          setProperty(null);
          setPropertyId("");
          setNewOwner("");
          setActivities([]);

          return;
        }

        setupWallet(accounts[0]);
      };

    window.ethereum.on(
      "accountsChanged",
      handleAccountsChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  /* =====================================================
     AUTO DETECT CONNECTED ACCOUNT
  ===================================================== */

  useEffect(() => {
    const detectWallet = async () => {
      if (!window.ethereum) return;

      try {
        const accounts =
          await window.ethereum.request({
            method: "eth_accounts"
          });

        if (accounts.length) {
          await setupWallet(accounts[0]);
        }
      } catch {
        // Ignore automatic detection errors.
      }
    };

    detectWallet();
  }, []);

  /* =====================================================
     STATUS
  ===================================================== */

  const statusText = (status) => {
    if (status === "0")
      return "Registered";

    if (status === "1")
      return "Verified";

    if (status === "2")
      return "Transferred";

    return "Unknown";
  };

  /* =====================================================
     CURRENT OWNER
  ===================================================== */

  const isCurrentOwner =
    property &&
    account &&
    property.currentOwner.toLowerCase() ===
      account.toLowerCase();

  /* =====================================================
     FILTER ACTIVITY FOR CURRENT WALLET
  ===================================================== */

  const currentUserActivities =
    activities.filter(
      (activity) =>
        activity.actor?.toLowerCase() ===
        account?.toLowerCase()
    );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-mark">
            ◈
          </div>

          <div>
            <strong>
              LANDCHAIN
            </strong>

            <span>
              PROPERTY NETWORK
            </span>
          </div>

        </div>

        <nav>

          <button className="nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .getElementById(
                  "registry"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            <span>▣</span>
            Properties
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document
                .getElementById(
                  "activity"
                )
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            <span>↗</span>
            Activity
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="role-mini">

            <div className="avatar">

              {role === "Authority"
                ? "A"
                : role ===
                  "Property Owner"
                ? "O"
                : "U"}

            </div>

            <div>

              <span>
                CURRENT ROLE
              </span>

              <strong>
                {role ||
                  "Not connected"}
              </strong>

            </div>

          </div>

          {account && (
            <button
              className="wallet-mini"
              onClick={() =>
                copyAddress(account)
              }
            >
              <span>
                {shortAddress(account)}
              </span>

              <span>
                ⧉
              </span>
            </button>
          )}

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="topbar">

          <div>

            <span className="network-dot"></span>

            {network ||
              "Wallet not connected"}

          </div>

          <button
            className="wallet-button"
            onClick={connectWallet}
          >

            <span>
              ◉
            </span>

            {account
              ? shortAddress(account)
              : "Connect Wallet"}

          </button>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="content">

          {/* =================================================
              HERO
          ================================================= */}

          <section className="welcome">

            <div>

              <span className="overline">
                DECENTRALIZED LAND REGISTRY
              </span>

              <h1>
                Your land.
                <br />

                <span>
                  Your ownership.
                </span>
              </h1>

              <p>
                A transparent blockchain
                registry for registering,
                verifying and transferring
                property ownership.
              </p>

            </div>

            <div className="hero-visual">

              <div className="orbit orbit-one"></div>

              <div className="orbit orbit-two"></div>

              <div className="house">
                🏠
              </div>

              <div className="floating-card">

                <span>
                  BLOCKCHAIN
                </span>

                <strong>
                  VERIFIED
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="stats">

            <div className="stat-card">

              <div className="stat-icon purple">
                ◈
              </div>

              <div>
                <span>
                  REGISTRY
                </span>

                <strong>
                  Active
                </strong>
              </div>

              <small>
                On-chain
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                ✓
              </div>

              <div>

                <span>
                  VERIFICATION
                </span>

                <strong>
                  {property?.verified
                    ? "Verified"
                    : "Ready"}
                </strong>

              </div>

              <small>
                Blockchain
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon blue">
                ⛓
              </div>

              <div>

                <span>
                  NETWORK
                </span>

                <strong>
                  Local
                </strong>

              </div>

              <small>
                Hardhat
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                ●
              </div>

              <div>

                <span>
                  ROLE
                </span>

                <strong>
                  {role || "Guest"}
                </strong>

              </div>

              <small>
                Access level
              </small>

            </div>

          </section>

          {/* =================================================
              REGISTRY
          ================================================= */}

          <section
            className="registry-layout"
            id="registry"
          >

            <div className="registry-main">

              <div className="section-heading">

                <div>

                  <span className="overline">
                    PROPERTY REGISTRY
                  </span>

                  <h2>
                    Find a property
                  </h2>

                </div>

                <span className="live-badge">

                  <i></i>

                  LIVE

                </span>

              </div>

              {/* SEARCH */}

              <div className="search-card">

                <div className="search-icon">
                  ⌕
                </div>

                <input
                  type="number"
                  placeholder="Search by property ID..."
                  value={propertyId}
                  onChange={(e) =>
                    setPropertyId(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      viewProperty();
                    }
                  }}
                />

                <button
                  onClick={
                    viewProperty
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Searching..."
                    : "Search Property"}
                </button>

              </div>

              {/* =================================================
                  PROPERTY
              ================================================= */}

              {property ? (

                <div className="property">

                  <div className="property-header">

                    <div>

                      <span className="property-id">
                        PROPERTY #{property.id}
                      </span>

                      <h3>
                        {property.number}
                      </h3>

                      <p>
                        ◉ {property.location}
                      </p>

                    </div>

                    <div
                      className={
                        property.verified
                          ? "verified"
                          : "pending"
                      }
                    >
                      {property.verified
                        ? "✓ VERIFIED"
                        : "○ PENDING"}
                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="property-details">

                    <div>

                      <span>
                        PROPERTY TYPE
                      </span>

                      <strong>
                        {property.type}
                      </strong>

                    </div>

                    <div>

                      <span>
                        AREA
                      </span>

                      <strong>
                        {property.area}

                        <small>
                          {" "}sq.ft
                        </small>
                      </strong>

                    </div>

                    <div>

                      <span>
                        STATUS
                      </span>

                      <strong>
                        {statusText(
                          property.status
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* OWNERSHIP */}

                  <div className="owner-section">

                    <div>

                      <span>
                        CURRENT OWNER
                      </span>

                      <button
                        onClick={() =>
                          copyAddress(
                            property.currentOwner
                          )
                        }
                      >
                        {shortAddress(
                          property.currentOwner
                        )}

                        <small>
                          ⧉
                        </small>

                      </button>

                    </div>

                    <div className="ownership-arrow">
                      →
                    </div>

                    <div>

                      <span>
                        PREVIOUS OWNER
                      </span>

                      <button>

                        {property.previousOwner ===
                        "0x0000000000000000000000000000000000000000"
                          ? "None"
                          : shortAddress(
                              property.previousOwner
                            )}

                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      AUTHORITY ACTION
                  ================================================= */}

                  {role === "Authority" &&
                    !property.verified && (

                      <div className="action-card authority-action">

                        <div>

                          <strong>
                            Verification required
                          </strong>

                          <p>
                            Review this property
                            before confirming
                            its authenticity.
                          </p>

                        </div>

                        <button
                          onClick={
                            verifyProperty
                          }
                          disabled={loading}
                        >
                          {loading
                            ? "Verifying..."
                            : "✓ Verify Property"}
                        </button>

                      </div>

                  )}

                  {/* =================================================
                      OWNER ACTION
                  ================================================= */}

                  {isCurrentOwner && (

                    <div className="action-card owner-action">

                      <div>

                        <strong>
                          Transfer ownership
                        </strong>

                        <p>
                          Transfer this property
                          to another wallet.
                        </p>

                      </div>

                      <div className="transfer">

                        <input
                          placeholder="New wallet address"
                          value={newOwner}
                          onChange={(e) =>
                            setNewOwner(
                              e.target.value
                            )
                          }
                        />

                        <button
                          onClick={
                            transferOwnership
                          }
                          disabled={loading}
                        >
                          {loading
                            ? "..."
                            : "Transfer"}
                        </button>

                      </div>

                    </div>

                  )}

                </div>

              ) : (

                <div className="empty-state">

                  <div>
                    ⌂
                  </div>

                  <h3>
                    No property selected
                  </h3>

                  <p>
                    Enter a property ID above
                    to inspect its blockchain
                    ownership record.
                  </p>

                </div>

              )}

            </div>

            {/* =================================================
                RIGHT PANEL
            ================================================= */}

            <aside className="right-panel">

              {/* =================================================
                  ACCESS CONTROL
              ================================================= */}

              <div className="side-card">

                <div className="side-heading">

                  <span>
                    ACCESS CONTROL
                  </span>

                  <span>
                    🔐
                  </span>

                </div>

                <div className="access-role">

                  <div className="access-avatar">
                    🛡
                  </div>

                  <div>

                    <span>
                      YOUR ROLE
                    </span>

                    <strong>
                      {role ||
                        "Connect wallet"}
                    </strong>

                  </div>

                </div>

                <div className="permissions">

                  {/* VIEW */}

                  <div>

                    <span className="check">
                      ✓
                    </span>

                    View properties

                  </div>

                  {/* READ */}

                  <div>

                    <span className="check">
                      ✓
                    </span>

                    Read ownership

                  </div>

                  {/* REGISTER */}

                  <div>

                    <span
                      className={
                        role ===
                        "Authority"
                          ? "check"
                          : "lock"
                      }
                    >
                      {role ===
                      "Authority"
                        ? "✓"
                        : "×"}
                    </span>

                    Register properties

                  </div>

                  {/* VERIFY */}

                  <div>

                    <span
                      className={
                        role ===
                        "Authority"
                          ? "check"
                          : "lock"
                      }
                    >
                      {role ===
                      "Authority"
                        ? "✓"
                        : "×"}
                    </span>

                    Verify properties

                  </div>

                  {/* TRANSFER */}

                  <div>

                    <span
                      className={
                        isCurrentOwner
                          ? "check"
                          : "lock"
                      }
                    >
                      {isCurrentOwner
                        ? "✓"
                        : "×"}
                    </span>

                    Transfer ownership

                  </div>

                </div>

              </div>

              {/* =================================================
                  ACTIVITY
              ================================================= */}

              <div
                className="side-card"
                id="activity"
              >

                <div className="side-heading">

                  <span>
                    RECENT ACTIVITY
                  </span>

                  <span>
                    ↗
                  </span>

                </div>

                {currentUserActivities.length ===
                0 ? (

                  <div className="no-activity">
                    No activity yet.
                  </div>

                ) : (

                  currentUserActivities
                    .slice(0, 5)
                    .map(
                      (
                        activity,
                        index
                      ) => (

                        <div
                          className="activity"
                          key={`${activity.time}-${index}`}
                        >

                          <div className="activity-dot">
                            ✓
                          </div>

                          <div>

                            <strong>
                              {
                                activity.title
                              }
                            </strong>

                            <p>
                              {
                                activity.description
                              }
                            </p>

                            <small>
                              {
                                activity.time
                              }
                            </small>

                          </div>

                        </div>

                      )
                    )

                )}

              </div>

            </aside>

          </section>

          {/* =================================================
              AUTHORITY REGISTRATION
          ================================================= */}

          {role === "Authority" && (

            <section className="register-section">

              <div className="section-heading">

                <div>

                  <span className="overline">
                    AUTHORITY CONSOLE
                  </span>

                  <h2>
                    Register property
                  </h2>

                </div>

                <span className="authority-badge">
                  🛡 AUTHORIZED
                </span>

              </div>

              <form
                className="register-card"
                onSubmit={
                  registerProperty
                }
              >

                <div className="form-grid">

                  {/* PROPERTY ID */}

                  <label>

                    Property ID

                    <input
                      type="number"
                      value={
                        form.propertyId
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          propertyId:
                            e.target.value
                        })
                      }
                      placeholder="1"
                      required
                    />

                  </label>

                  {/* PROPERTY NUMBER */}

                  <label>

                    Property Number

                    <input
                      value={
                        form.propertyNumber
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          propertyNumber:
                            e.target.value
                        })
                      }
                      placeholder="P001"
                      required
                    />

                  </label>

                  {/* LOCATION */}

                  <label>

                    Location

                    <input
                      value={
                        form.location
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          location:
                            e.target.value
                        })
                      }
                      placeholder="Bangalore"
                      required
                    />

                  </label>

                  {/* AREA */}

                  <label>

                    Area

                    <input
                      type="number"
                      value={form.area}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          area:
                            e.target.value
                        })
                      }
                      placeholder="1200"
                      required
                    />

                  </label>

                  {/* TYPE */}

                  <label>

                    Property Type

                    <select
                      value={
                        form.propertyType
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          propertyType:
                            e.target.value
                        })
                      }
                      required
                    >

                      <option value="">
                        Select type
                      </option>

                      <option>
                        Residential
                      </option>

                      <option>
                        Commercial
                      </option>

                      <option>
                        Agricultural
                      </option>

                    </select>

                  </label>

                  {/* OWNER */}

                  <label>

                    Initial Owner

                    <input
                      value={form.owner}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          owner:
                            e.target.value
                        })
                      }
                      placeholder="0x..."
                      required
                    />

                  </label>

                  {/* DOCUMENT HASH */}

                  <label className="full">

                    Document Hash

                    <input
                      value={
                        form.documentHash
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          documentHash:
                            e.target.value
                        })
                      }
                      placeholder="Qm..."
                      required
                    />

                  </label>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                >

                  {loading
                    ? "Registering..."
                    : "Register Property →"}

                </button>

              </form>

            </section>

          )}

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer>

          <span>
            LANDCHAIN © 2026
          </span>

          <span>
            Secured by Smart Contracts
          </span>

          <span>
            Hardhat Local Network
          </span>

        </footer>

      </main>

      {/* =================================================
          MESSAGE TOAST
      ================================================= */}

      {message && (

        <div className="toast">

          <span>
            ●
          </span>

          {message}

          <button
            onClick={() =>
              setMessage("")
            }
          >
            ×
          </button>

        </div>

      )}

    </div>
  );
}

export default App;