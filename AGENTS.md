# GadgetSales Agent Guidelines

When working on this project, always follow these rules:

## 1. Read Specs First
- Always read `specs.md` before coding.
- Treat `specs.md` as the source of truth for requirements.
- Do not add features outside the MVP scope defined in specs.md.

## 2. Scope Boundaries
- Do NOT build escrow, chat, or authentication.
- Do NOT build marketplace search, browsing, or seller ratings.
- Do NOT integrate IMEI verification APIs or claim gadget authenticity.
- Do NOT add a backend or database.
- Do NOT store raw IMEI, serial numbers, IDs, addresses, or photos on-chain.
- Do NOT build NFTs, ERC-20 tokens, or real payment systems.

## 3. Smart Contract Development
- Keep blockchain writes restricted to the smart contract.
- Use the exact `SaleStatus` flow from specs.md.
- Store only hashes/references on-chain when data may be private or large.
- Ensure all valid status transitions match specs.md.
- Enforce actor permissions (seller-only, buyer-only actions).
- Reject invalid state transitions with clear revert messages.

## 4. Frontend Architecture
- Use TypeScript types from `src/types/` for all data structures.
- Keep components small and focused.
- Place UI components in `src/components/` by feature (layout/, sales/, wallet/, ui/).
- Use hooks from `src/hooks/` for contract interaction.
- Use utilities from `src/lib/` for formatting and hashing.

## 5. Before Finishing Any Change
- Run `npm run lint` to check code style.
- Run `npm run build` to ensure no TypeScript errors.
- Run `npx hardhat compile` to compile smart contracts.
- Run `npx hardhat test` to verify all tests pass.
- Do not commit unless all checks pass.

## 6. Data Persistence
- Agreement hashes must be deterministic and reproducible.
- Use `generateAgreementHash()` from `src/lib/agreementHash.ts`.
- Show users the agreement summary before wallet submission.
- Store transaction state using the `TransactionState` type.

## 7. Documentation & Code Quality
- Keep code clear and well-commented.
- Use meaningful variable and function names.
- Add JSDoc comments for public functions.
- Follow the existing project structure and naming conventions.

## 8. Testing
- Write tests for all smart contract functions.
- Cover both happy paths and error cases.
- Test invalid actors and invalid state transitions.
- Verify terminal states cannot be changed.
