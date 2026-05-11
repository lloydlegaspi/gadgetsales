# GadgetSales Design System

## 1. Product Personality

GadgetSales is a modern, practical transaction verification tool for peer-to-peer second-hand gadget sales. The product should feel trustworthy and professional without feeling overly corporate or complex.

### Personality Traits

- **Trustworthy:** The interface should make users feel that sale records, wallet identities, and status updates are handled carefully.
- **Clear:** Every screen should make the current transaction state obvious.
- **Practical:** The app should prioritize useful transaction actions over decorative blockchain visuals.
- **Student-project friendly:** The design should look polished but remain achievable with simple React/Next.js components and Tailwind CSS.
- **Professional but not corporate-heavy:** Avoid overly formal enterprise styling. Use clean cards, approachable copy, and simple icons.

### Product Positioning

GadgetSales is a **transaction verification system**, not a full marketplace, escrow platform, chat app, or gadget authenticity checker.

Use the product to communicate:

> “Both parties can record and verify the agreed sale details and transaction status using a tamper-resistant blockchain record.”

Do not communicate:

> “This app proves the gadget is authentic, not stolen, or legally guaranteed.”

---

## 2. Visual Style

The visual direction should match the provided homepage reference: a clean fintech-style web dashboard with white surfaces, soft gray backgrounds, blue accents, rounded cards, and status-driven UI elements.

### Overall Look

- Light theme only for MVP.
- White and very light gray backgrounds.
- Deep navy text for strong readability.
- Indigo/blue as the primary brand accent.
- Rounded corners on cards, buttons, inputs, and badges.
- Subtle borders and shadows.
- Minimal gradients, only when used softly in banners or empty states.
- Simple line icons instead of heavy illustrations.
- No neon crypto visuals.
- No coin imagery.
- No dark futuristic Web3 aesthetic.

### Visual Keywords

- Clean
- Calm
- Verifiable
- Dashboard-like
- Structured
- Lightweight fintech
- Modern SaaS
- Transaction-focused

---

## 3. Color Tokens

Use these tokens consistently across the application.

### Brand Colors

```css
--color-brand-50: #eff6ff;
--color-brand-100: #dbeafe;
--color-brand-200: #bfdbfe;
--color-brand-500: #2563eb;
--color-brand-600: #1d4ed8;
--color-brand-700: #1e40af;
--color-brand-900: #172554;
```

### Neutral Colors

```css
--color-background: #f8fafc;
--color-surface: #ffffff;
--color-surface-muted: #f1f5f9;
--color-border: #e2e8f0;
--color-border-strong: #cbd5e1;
--color-text-primary: #0f172a;
--color-text-secondary: #475569;
--color-text-muted: #64748b;
--color-text-disabled: #94a3b8;
```

### Status Colors

#### Created — Blue-gray

```css
--status-created-bg: #f1f5f9;
--status-created-text: #334155;
--status-created-border: #cbd5e1;
```

#### Accepted — Blue

```css
--status-accepted-bg: #dbeafe;
--status-accepted-text: #1d4ed8;
--status-accepted-border: #93c5fd;
```

#### Delivered — Amber

```css
--status-delivered-bg: #fef3c7;
--status-delivered-text: #b45309;
--status-delivered-border: #fcd34d;
```

#### Completed — Green

```css
--status-completed-bg: #dcfce7;
--status-completed-text: #15803d;
--status-completed-border: #86efac;
```

#### Disputed — Orange/Red

```css
--status-disputed-bg: #ffedd5;
--status-disputed-text: #c2410c;
--status-disputed-border: #fdba74;
```

#### Cancelled — Gray/Red

```css
--status-cancelled-bg: #fee2e2;
--status-cancelled-text: #b91c1c;
--status-cancelled-border: #fca5a5;
```

### Feedback Colors

