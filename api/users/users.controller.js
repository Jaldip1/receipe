import { Users } from "./users.model"

export const createUser = async (req, res) => {
  try {

    const create = await Users.create(req.body);

    res.status(200).send({done: true, data: create })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create user!"})
  }
}


export const onLogin = async (req, res) => {
  const { email, password } = req.body
  console.log({email, password})
  try {

    if(!email || !password){
      return res.status(402).send({done: false, error: "please pass email or password" })
    }

    const user = await Users.find({email, password})

    if(!(user && user.length)){
      return res.status(402).send({done: false, error: "invalid email or password!" })
    }
    res.status(200).send({done: true, data: user[0] })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create user!"})
  }
}

export const putUser = async (req, res) => {
  const { _id } = req.body
  try {
    if( !_id ){
      return res.status(402).send({done: false, error: "please pass object id" })
    }

    const create = await Users.update({_id}, {...req.body});

    res.status(200).send({done: true, message: "user update successfully!" })
  } catch (err) {
    console.log(err)
    res.status(422).send({done: false, error: "Error in create recipes!"})
  }
}
