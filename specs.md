# GadgetSales — AI-Optimized Product Requirements Document

## 1. Project Overview & Core Intent

### The Goal

GadgetSales is a web application for peer-to-peer second-hand gadget sales where a seller and buyer record the agreed transaction details and status updates on a blockchain. The application solves the problem of editable, deletable, or disputed chat-based agreements by creating a shared, tamper-resistant transaction history for the sale.

### Core Intent

The system is not a full e-commerce marketplace and does not claim to verify the physical authenticity of a gadget. Its purpose is to verify the transaction agreement, participant actions, status changes, and proof references between a buyer and seller.

### Target Personas

- **Seller:** A person selling a second-hand gadget who wants a clear record of the agreed item details, price, condition, and delivery status.
- **Buyer:** A person buying a second-hand gadget who wants a verifiable record of what was agreed before accepting the item.
- **Student/demo evaluator:** A teacher, panelist, or reviewer evaluating the system as a blockchain-based transaction verification prototype.

### UX Principles

- Use simple, non-technical language.
- Always explain what will be stored on-chain before a wallet transaction.
- Show the current sale status clearly.
- Prevent users from taking actions that are not valid for the current status.
- Preserve user input after wallet or transaction errors.
- Do not present blockchain as a guarantee that the gadget is genuine or not stolen.

## 2. Definitive Tech Stack

### Frontend

- **Framework:** Next.js using the App Router.
- **Language:** TypeScript.
- **UI library:** React.
- **Styling:** Tailwind CSS.
- **Wallet connection:** MetaMask-compatible injected wallet.
- **Web3 interaction:** ethers.js.
- **State management:** React state and custom hooks only.
- **Notifications:** Simple local toast/alert component created inside the app.
- **Routing:** App Router pages for listing, sale details, create sale, and dashboard views.

### Smart Contract

- **Language:** Solidity `^0.8.24`.
- **Development environment:** Hardhat.
- **Testing:** Hardhat tests written in TypeScript or JavaScript.
- **Deployment target for MVP:** Local Hardhat network.
- **Optional testnet:** Ethereum Sepolia testnet after the local MVP works.

### Backend

- **Backend:** None for MVP.
- **API server:** Do not build an API server.
- **Authentication server:** Do not build a login/authentication backend.
- **Identity:** Wallet address is the only identity mechanism.

### Database & Storage

- **On-chain storage:** Sale ID, seller address, buyer address, agreed price, agreement hash, optional proof hash, status, and status timestamps.
- **Off-chain storage:** Full gadget description, long notes, actual images, receipt files, and UI-only session data.
- **Local storage:** Browser `localStorage` may be used only for temporary draft data and UI convenience.
- **No external database for MVP:** Do not integrate Firebase, Supabase, PostgreSQL, MongoDB, SQLite, or hosted storage.

### Development Assumptions

- The app is a prototype and should use test ETH only.
- The app should prioritize clear smart contract logic over advanced marketplace features.
- All write operations that change sale state must go through the smart contract.

## 3. Strict Scope & Anti-Goals (Crucial for AI)

### In-Scope (The MVP)

- Seller can create a gadget sale record.
- Seller can enter:
  - gadget name
  - brand/model
  - condition summary
  - price
  - short notes
  - optional proof hash
- System generates an `agreementHash` from the agreed sale details before writing to the blockchain.
- Buyer can view a created sale record.
- Buyer can accept the sale.
- Seller can mark the item as delivered or handed over.
- Buyer can confirm receipt and complete the transaction.
- Buyer can open a dispute after delivery.
- Seller can cancel a sale before it is completed.
- System stores sale status on-chain.
- System records timestamps for major status changes.
- System shows immutable transaction history based on smart contract events and state.
- System restricts status-changing actions to the correct actor:
  - seller-only actions
  - buyer-only actions
  - buyer-or-seller read access where appropriate
- UI shows transaction states:
  - idle
  - awaiting wallet confirmation
  - pending blockchain confirmation
  - success
  - error
- Include smart contract tests for:
  - creating a sale
  - accepting a sale
  - marking delivered
  - confirming completion
  - opening dispute
  - cancelling
  - rejecting invalid actors
  - rejecting invalid status transitions

### Out-of-Scope (Anti-Goals)

