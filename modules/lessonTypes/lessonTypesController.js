import pool from "../../utils/database.js";

class LessonsController{

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `lessonTypes`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json(e);
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `lessonTypes` WHERE id = ?", [id]);

            if(result.length)
                res.status(200).json(result[0]);
            else
                res.status(404).json();

        }catch(e){
            res.status(500).json(e);
        }

    }

    async create(req, res){

        let connection = null;
        try{

            const lessonData = req.body;
            if(lessonData.value === undefined || lessonData.value.toString().trim() === "")
                return res.status(400).json({error: "Lesson type value is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("INSERT INTO `lessonTypes` (value) VALUES (?);", [lessonData.value]);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `lessonTypes` WHERE id = ?", [newItemId]);
            connection.release();

            res.status(200).json(newItemResult);

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json(e);
        }

    }

    async update(req, res){

        let connection = null;
        try{

            const {id} = req.params;
            const lessonData = req.body;
            if(lessonData.value === undefined || lessonData.value.toString().trim() === "")
                return res.status(400).json({error: "Lesson type value is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("UPDATE `lessonTypes` SET value = ? WHERE id = ?", [lessonData.value, id]);
            connection.commit();
            connection.release();

            if(result.affectedRows)
                res.status(200).json();
            else
                res.status(404).json();

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json(e);
        }

    }

    async delete(req, res){

        let connection = null;
        try{

            const {id} = req.params;

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("DELETE FROM `lessonTypes` WHERE id = ?", [id]);
            connection.commit();
            connection.release();

            if(result.affectedRows)
                res.status(200).json();
            else
                res.status(404).json();

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json(e);
        }
    }

}

export default new LessonsController();