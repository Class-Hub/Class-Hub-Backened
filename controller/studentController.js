const bcrypt = require("bcrypt");

exports.profile = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};

exports.passwordUpdate = async (req, res) => {
  const user = req.user;
  const saltRounds = 10;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    console.log(match);

    if (match) {
      const hash = bcrypt.hashSync(newPassword, saltRounds);
      user.password = hash;
      await user.save();
      res.json({
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};
