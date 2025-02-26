const db = require("../config/firebaseConfig.js");

const feeService = {
  async createFee({ name, description = "", amount, frequency }) {
    if (!name || !amount || !frequency) {
      throw new Error("Missing required fields: name, amount, frequency");
    }

    if (!["monthly", "quarterly", "yearly"].includes(frequency)) {
      throw new Error("Invalid frequency. Allowed values: monthly, quarterly, yearly");
    }

    const newFee = {
      name,
      description,
      amount: parseFloat(amount),
      frequency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const feeRef = await db.collection("fees").add(newFee);
    return { id: feeRef.id, ...newFee };
  },

  async getFeeById(feeId) {
    const feeDoc = await db.collection("fees").doc(feeId).get();
    if (!feeDoc.exists) throw new Error(`Fee with ID ${feeId} not found`);

    return { id: feeDoc.id, ...feeDoc.data() };
  },

  async updateFee(feeId, { name, description, amount, frequency }) {
    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(frequency && { frequency }),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("fees").doc(feeId).update(updateData);
    return { id: feeId, ...updateData };
  },

  async deleteFee(feeId) {
    await db.collection("fees").doc(feeId).delete();
    return { message: `Fee with ID ${feeId} deleted successfully` };
  },

  async getAllFees() {
    const feesSnapshot = await db.collection("fees").get();
    return feesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

module.exports = feeService;
