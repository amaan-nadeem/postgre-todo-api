import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
const Pool = require("pg").Pool;
const Joi = require("@hapi/joi");
const isProduction = process.env.NODE_ENV === 'production'
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL: connectionString,
  ssl: isProduction
});
const routes = express.Router();
// @routes POST
// @desc adding todo
// @access public
const ApiParamsSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    isCompleted: Joi.boolean()
  });

routes.post("/create-todo", async (req: Request, res: Response) => {
    const { isCompleted, title, description } = req.body;
    const { error } = ApiParamsSchema.validate({
      title,
      description,
      isCompleted
    });

    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0].message
      });
    }
    
    try {
      await pool.query("INSERT INTO todos (title, description, isCompleted) VALUES ($1, $2, $3)", [title, description, isCompleted]);
      return res.status(200).send({
        success: true,
        todo: {
            title,
            description,
            isCompleted
        }
      });
    } catch (error) {
     return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });



  const putApiParamsSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    isCompleted: Joi.boolean()
  });
  routes.put("/update-todo/:id", async (req: Request, res: Response) => {
    const {title, isCompleted, description} = req.body;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    let querystring = '';
    let idNum = '';
    for(let i = 0; i < keys.length; i++){
        if(i === keys.length-1){
        idNum = `ID = $${i+2}`
        querystring = `${querystring} ${keys[i]} = $${i+1}`;
        break;
        };
        querystring = `${querystring} ${keys[i]} = $${i+1},`;
    }
    try {
    const id = parseInt(req.params.id);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid todo Id"
        })
    }
    const _id = parseInt(req.params.id);
    const { error } = putApiParamsSchema.validate({
      title,
      description,
      isCompleted
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Nothing to given to be Updated"
      });
    }
    
    try {
        console.log(_id);
        console.log(idNum);
        console.log(values);
      // updating task
      console.log(querystring);
      const updateTodo = await pool.query(`UPDATE todos SET ${querystring} WHERE ${idNum}`, [...values, _id])
     return res.status(200).json({
        success: true,
        message: "Task has been updated",
      });
    } catch (error) {
     return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  });

routes.get('/get-todos', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query("SELECT * FROM todos ORDER BY id ASC"); 
        res.status(200).json({
            success: true,
            ...rows});
    } catch (error) {
        res.status(500).json({
            success: 'false',
            message: "Internal Server Error"
        })
    }
})

export default routes;