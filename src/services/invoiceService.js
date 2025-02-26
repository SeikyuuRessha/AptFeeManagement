const db = require("../firebaseConfig");

const invoiceService = {
  async createInvoice({ userId, amount, dueDate, status = "pending", description = "" }) {
    if (!userId || !amount || !dueDate) {
      throw new Error("Missing required fields: userId, amount, dueDate");
    }

    const newInvoice = {
      userId,
      amount: parseFloat(amount),
      dueDate,
      status, // pending | paid | overdue
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const invoiceRef = await db.collection("invoices").add(newInvoice);
    return { id: invoiceRef.id, ...newInvoice };
  },

  async getInvoiceById(invoiceId) {
    const invoiceDoc = await db.collection("invoices").doc(invoiceId).get();
    if (!invoiceDoc.exists) throw new Error(`Invoice with ID ${invoiceId} not found`);
    
    return { id: invoiceDoc.id, ...invoiceDoc.data() };
  },

  async updateInvoice(invoiceId, { amount, dueDate, status, description }) {
    const updateData = {
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(dueDate && { dueDate }),
      ...(status && { status }),
      ...(description !== undefined && { description }),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("invoices").doc(invoiceId).update(updateData);
    return { id: invoiceId, ...updateData };
  },

  async deleteInvoice(invoiceId) {
    await db.collection("invoices").doc(invoiceId).delete();
    return { message: `Invoice with ID ${invoiceId} deleted successfully` };
  },

  async getAllInvoices() {
    const invoicesSnapshot = await db.collection("invoices").get();
    return invoicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

module.exports = invoiceService;
