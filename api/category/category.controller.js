import multer from "multer";
import moment from "moment";
import { Category } from "./category.model";

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

export const getCategories = async (req, res) => {
  const {pageSize, page} = req.query
  try {
    let data = []
    if (pageSize && page) {
      data = await Category.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            updatedAt: 1,
            createdAt: 1
          }
        },
        {
          $facet: {
            metadata: [{ $count: "total" }, { $addFields: { pages: { $ceil: { $divide: ["$total", parseInt(pageSize)] } } } }],
            data: [{ $sort: {updatedAt: -1} }, { $skip: page > 0 ? ( pageSize*page) : 0  }, { $limit: parseInt(pageSize) }]
          }
        }
      ])
    } else {
      data = await Category.find({})
    }
    res.status(200).send(data)
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create categories!"})
  }
}

export const postCategory = async (req, res) => {
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

export const putCategory = async (req, res) => {
  const { _id } = req.body
  try {
    if( !_id ){
      return res.status(402).send({done: false, error: "please pass object id" })
    }

    const create = await Category.update({_id}, {...req.body});

    res.status(200).send({done: true, data: create })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create recipes!"})
  }
}

export const deleteCategory = async (req, res) => {
  const { _id } = req.params
  try {
    if( !_id ){
      return res.status(402).send({done: false, error: "please pass object id" })
    }

    await Category.remove({_id});

    res.status(200).send({done: true, message: "category removed successfully!" })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in remove category!"})
  }
}
