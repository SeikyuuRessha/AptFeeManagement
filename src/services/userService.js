const db = require("../config/firebaseConfig.js");

const userService = {
  async createUser({ name, email, phone, role = "resident", apartmentId }) {
    if (!name || !email || !phone || !apartmentId) {
      throw new Error("Missing required fields: name, email, phone, apartmentId");
    }

    const newUser = {
      name,
      email,
      phone,
      role,
      apartmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userRef = await db.collection("users").add(newUser);
    return { id: userRef.id, ...newUser };
  },

  async getUserById(userId) {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) throw new Error(`User with ID ${userId} not found`);
    
    return { id: userDoc.id, ...userDoc.data() };
  },

  async updateUser(userId, { name, email, phone, role, apartmentId }) {
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(role && { role }),
      ...(apartmentId && { apartmentId }),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userId).update(updateData);
    return { id: userId, ...updateData };
  },

  async deleteUser(userId) {
    await db.collection("users").doc(userId).delete();
    return { message: `User with ID ${userId} deleted successfully` };
  },

  async getAllUsers() {
    const usersSnapshot = await db.collection("users").get();
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

module.exports = userService;