- Do **NOT** build a full marketplace with browsing, search, recommendations, seller ratings, or featured listings.
- Do **NOT** build a chat system.
- Do **NOT** build a real payment system.
- Do **NOT** implement escrow in MVP.
- Do **NOT** handle real ETH, stablecoins, or token payments in MVP.
- Do **NOT** build NFT ownership or ERC-721 tickets for gadgets.
- Do **NOT** build an ERC-20 token.
- Do **NOT** integrate real IMEI/serial number verification APIs.
- Do **NOT** claim that the app proves a gadget is original, not stolen, not repaired, or not activation-locked.
- Do **NOT** store raw IMEI, serial numbers, government IDs, phone numbers, addresses, or private personal data on-chain.
- Do **NOT** upload actual photos or receipts to the blockchain.
- Do **NOT** add user login, email/password authentication, or social login.
- Do **NOT** add admin dashboards, moderation workflows, or support tickets.
- Do **NOT** add multi-chain support.
- Do **NOT** add dark mode unless all MVP functionality is complete.
- Do **NOT** add a production database.
- Do **NOT** add shipping integrations.
- Do **NOT** add automated dispute resolution.
- Do **NOT** add legal claims such as “court-admissible proof” or “guaranteed fraud prevention.”

## 4. Data Models & State Architecture

### Smart Contract Enum: `SaleStatus`

```solidity
enum SaleStatus {
    Created,
    Accepted,
    Delivered,
    Completed,
    Disputed,
    Cancelled
}
```

### Smart Contract Entity: `Sale`

```solidity
struct Sale {
    uint256 id;
    address seller;
    address buyer;
    uint256 price;
    string gadgetName;
    string brandModel;
    string conditionSummary;
    string agreementHash;
    string proofHash;
    SaleStatus status;
    uint256 createdAt;
    uint256 acceptedAt;
    uint256 deliveredAt;
    uint256 completedAt;
    uint256 disputedAt;
    uint256 cancelledAt;
}
```

### Field Definitions

- `id` (`uint256`): Unique sale identifier assigned by the contract.
- `seller` (`address`): Wallet address that created the sale.
- `buyer` (`address`): Wallet address that accepted the sale. Defaults to zero address until accepted.
- `price` (`uint256`): Agreed sale price represented in the smallest unit selected by the app. For MVP display, treat this as a plain integer amount and label the currency in the UI as demo PHP or test value.
- `gadgetName` (`string`): Short item name such as `iPhone 12`.
- `brandModel` (`string`): Brand and model details such as `Apple iPhone 12 128GB`.
- `conditionSummary` (`string`): Short condition description such as `Used, minor scratches, battery health 86%`.
- `agreementHash` (`string`): Hash of the full agreement data shown to both parties before blockchain submission.
- `proofHash` (`string`): Optional hash of proof photos, receipt, or supporting files. Empty string is allowed.
- `status` (`SaleStatus`): Current transaction state.
- `createdAt` (`uint256`): Block timestamp when seller created the sale.
- `acceptedAt` (`uint256`): Block timestamp when buyer accepted the sale.
- `deliveredAt` (`uint256`): Block timestamp when seller marked the item as delivered or handed over.
- `completedAt` (`uint256`): Block timestamp when buyer confirmed receipt.
- `disputedAt` (`uint256`): Block timestamp when buyer opened a dispute.
- `cancelledAt` (`uint256`): Block timestamp when seller cancelled the sale.

### Smart Contract Storage

```solidity
uint256 private nextSaleId;
mapping(uint256 => Sale) private sales;
mapping(address => uint256[]) private saleIdsBySeller;
mapping(address => uint256[]) private saleIdsByBuyer;
```

### Smart Contract Events

```solidity
event SaleCreated(
    uint256 indexed saleId,
    address indexed seller,
    uint256 price,
    string agreementHash,
    uint256 timestamp
);

event SaleAccepted(
    uint256 indexed saleId,
    address indexed buyer,
    uint256 timestamp
);

event SaleDelivered(
    uint256 indexed saleId,
    address indexed seller,
    uint256 timestamp
);

event SaleCompleted(
    uint256 indexed saleId,
    address indexed buyer,
    uint256 timestamp
);

event SaleDisputed(
    uint256 indexed saleId,
    address indexed buyer,
    uint256 timestamp
);

event SaleCancelled(
    uint256 indexed saleId,
    address indexed seller,
    uint256 timestamp
);
```

### Smart Contract Functions