```css
--feedback-success-bg: #ecfdf5;
--feedback-success-text: #047857;
--feedback-warning-bg: #fffbeb;
--feedback-warning-text: #b45309;
--feedback-error-bg: #fef2f2;
--feedback-error-text: #b91c1c;
--feedback-info-bg: #eff6ff;
--feedback-info-text: #1d4ed8;
```

---

## 4. Typography Rules

Use a clean sans-serif typeface. The default Next.js font stack or Inter-style fonts work well.

### Font Family

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Type Scale

| Use Case | Size | Weight | Line Height |
|---|---:|---:|---:|
| Hero heading | 44–56px | 700–800 | 1.05–1.15 |
| Page title | 32–40px | 700 | 1.15 |
| Section heading | 22–28px | 700 | 1.2 |
| Card title | 16–18px | 600–700 | 1.3 |
| Body text | 14–16px | 400–500 | 1.5–1.7 |
| Helper text | 12–14px | 400 | 1.4–1.6 |
| Label text | 12–14px | 500–600 | 1.2 |
| Badge text | 12–13px | 600 | 1 |
| Monospace hash/address | 12–14px | 500 | 1.4 |

### Typography Guidelines

- Use dark navy for major headings.
- Use slate gray for explanatory text.
- Avoid long paragraphs in transaction screens.
- Prefer short, scannable labels.
- Use monospace only for wallet addresses, transaction hashes, agreement hashes, and proof hashes.
- Do not use overly playful fonts.
- Do not use all-caps except for tiny labels where appropriate.

---

## 5. Spacing Rules

Use an 8px spacing system.

### Base Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Layout Spacing

- Page horizontal padding:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 48–64px
- Section vertical spacing:
  - Standard: 48–64px
  - Compact dashboard sections: 24–32px
- Card padding:
  - Small cards: 16px
  - Standard cards: 20–24px
  - Feature/hero cards: 28–32px
- Form field spacing:
  - 12–16px between related fields
  - 24px between form groups
- Button spacing:
  - 12px between adjacent buttons
  - 16–20px above primary form actions

### Density Guidelines

- Home page can be spacious and marketing-oriented.
- Dashboard should be compact but not crowded.
- Sale detail page should prioritize clarity over density.
- Hashes and addresses should never visually dominate the screen.

---

## 6. Button Styles

Buttons should be clear, action-oriented, and status-aware.

### Primary Button

Use for main actions such as `Create Sale`, `Accept Sale`, and `View Dashboard`.

```css
background: #1d4ed8;
color: #ffffff;
border: 1px solid #1d4ed8;
border-radius: 10px;
font-weight: 600;
padding: 10px 16px;
box-shadow: 0 8px 18px rgba(37, 99, 235, 0.18);
```

Interaction states:

- Hover: slightly darker blue.
- Focus: visible blue focus ring.
- Disabled: gray background, muted text, no shadow.

### Secondary Button

Use for lower-priority navigation actions.

```css
background: #ffffff;
color: #1d4ed8;
border: 1px solid #93c5fd;
border-radius: 10px;
font-weight: 600;
padding: 10px 16px;
```

### Destructive Button

Use for `Cancel Sale` and similar irreversible actions.

```css
background: #b91c1c;
color: #ffffff;
border: 1px solid #b91c1c;
border-radius: 10px;
font-weight: 600;
padding: 10px 16px;
```

### Warning Button

Use for `Open Dispute`.

```css
background: #c2410c;
color: #ffffff;
border: 1px solid #c2410c;
border-radius: 10px;
font-weight: 600;
padding: 10px 16px;
```

### Button Copy Rules

Use direct verbs:

- `Create Sale`
- `Accept Sale`
- `Mark as Delivered`
- `Confirm Receipt`
- `Open Dispute`
- `Cancel Sale`
- `Refresh`
- `View Sale`

Avoid vague labels:

- `Submit`
- `Proceed`
- `Continue`
- `Do Action`

---

## 7. Card Styles

Cards are the primary layout surface.

### Standard Card

```css
background: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
padding: 24px;
```

### Compact Card

Use for sale cards, status summaries, and dashboard cards.

