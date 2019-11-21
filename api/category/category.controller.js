import { generateControllers } from "../../modules/query";
import { Category } from "./category.model";
import multer from "multer";
import moment from "moment";


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/categories");
  },
  filename: function(req, file, cb) {
    cb(null, moment().valueOf() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const mimeType = ["image/jpeg", "image/png", "audio/mpeg"]
  if (mimeType.indexOf(file.mimetype) > -1) {
    cb(null, true);
  } else {
    cb(new Error("invalid file"), false);
  }
};

export const imageUpload = multer({
  storage,
  limits: { fileSize: 3072 * 3072 * 5 },
  fileFilter: fileFilter
});

export const createCategory = async (req, res) => {
  try {
    const data = req.body

    data.image = req.file.path;
    console.log({data, file: req.file.path})
    const create = await Category.create(data);

    res.status(200).send({done: true, data: create })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create categories!"})
  }
}
