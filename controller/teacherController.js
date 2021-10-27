exports.profile = (req, res) => {
  try {
    console.log("INside route");
    const user = req.user;
    if (!user) {
      return res.status(404).send("Teacher Not Found");
    }

    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};
