const Teacher = require('../models/Teacher')
const Subject = require('../models/Subject')

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

exports.getAll = async(req,res) => {
  try{
    let t = await Teacher.find({},{name:1});
    let s = await Subject.find({},{subName:1});

    let subjects=[],teachers=[];

    for(let i=0;i<s.length;i++){
      subjects.push(s[i].subName);
    }
    for(let i=0;i<t.length;i++){
      teachers.push(t[i].name);
    }

    console.log(teachers);

    let classes = ['CSE','IT']
    return res.status(200).json({
      teachers,
      subjects,
      classes
    })
  }catch(err){
    res.status(err)
  }
}