```css
background: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 14px;
box-shadow: 0 4px 14px rgba(15, 23, 42, 0.035);
padding: 18px;
```

### Hero Preview Card

Use for homepage visual previews.

```css
background: #ffffff;
border: 1px solid #e2e8f0;
border-radius: 18px;
box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
padding: 24px;
```

### CTA Card

Use for final homepage action blocks.

```css
background: linear-gradient(135deg, #eff6ff 0%, #ffffff 70%);
border: 1px solid #bfdbfe;
border-radius: 18px;
padding: 28px 32px;
```

### Card Guidelines

- Use cards to group related transaction information.
- Use section headings inside large cards.
- Avoid deeply nested cards unless necessary.
- Keep sale status visible near the top of sale-related cards.
- Never hide action-critical information in small text.

---

## 8. Form Styles

Forms should feel safe, predictable, and clear.

### Input Fields

```css
background: #ffffff;
border: 1px solid #cbd5e1;
border-radius: 10px;
padding: 10px 12px;
font-size: 14px;
color: #0f172a;
```

### Input Focus

```css
border-color: #2563eb;
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
outline: none;
```

### Labels

- Place labels above inputs.
- Use 13–14px text.
- Use medium weight.
- Keep labels concise.

Examples:

- `Gadget name`
- `Brand / model`
- `Condition summary`
- `Price`
- `Short notes`
- `Optional proof hash`

### Helper Text

Use helper text to prevent unsafe or out-of-scope input.

Examples:

- “Do not enter private information such as IMEI, serial numbers, home addresses, or personal IDs.”
- “Only transaction fields and hashes should be stored on-chain.”
- “This prototype uses local/testnet accounts only.”

### Error Text

- Place validation messages near the relevant field.
- Use red text with an accessible icon if possible.
- Be specific and actionable.

Example:

> Price must be greater than zero.

Do not use vague errors:

> Invalid input.

---

## 9. Status Badge Styles

Status badges should be highly scannable and consistent across dashboard cards, sale detail pages, and timelines.

### General Badge Style

```css
display: inline-flex;
align-items: center;
gap: 6px;
border-radius: 999px;
padding: 6px 10px;
font-size: 12px;
font-weight: 600;
border: 1px solid;
```

### Status Mapping

| Status | Background | Text | Border | UI Meaning |
|---|---|---|---|---|
| Created | Blue-gray | Slate | Slate border | Sale exists but no buyer yet |
| Accepted | Blue | Blue | Light blue border | Buyer accepted the sale |
| Delivered | Amber | Amber/brown | Amber border | Seller marked item as delivered |
| Completed | Green | Green | Green border | Buyer confirmed receipt |
| Disputed | Orange/red | Orange/red | Orange border | Buyer opened a dispute |
| Cancelled | Gray/red | Red | Red border | Seller cancelled the sale |

### Badge Copy

Use exact labels:

- `Created`
- `Accepted`
- `Delivered`
- `Completed`
- `Disputed`
- `Cancelled`

Avoid alternative labels that may confuse the state machine:

- `Done`
- `Approved`
- `Finished`
- `Failed`
- `Rejected`

---

## 10. Timeline Styles

The timeline is a core visual pattern because GadgetSales is about transaction history.

### Timeline Purpose

Use the timeline to show the chronological record of a sale:

1. Sale Created
2. Buyer Accepted
3. Seller Marked Delivered
4. Buyer Completed or Disputed
5. Seller Cancelled, where applicable

### Timeline Layout

- Use a vertical timeline on sale detail pages.
- Use compact horizontal/step layouts on homepage explanation sections.
- Each timeline item should include:
  - Icon
  - Event title
  - Actor role
  - Timestamp
  - Optional transaction hash or transaction link
  - Status indicator

### Timeline Visual Rules

- Completed steps use blue or green icons.
- Current/pending step may use amber.
- Future/inactive steps use gray.
- Use a thin connecting line.
- Keep timestamps readable but secondary.
- Do not overload the timeline with raw blockchain details unless the user expands/copies them.