```solidity
function createSale(
    uint256 price,
    string calldata gadgetName,
    string calldata brandModel,
    string calldata conditionSummary,
    string calldata agreementHash,
    string calldata proofHash
) external returns (uint256);

function acceptSale(uint256 saleId) external;

function markDelivered(uint256 saleId) external;

function confirmReceipt(uint256 saleId) external;

function openDispute(uint256 saleId) external;

function cancelSale(uint256 saleId) external;

function getSale(uint256 saleId) external view returns (Sale memory);

function getSalesBySeller(address seller) external view returns (uint256[] memory);

function getSalesByBuyer(address buyer) external view returns (uint256[] memory);
```

### Required Status Transitions

```text
Created -> Accepted
Created -> Cancelled
Accepted -> Delivered
Accepted -> Cancelled
Delivered -> Completed
Delivered -> Disputed
```

### Invalid Status Transitions

The contract must reject:

- `Created -> Delivered`
- `Created -> Completed`
- `Accepted -> Completed`
- `Delivered -> Cancelled`
- `Completed -> any other status`
- `Disputed -> any other status`
- `Cancelled -> any other status`

### Required Actor Permissions

| Action | Allowed Actor | Required Status |
|---|---|---|
| Create sale | Seller / any wallet | None |
| Accept sale | Buyer / any wallet except seller | Created |
| Cancel sale | Seller only | Created or Accepted |
| Mark delivered | Seller only | Accepted |
| Confirm receipt | Buyer only | Delivered |
| Open dispute | Buyer only | Delivered |
| View sale | Any connected or unconnected user | Any status |

### Frontend TypeScript Types

```ts
type SaleStatus =
  | "Created"
  | "Accepted"
  | "Delivered"
  | "Completed"
  | "Disputed"
  | "Cancelled";

type Sale = {
  id: bigint;
  seller: `0x${string}`;
  buyer: `0x${string}`;
  price: bigint;
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  agreementHash: string;
  proofHash: string;
  status: SaleStatus;
  createdAt: bigint;
  acceptedAt: bigint;
  deliveredAt: bigint;
  completedAt: bigint;
  disputedAt: bigint;
  cancelledAt: bigint;
};
```

### Frontend Form State: `CreateSaleFormState`

```ts
type CreateSaleFormState = {
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  price: string;
  notes: string;
  proofHash: string;
  agreementHash: string | null;
  validationErrors: Record<string, string>;
};
```

### Frontend Transaction State

```ts
type TransactionState = {
  status:
    | "idle"
    | "awaiting_wallet_confirmation"
    | "pending_blockchain_confirmation"
    | "success"
    | "error";
  transactionHash: `0x${string}` | null;
  errorMessage: string | null;
};
```

### Frontend State Architecture

- `WalletProvider`: Configures wallet connection and provides wallet state to the app.
- `useWallet`: Returns connected address, connection state, and wallet actions.
- `useCreateSale`: Validates sale form, generates agreement hash, submits `createSale`, and tracks transaction state.
- `useSale`: Loads one sale by sale ID.
- `useSellerSales`: Loads sale IDs created by the connected seller wallet.
- `useBuyerSales`: Loads sale IDs accepted by the connected buyer wallet.
- `useSaleActions`: Handles `acceptSale`, `markDelivered`, `confirmReceipt`, `openDispute`, and `cancelSale`.
- `useAgreementHash`: Generates a deterministic hash from sale agreement fields in the browser.

### Agreement Hash Input Shape

The app should generate `agreementHash` from a deterministic JSON object:

```ts
type AgreementPayload = {
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  price: string;
  notes: string;
  proofHash: string;
};
```

Before hashing:

- Trim leading and trailing whitespace.
- Normalize empty optional values to empty strings.
- Preserve exact agreed wording after normalization.
- Show the user the final agreement summary before wallet submission.

## 5. Step-by-Step User Flows

### Flow 1: Connect Wallet

#### Trigger

User clicks `Connect Wallet`.

#### Validation/Processing

- Check whether a MetaMask-compatible injected wallet is available.
- Request wallet account access.
- Read the connected wallet address.
- Detect unsupported or wrong network.
- Do not create a backend session.

#### Outcome

- Show shortened wallet address in the header.
- Enable create and status update actions.
- If connection fails, show a clear error message and keep the app in read-only mode.

### Flow 2: Seller Creates a Sale Record

#### Trigger

Seller opens `Create Sale` and submits the sale form.

#### Validation/Processing

- Require connected wallet.
- Require `gadgetName` to be 1–80 characters.
- Require `brandModel` to be 1–100 characters.
- Require `conditionSummary` to be 1–160 characters.
- Require `price` to be a positive numeric value.
- Allow `notes` up to 240 characters.
- Allow `proofHash` to be empty or up to 256 characters.
- Generate `agreementHash` from the normalized agreement payload.
- Show a confirmation summary before blockchain submission.
- Submit `createSale` transaction.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- New sale appears in seller dashboard.
- Sale status is `Created`.
- Buyer field is empty/zero address.
- Show success toast with sale ID and transaction hash.
- If transaction fails, preserve form data and show error message.

