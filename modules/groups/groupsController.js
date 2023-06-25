import pool from "../../utils/database.js";

class GroupsController {

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `groups`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `groups` WHERE id = ?", [id]);

            if(result.length)
                res.status(200).json(result[0]);
            else
                res.status(404).json();

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async create(req, res){

        res.status(405).json();

    }

    async update(req, res){

        res.status(405).json();

    }

    async delete(req, res){

        res.status(405).json();

    }

}

export default new GroupsController();