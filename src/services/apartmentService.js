const db = require("../config/firebaseConfig.js");

const apartmentService = {
  async createApartment({ buildingName, unitNumber, floor, ownerId, status = "occupied" }) {
    if (!buildingName || !unitNumber || !floor) {
      throw new Error("Missing required fields: buildingName, unitNumber, floor");
    }

    const newApartment = {
      buildingName,
      unitNumber,
      floor,
      ownerId: ownerId || null,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const aptRef = await db.collection("apartments").add(newApartment);
    return { id: aptRef.id, ...newApartment };
  },

  async getApartmentById(apartmentId) {
    const aptDoc = await db.collection("apartments").doc(apartmentId).get();
    if (!aptDoc.exists) throw new Error(`Apartment with ID ${apartmentId} not found`);

    return { id: aptDoc.id, ...aptDoc.data() };
  },

  async updateApartment(apartmentId, { buildingName, unitNumber, floor, ownerId, status }) {
    const updateData = {
      ...(buildingName && { buildingName }),
      ...(unitNumber && { unitNumber }),
      ...(floor && { floor }),
      ...(ownerId !== undefined && { ownerId }), // Allow null values
      ...(status && { status }),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("apartments").doc(apartmentId).update(updateData);
    return { id: apartmentId, ...updateData };
  },

  async deleteApartment(apartmentId) {
    await db.collection("apartments").doc(apartmentId).delete();
    return { message: `Apartment with ID ${apartmentId} deleted successfully` };
  },

  async getAllApartments() {
    const aptsSnapshot = await db.collection("apartments").get();
    return aptsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

module.exports = apartmentService;
