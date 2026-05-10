import { expect } from "chai";
import { network } from "hardhat";
import type { Contract } from "ethers";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { anyValue } from "@nomicfoundation/hardhat-ethers-chai-matchers/withArgs";

describe("GadgetSales", function () {
  let hhEthers: Awaited<ReturnType<typeof network.create>>["ethers"];
  let gadgetSales: Contract;
  let seller: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let other: HardhatEthersSigner;

  beforeEach(async function () {
    const connection = await network.create();
    hhEthers = connection.ethers;

    [seller, buyer, other] = await hhEthers.getSigners();

    const GadgetSalesFactory = await hhEthers.getContractFactory("GadgetSales");
    gadgetSales = await GadgetSalesFactory.deploy();
  });

  describe("Create Sale", function () {
    it("should create a sale with correct seller and status", async function () {
      await expect(
        gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple iPhone 12 128GB",
        "Used, minor scratches",
        "0xabcd1234",
        "0x"
        )
      ).to.emit(gadgetSales, "SaleCreated");

      const sale = await gadgetSales.getSale(1);
      expect(sale.id).to.equal(1);
      expect(sale.seller).to.equal(seller.address);
      expect(sale.buyer).to.equal(hhEthers.ZeroAddress);
      expect(sale.gadgetName).to.equal("iPhone 12");
      expect(sale.status).to.equal(0); // Created
    });

    it("should increment sale IDs correctly", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "Item1",
        "Brand1",
        "Condition1",
        "0xhash1",
        "0x"
      );

      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("2.0"),
        "Item2",
        "Brand2",
        "Condition2",
        "0xhash2",
        "0x"
      );

      const sale1 = await gadgetSales.getSale(1);
      const sale2 = await gadgetSales.getSale(2);

      expect(sale1.id).to.equal(1);
      expect(sale2.id).to.equal(2);
    });

    it("should add sale ID to seller's list", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );

      const sellerSales = await gadgetSales.getSalesBySeller(seller.address);
      expect(sellerSales).to.include(1n);
    });
  });

  describe("Accept Sale", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
    });

    it("should accept a sale and record buyer", async function () {
      await gadgetSales.connect(buyer).acceptSale(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.buyer).to.equal(buyer.address);
      expect(sale.status).to.equal(1); // Accepted
    });

    it("should reject if seller tries to accept own sale", async function () {
      await expect(gadgetSales.connect(seller).acceptSale(1)).to.be.revertedWith(
        "Seller cannot accept their own sale"
      );
    });

    it("should reject if sale is not in Created status", async function () {
      await gadgetSales.connect(buyer).acceptSale(1);

      await expect(gadgetSales.connect(other).acceptSale(1)).to.be.revertedWith(
        "Sale must be in Created status"
      );
    });

    it("should add sale ID to buyer's list", async function () {
      await gadgetSales.connect(buyer).acceptSale(1);

      const buyerSales = await gadgetSales.getSalesByBuyer(buyer.address);
      expect(buyerSales).to.include(1n);
    });

    it("should emit SaleAccepted event", async function () {
      await expect(gadgetSales.connect(buyer).acceptSale(1))
        .to.emit(gadgetSales, "SaleAccepted")
        .withArgs(1, buyer.address, anyValue);
    });
  });

  describe("Mark Delivered", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(buyer).acceptSale(1);
    });

    it("should mark sale as delivered", async function () {
      await gadgetSales.connect(seller).markDelivered(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.status).to.equal(2); // Delivered
    });

    it("should reject if not seller", async function () {
      await expect(gadgetSales.connect(buyer).markDelivered(1)).to.be.revertedWith(
        "Only seller can mark as delivered"
      );
    });

    it("should reject if sale is not in Accepted status", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "Item",
        "Brand",
        "Condition",
        "0xhash",
        "0x"
      );

      await expect(gadgetSales.connect(seller).markDelivered(2)).to.be.revertedWith(
        "Sale must be in Accepted status"
      );
    });

    it("should emit SaleDelivered event", async function () {
      await expect(gadgetSales.connect(seller).markDelivered(1))
        .to.emit(gadgetSales, "SaleDelivered")
        .withArgs(1, seller.address, anyValue);
    });
  });

  describe("Confirm Receipt", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).markDelivered(1);
    });

    it("should complete sale on receipt confirmation", async function () {
      await gadgetSales.connect(buyer).confirmReceipt(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.status).to.equal(3); // Completed
    });

    it("should reject if not buyer", async function () {
      await expect(gadgetSales.connect(other).confirmReceipt(1)).to.be.revertedWith(
        "Only buyer can confirm receipt"
      );
    });

    it("should reject if sale is not in Delivered status", async function () {
      await expect(gadgetSales.connect(buyer).confirmReceipt(2)).to.be.revertedWith(
        "Sale does not exist"
      );
    });

    it("should emit SaleCompleted event", async function () {
      await expect(gadgetSales.connect(buyer).confirmReceipt(1))
        .to.emit(gadgetSales, "SaleCompleted")
        .withArgs(1, buyer.address, anyValue);
    });
  });

  describe("Open Dispute", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).markDelivered(1);
    });

    it("should open dispute from Delivered status", async function () {
      await gadgetSales.connect(buyer).openDispute(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.status).to.equal(4); // Disputed
    });

    it("should reject if not buyer", async function () {
      await expect(gadgetSales.connect(other).openDispute(1)).to.be.revertedWith(
        "Only buyer can open dispute"
      );
    });

    it("should reject if sale is not in Delivered status", async function () {
      await expect(gadgetSales.connect(buyer).openDispute(2)).to.be.revertedWith(
        "Sale does not exist"
      );
    });

    it("should emit SaleDisputed event", async function () {
      await expect(gadgetSales.connect(buyer).openDispute(1))
        .to.emit(gadgetSales, "SaleDisputed")
        .withArgs(1, buyer.address, anyValue);
    });
  });

  describe("Cancel Sale", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
    });

    it("should cancel sale from Created status", async function () {
      await gadgetSales.connect(seller).cancelSale(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.status).to.equal(5); // Cancelled
    });

    it("should cancel sale from Accepted status", async function () {
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).cancelSale(1);

      const sale = await gadgetSales.getSale(1);
      expect(sale.status).to.equal(5); // Cancelled
    });

    it("should reject if not seller", async function () {
      await expect(gadgetSales.connect(buyer).cancelSale(1)).to.be.revertedWith(
        "Only seller can cancel"
      );
    });

    it("should reject if sale is Delivered", async function () {
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).markDelivered(1);

      await expect(gadgetSales.connect(seller).cancelSale(1)).to.be.revertedWith(
        "Can only cancel from Created or Accepted status"
      );
    });

    it("should emit SaleCancelled event", async function () {
      await expect(gadgetSales.connect(seller).cancelSale(1))
        .to.emit(gadgetSales, "SaleCancelled")
        .withArgs(1, seller.address, anyValue);
    });
  });

  describe("Invalid State Transitions", function () {
    beforeEach(async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
    });

    it("should reject transition from Created to Delivered", async function () {
      await expect(gadgetSales.connect(seller).markDelivered(1)).to.be.revertedWith(
        "Sale must be in Accepted status"
      );
    });

    it("should reject transition from Created to Completed", async function () {
      await expect(gadgetSales.connect(buyer).confirmReceipt(1)).to.be.revertedWith(
        "Only buyer can confirm receipt"
      );
    });

    it("should reject dispute from Created status", async function () {
      await expect(gadgetSales.connect(buyer).openDispute(1)).to.be.revertedWith(
        "Only buyer can open dispute"
      );
    });
  });

  describe("Terminal States", function () {
    it("should not allow state changes from Completed", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).markDelivered(1);
      await gadgetSales.connect(buyer).confirmReceipt(1);

      // Try to change from terminal Completed state
      await expect(gadgetSales.connect(seller).markDelivered(1)).to.be.revertedWith(
        "Sale must be in Accepted status"
      );
    });

    it("should not allow state changes from Disputed", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(buyer).acceptSale(1);
      await gadgetSales.connect(seller).markDelivered(1);
      await gadgetSales.connect(buyer).openDispute(1);

      // Try to change from terminal Disputed state
      await expect(gadgetSales.connect(buyer).confirmReceipt(1)).to.be.revertedWith(
        "Sale must be in Delivered status"
      );
    });

    it("should not allow state changes from Cancelled", async function () {
      await gadgetSales.connect(seller).createSale(
        hhEthers.parseEther("1.0"),
        "iPhone 12",
        "Apple",
        "Good",
        "0xhash",
        "0x"
      );
      await gadgetSales.connect(seller).cancelSale(1);

      // Try to change from terminal Cancelled state
      await expect(gadgetSales.connect(buyer).acceptSale(1)).to.be.revertedWith(
        "Sale must be in Created status"
      );
    });
  });
});
