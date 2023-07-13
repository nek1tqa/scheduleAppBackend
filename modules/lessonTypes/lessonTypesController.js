import pool from "../../utils/database.js";

class LessonsController{

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `lesson_types`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `lesson_types` WHERE id = ?", [id]);

            if(result.length)
                res.status(200).json(result[0]);
            else
                res.status(404).json();

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async create(req, res){

        let connection = null;
        try{

            const lessonTypeData = req.body;
            if(lessonTypeData.value === undefined || lessonTypeData.value.toString().trim() === "")
                return res.status(400).json({error: "Lesson type value is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("INSERT INTO `lesson_types` (value) VALUES (?);", [lessonTypeData.value]);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `lesson_types` WHERE id = ?", [newItemId]);
            connection.release();

            res.status(200).json(newItemResult[0]);

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json({error: e.toString()});
        }

    }

    async update(req, res){

        let connection = null;
        try{

            const {id} = req.params;
            const lessonTypeData = req.body;
            if(lessonTypeData.value === undefined || lessonTypeData.value.toString().trim() === "")
                return res.status(400).json({error: "Lesson type value is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("UPDATE `lesson_types` SET value = ? WHERE id = ?", [lessonTypeData.value, id]);
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
            res.status(500).json({error: e.toString()});
        }

    }

    async delete(req, res){

        let connection = null;
        try{

            const {id} = req.params;

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("DELETE FROM `lesson_types` WHERE id = ?", [id]);
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
            res.status(500).json({error: e.toString()});
        }
    }

}

export default new LessonsController();
