const db = require("../../data/index.js");
const { WorkItem } = db;

const deleteWorkItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    await WorkItem.destroy({
      where: { id }
    });

    res.json({ message: "Work item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteWorkItem
}; 