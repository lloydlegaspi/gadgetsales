"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { EMPTY_CREATE_SALE_FORM } from "@/constants/sale";
import { generateAgreementJSON } from "@/lib/agreementHash";

export default function CreateSale() {
  const [form, setForm] = useState(EMPTY_CREATE_SALE_FORM);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      validationErrors: { ...prev.validationErrors, [name]: "" },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      const errors: Record<string, string> = {};
      if (form.gadgetName.trim().length === 0) {
        errors.gadgetName = "Gadget name is required";
      }
      if (form.brandModel.trim().length === 0) {
        errors.brandModel = "Brand/Model is required";
      }
      if (form.conditionSummary.trim().length === 0) {
        errors.conditionSummary = "Condition summary is required";
      }
      if (!form.price || parseFloat(form.price) <= 0) {
        errors.price = "Price must be a positive number";
      }

      if (Object.keys(errors).length > 0) {
        setForm((prev) => ({ ...prev, validationErrors: errors }));
        return;
      }

      // Generate agreement hash
      const payload = {
        gadgetName: form.gadgetName,
        brandModel: form.brandModel,
        conditionSummary: form.conditionSummary,
        price: form.price,
        notes: form.notes,
        proofHash: form.proofHash,
      };
      const agreementJSON = generateAgreementJSON(payload);

      alert(
        `✓ Form is valid!\n\nAgreement JSON (for hashing):\n${agreementJSON}\n\nIn a real implementation, this would be signed and submitted to the smart contract.`
      );

      setForm(EMPTY_CREATE_SALE_FORM);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Sale</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Gadget Name *
            </label>
            <input
              type="text"
              name="gadgetName"
              value={form.gadgetName}
              onChange={handleChange}
              placeholder="e.g., iPhone 12"
              maxLength={80}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.validationErrors.gadgetName && (
              <p className="text-red-600 text-sm mt-1">{form.validationErrors.gadgetName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Brand & Model *
            </label>
            <input
              type="text"
              name="brandModel"
              value={form.brandModel}
              onChange={handleChange}
              placeholder="e.g., Apple iPhone 12 128GB"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.validationErrors.brandModel && (
              <p className="text-red-600 text-sm mt-1">{form.validationErrors.brandModel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Condition Summary *
            </label>
            <textarea
              name="conditionSummary"
              value={form.conditionSummary}
              onChange={handleChange}
              placeholder="e.g., Used, minor scratches, battery health 86%"
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {form.validationErrors.conditionSummary && (
              <p className="text-red-600 text-sm mt-1">{form.validationErrors.conditionSummary}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Price (PHP) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {form.validationErrors.price && (
              <p className="text-red-600 text-sm mt-1">{form.validationErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional details..."
              maxLength={240}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Proof Hash (Optional)
            </label>
            <input
              type="text"
              name="proofHash"
              value={form.proofHash}
              onChange={handleChange}
              placeholder="0x... (hash of proof documents)"
              maxLength={256}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-gray-500 text-xs mt-1">
              Optional: Hash of proof photos or receipt files
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              When you submit, your sale agreement will be hashed and stored on the blockchain.
              You will need to confirm the transaction with your wallet.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? "Creating..." : "Create Sale"}
          </button>
        </form>
      </main>
    </>
  );
}
