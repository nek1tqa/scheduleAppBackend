import pool from "../../utils/database.js";

class LessonsController{

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `lessons`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `lessons` WHERE id = ?", [id]);

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

            const lessonData = req.body;
            if(lessonData.title === undefined || lessonData.title.toString().trim() === "")
                return res.status(400).json({error: "Lesson title is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("INSERT INTO `lessons` (title) VALUES (?);", [lessonData.title]);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `lessons` WHERE id = ?", [newItemId]);
            connection.release();

            res.status(201).json(newItemResult);

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
            const lessonData = req.body;
            if(lessonData.title === undefined || lessonData.title.toString().trim() === "")
                return res.status(400).json({error: "Lesson title is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("UPDATE `lessons` SET title = ? WHERE id = ?", [lessonData.title, id]);
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
            const [result] = await connection.execute("DELETE FROM `lessons` WHERE id = ?", [id]);
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