### Timeline Copy Examples

- `Sale agreement created`
- `Buyer accepted the transaction`
- `Seller marked item as delivered`
- `Buyer confirmed receipt`
- `Buyer opened a dispute`
- `Seller cancelled the sale`

---

## 11. Wallet Address Display Rules

Wallet addresses are identities in this prototype, so they should be visible but not overwhelming.

### Display Format

Use shortened format by default:

```text
0x8A3F...7C9D
```

### Full Address

Show the full address only:

- In a copyable tooltip.
- In an expanded details section.
- In developer/debug views.

### Wallet Chip

The connected wallet chip should include:

- Wallet icon
- Shortened wallet address
- Green connected dot
- `Connected` label where space allows
- Optional dropdown chevron

### Wallet States

#### Disconnected

Show:

- `Connect Wallet` button
- Helpful explanation when an action requires wallet connection

#### Connected

Show:

- Shortened wallet address
- Connected indicator
- Available role-based actions

#### Wrong Network

Show:

- Warning state
- Clear text: “Switch to the configured local/testnet network.”

### Wallet Copy Rules

Use:

- `Connect Wallet`
- `Connected`
- `Wallet required`
- `Switch network`

Avoid:

- `Login`
- `Sign in`
- `Account verified`

Wallet connection is identity for this prototype, but it is not traditional authentication.

---

## 12. Hash Display Rules

Hashes are important proof references but should remain readable.

### Hash Types

- `agreementHash`
- `proofHash`
- transaction hash
- optional file/proof hash

### Display Format

Use shortened hash by default:

```text
0x5f6a...e3b2
```

Show full hash in:

- A monospace block.
- Copyable field.
- Expanded details area.

### Hash Container Style

```css
background: #f8fafc;
border: 1px solid #e2e8f0;
border-radius: 10px;
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
font-size: 13px;
padding: 10px 12px;
overflow-wrap: anywhere;
```

### Copy Interaction

Every hash display should ideally include a copy button.

Copy button behavior:

- Small icon button.
- Accessible label: `Copy agreement hash`.
- Success feedback: `Copied`.
- No large modal needed.

### Hash Copywriting

Explain hashes simply:

> “The agreement hash represents the agreed sale details without storing long private content on-chain.”

Avoid overclaiming:

> “This hash proves the item is authentic.”

---

## 13. Accessibility Guidelines

### Color and Contrast

- Do not rely on color alone to communicate status.
- Pair badges with text labels.
- Ensure text contrast meets WCAG AA where possible.
- Use darker text on light backgrounds.
- Avoid pale blue text on white for body copy.

### Keyboard Accessibility

- All buttons and links must be keyboard-focusable.
- Focus states must be visible.
- Do not remove outlines unless replacing them with clear focus rings.
- Forms should be usable with Tab and Enter.

### Screen Reader Guidelines

- Buttons must have descriptive labels.
- Icon-only buttons need `aria-label`.
- Status changes should be announced where practical.
- Loading states should include readable text, not only spinners.

### Form Accessibility

- Every input must have a visible label.
- Error messages should reference the related field.
- Required fields should be marked visually and programmatically where possible.

### Motion

- Keep animation subtle.
- Avoid looping motion.
- Respect reduced-motion preferences.

---

## 14. Copywriting Rules

The app must be accurate about what the blockchain system does and does not do.

### Preferred Terms

Use:

- `transaction verification`
- `sale agreement`
- `tamper-resistant record`
- `on-chain status update`
- `shared transaction history`
- `testnet/local prototype`
- `wallet address`
- `agreement hash`
- `proof hash`
- `status timeline`

Avoid:

- `gadget authenticity verification`
- `guaranteed authentic`
- `legal proof`
- `fraud-proof`
- `real payment app`
- `escrow service`
- `identity verification`
- `anti-theft verification`

### Required Disclaimer Language