### Flow 3: Buyer Views Sale Details

#### Trigger

Buyer opens a sale detail page using a sale ID or shared link.

#### Validation/Processing

- Fetch sale data from the smart contract.
- Convert blockchain timestamps to readable dates.
- Display agreement details and current status.
- If buyer is the seller, hide the `Accept Sale` button.
- If sale is not `Created`, hide the `Accept Sale` button.

#### Outcome

- Buyer sees gadget details, seller wallet, price, proof hash if provided, agreement hash, and status history.
- Buyer can accept only if the sale is currently `Created` and the buyer is not the seller.

### Flow 4: Buyer Accepts the Sale

#### Trigger

Buyer clicks `Accept Sale`.

#### Validation/Processing

- Require connected wallet.
- Require sale status to be `Created`.
- Reject if connected wallet is the seller.
- Submit `acceptSale(saleId)`.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- Sale status changes to `Accepted`.
- Buyer address is recorded on-chain.
- `acceptedAt` timestamp is set.
- Seller can now mark the item as delivered.
- Buyer can no longer be changed.

### Flow 5: Seller Marks Item as Delivered / Handed Over

#### Trigger

Seller clicks `Mark as Delivered`.

#### Validation/Processing

- Require connected wallet.
- Require connected wallet to match seller address.
- Require sale status to be `Accepted`.
- Submit `markDelivered(saleId)`.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- Sale status changes to `Delivered`.
- `deliveredAt` timestamp is set.
- Buyer can now either confirm receipt or open a dispute.

### Flow 6: Buyer Confirms Receipt

#### Trigger

Buyer clicks `Confirm Receipt`.

#### Validation/Processing

- Require connected wallet.
- Require connected wallet to match buyer address.
- Require sale status to be `Delivered`.
- Submit `confirmReceipt(saleId)`.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- Sale status changes to `Completed`.
- `completedAt` timestamp is set.
- The sale becomes final.
- No further status updates are allowed.

### Flow 7: Buyer Opens a Dispute

#### Trigger

Buyer clicks `Open Dispute`.

#### Validation/Processing

- Require connected wallet.
- Require connected wallet to match buyer address.
- Require sale status to be `Delivered`.
- Submit `openDispute(saleId)`.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- Sale status changes to `Disputed`.
- `disputedAt` timestamp is set.
- UI displays the sale as disputed.
- No automated resolution is performed in MVP.
- Show explanatory text: “This MVP records that a dispute was opened but does not resolve disputes automatically.”

### Flow 8: Seller Cancels a Sale

#### Trigger

Seller clicks `Cancel Sale`.

#### Validation/Processing

- Require connected wallet.
- Require connected wallet to match seller address.
- Require sale status to be `Created` or `Accepted`.
- Submit `cancelSale(saleId)`.
- Wait for wallet confirmation.
- Wait for blockchain confirmation.

#### Outcome

- Sale status changes to `Cancelled`.
- `cancelledAt` timestamp is set.
- No further status updates are allowed.

### Flow 9: View Immutable Transaction History

#### Trigger

User opens a sale detail page.

#### Validation/Processing

- Read current sale state from the smart contract.
- Read or reconstruct history using status timestamps and smart contract events.
- Show only events that have non-zero timestamps or emitted logs.
- Sort events chronologically.

#### Outcome

- Display a timeline:
  - Sale Created
  - Sale Accepted
  - Marked Delivered
  - Completed / Disputed / Cancelled
- Each timeline item shows actor wallet, status, timestamp, and transaction hash if available.
- The timeline should make it clear that these records come from blockchain transactions.

### Flow 10: Handle Wallet and Transaction Errors

#### Trigger

Any wallet or contract action fails.

#### Validation/Processing

- Detect common cases:
  - wallet not installed
  - user rejected transaction
  - wrong network
  - RPC failure
  - contract reverted due to invalid actor
  - contract reverted due to invalid status transition
- Convert technical errors into user-facing messages.
- Log raw error details to the browser console during development only.

#### Outcome

- Show a visible toast or inline alert.
- Keep the user on the same page.
- Preserve form input where possible.
- Do not retry transactions automatically.
- Let the user manually retry after fixing the issue.
