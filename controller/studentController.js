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