Use this style of disclaimer where appropriate:

> GadgetSales records agreement and transaction status. It does not verify physical gadget authenticity.

For local/testnet use:

> This is a local/testnet prototype. Do not use real funds or private keys.

For disputes:

> This MVP records that a dispute was opened but does not resolve disputes automatically.

For completion:

> Completing a sale records final confirmation on-chain and cannot be changed.

### Tone

- Clear
- Calm
- Direct
- Non-technical where possible
- Honest about limitations
- Avoid hype

### Button Copy

Good:

- `Create Sale`
- `Accept Sale`
- `Mark as Delivered`
- `Confirm Receipt`
- `Open Dispute`
- `Cancel Sale`
- `View Dashboard`
- `View Sale`

Avoid:

- `Execute`
- `Broadcast`
- `Mint`
- `Finalize On-Chain Operation`
- `Authenticate Gadget`

---

## 15. Page-Level Design Guidance

### Home Page

The home page should explain the concept quickly.

Include:

- Hero headline.
- Short explanation.
- `Create Sale` and `View Dashboard` buttons.
- Trust note.
- How-it-works section.
- Why-blockchain section.
- Out-of-scope section.
- Final CTA.

Keep the homepage visually similar to the provided reference image.

### Create Sale Page

The create sale page should feel like a safe agreement form.

Include:

- Clear form labels.
- Agreement preview.
- Agreement hash display.
- Wallet-required state.
- Transaction status component.
- Warning against private data entry.

### Sale Detail Page

The sale detail page should be the strongest dashboard screen.

Include:

- Sale ID and status badge.
- Gadget details.
- Seller and buyer wallet addresses.
- Agreement/proof hashes.
- Role-aware action buttons.
- Transaction timeline.
- Clear terminal-state explanations.

### Dashboard Page

The dashboard should be simple and on-chain-driven.

Include:

- Connected wallet summary.
- `Sales I Created`
- `Sales I Accepted`
- Empty states.
- Refresh buttons.
- Sale cards with status badges.

Do not add analytics, charts, search, or marketplace browsing in MVP.

---

## 16. Component Guidelines

### Header

The header should include:

- GadgetSales logo.
- Navigation links.
- Wallet status chip.

Keep it fixed or sticky only if it does not distract from the content.

### Sale Card

Each sale card should show:

- Sale ID
- Gadget name
- Brand/model
- Price
- Status badge
- Seller address
- Buyer address, if available
- `View Sale` link

### Transaction Status Component

States:

- `Idle`
- `Awaiting wallet confirmation`
- `Pending blockchain confirmation`
- `Success`
- `Error`

Use calm, clear copy.

### Empty State

Empty states should explain what happened and what the user can do next.

Example:

> You have not created any sale records yet.

Action:

> Create Sale

---

## 17. Implementation Notes for Tailwind CSS

Recommended utility patterns:

### Page Wrapper

```tsx
className="min-h-screen bg-slate-50 text-slate-950"
```

### Container

```tsx
className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
```

### Card

```tsx
className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
```

### Primary Button

```tsx
className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
```

### Secondary Button

```tsx
className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

### Input

```tsx
className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
```

### Hash Block

```tsx
className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 break-all"
```

---

## 18. Out-of-Scope Design Guardrails

Do not design or implement:

- Escrow payment UI.
- Chat interface.
- Seller ratings.
- Marketplace browsing.
- Search filters.
- Product recommendations.
- IMEI verification flows.
- Identity verification screens.
- Admin moderation dashboards.
- Token balances.
- NFT minting.
- Crypto price widgets.
- Dark mode toggle.
- Complex analytics dashboard.

If future versions add these, update `specs.md` and this `DESIGN.md` first.

---

## 19. Final Design Principle

Every UI decision should support the main product promise:

> GadgetSales helps buyers and sellers create a shared, tamper-resistant transaction record for second-hand gadget sales.

When unsure, choose clarity, status visibility, and accurate limitation-setting over visual complexity.
