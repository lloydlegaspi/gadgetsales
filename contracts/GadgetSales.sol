// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GadgetSales
 * @dev A blockchain-based transaction verification system for second-hand gadget sales.
 * Records sale agreements, status updates, and actor actions in an immutable ledger.
 */
contract GadgetSales {
    // ============ Enums ============

    enum SaleStatus {
        Created,
        Accepted,
        Delivered,
        Completed,
        Disputed,
        Cancelled
    }

    // ============ Structs ============

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

    // ============ Storage ============

    uint256 private nextSaleId = 1;
    mapping(uint256 => Sale) private sales;
    mapping(address => uint256[]) private saleIdsBySeller;
    mapping(address => uint256[]) private saleIdsByBuyer;

    // ============ Events ============

    event SaleCreated(
        uint256 indexed saleId,
        address indexed seller,
        uint256 price,
        string agreementHash,
        uint256 timestamp
    );

    event SaleAccepted(uint256 indexed saleId, address indexed buyer, uint256 timestamp);

    event SaleDelivered(uint256 indexed saleId, address indexed seller, uint256 timestamp);

    event SaleCompleted(uint256 indexed saleId, address indexed buyer, uint256 timestamp);

    event SaleDisputed(uint256 indexed saleId, address indexed buyer, uint256 timestamp);

    event SaleCancelled(uint256 indexed saleId, address indexed seller, uint256 timestamp);

    // ============ Create Sale ============

    /**
     * @dev Create a new sale record.
     * @param price The agreed sale price (in wei or smallest unit).
     * @param gadgetName The name of the gadget being sold.
     * @param brandModel The brand and model of the gadget.
     * @param conditionSummary A brief description of the gadget's condition.
     * @param agreementHash Hash of the agreed sale terms.
     * @param proofHash Optional hash of proof documents (receipts, photos).
     * @return The ID of the newly created sale.
     */
    function createSale(
        uint256 price,
        string calldata gadgetName,
        string calldata brandModel,
        string calldata conditionSummary,
        string calldata agreementHash,
        string calldata proofHash
    ) external returns (uint256) {
        uint256 saleId = nextSaleId;
        nextSaleId++;

        Sale storage sale = sales[saleId];
        sale.id = saleId;
        sale.seller = msg.sender;
        sale.buyer = address(0);
        sale.price = price;
        sale.gadgetName = gadgetName;
        sale.brandModel = brandModel;
        sale.conditionSummary = conditionSummary;
        sale.agreementHash = agreementHash;
        sale.proofHash = proofHash;
        sale.status = SaleStatus.Created;
        sale.createdAt = block.timestamp;

        saleIdsBySeller[msg.sender].push(saleId);

        emit SaleCreated(saleId, msg.sender, price, agreementHash, block.timestamp);

        return saleId;
    }

    // ============ Accept Sale ============

    /**
     * @dev Accept a sale. Only callable by a wallet that is not the seller.
     * @param saleId The ID of the sale to accept.
     */
    function acceptSale(uint256 saleId) external {
        Sale storage sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(msg.sender != sale.seller, "Seller cannot accept their own sale");
        require(sale.status == SaleStatus.Created, "Sale must be in Created status");

        sale.buyer = msg.sender;
        sale.status = SaleStatus.Accepted;
        sale.acceptedAt = block.timestamp;

        saleIdsByBuyer[msg.sender].push(saleId);

        emit SaleAccepted(saleId, msg.sender, block.timestamp);
    }

    // ============ Mark Delivered ============

    /**
     * @dev Mark the item as delivered. Only the seller can call this.
     * @param saleId The ID of the sale to mark as delivered.
     */
    function markDelivered(uint256 saleId) external {
        Sale storage sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(msg.sender == sale.seller, "Only seller can mark as delivered");
        require(sale.status == SaleStatus.Accepted, "Sale must be in Accepted status");

        sale.status = SaleStatus.Delivered;
        sale.deliveredAt = block.timestamp;

        emit SaleDelivered(saleId, msg.sender, block.timestamp);
    }

    // ============ Confirm Receipt ============

    /**
     * @dev Confirm receipt of the item. Only the buyer can call this.
     * @param saleId The ID of the sale to confirm.
     */
    function confirmReceipt(uint256 saleId) external {
        Sale storage sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(msg.sender == sale.buyer, "Only buyer can confirm receipt");
        require(sale.status == SaleStatus.Delivered, "Sale must be in Delivered status");

        sale.status = SaleStatus.Completed;
        sale.completedAt = block.timestamp;

        emit SaleCompleted(saleId, msg.sender, block.timestamp);
    }

    // ============ Open Dispute ============

    /**
     * @dev Open a dispute. Only the buyer can call this.
     * @param saleId The ID of the sale to dispute.
     */
    function openDispute(uint256 saleId) external {
        Sale storage sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(msg.sender == sale.buyer, "Only buyer can open dispute");
        require(sale.status == SaleStatus.Delivered, "Sale must be in Delivered status");

        sale.status = SaleStatus.Disputed;
        sale.disputedAt = block.timestamp;

        emit SaleDisputed(saleId, msg.sender, block.timestamp);
    }

    // ============ Cancel Sale ============

    /**
     * @dev Cancel a sale. Only the seller can call this.
     * Can only cancel from Created or Accepted status.
     * @param saleId The ID of the sale to cancel.
     */
    function cancelSale(uint256 saleId) external {
        Sale storage sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(msg.sender == sale.seller, "Only seller can cancel");
        require(
            sale.status == SaleStatus.Created || sale.status == SaleStatus.Accepted,
            "Can only cancel from Created or Accepted status"
        );

        sale.status = SaleStatus.Cancelled;
        sale.cancelledAt = block.timestamp;

        emit SaleCancelled(saleId, msg.sender, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @dev Get a sale by its ID.
     * @param saleId The ID of the sale.
     * @return The Sale struct.
     */
    function getSale(uint256 saleId) external view returns (Sale memory) {
        require(sales[saleId].seller != address(0), "Sale does not exist");
        return sales[saleId];
    }

    /**
     * @dev Get all sale IDs created by a seller.
     * @param seller The seller's wallet address.
     * @return An array of sale IDs.
     */
    function getSalesBySeller(address seller) external view returns (uint256[] memory) {
        return saleIdsBySeller[seller];
    }

    /**
     * @dev Get all sale IDs accepted by a buyer.
     * @param buyer The buyer's wallet address.
     * @return An array of sale IDs.
     */
    function getSalesByBuyer(address buyer) external view returns (uint256[] memory) {
        return saleIdsByBuyer[buyer];
    }
}
