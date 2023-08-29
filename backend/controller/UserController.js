const { User } = require("../model/UserModal");

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  // console.log("Id of User", id);
  try {
    const user = await User.findById(id);
    // console.log("User Found", user);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};
