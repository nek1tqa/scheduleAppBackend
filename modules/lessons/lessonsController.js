import pool from "../../utils/database.js";

class LessonsController{

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `lessons`");
            res.json(result);

        }catch(e){
            res.status(500).json(e);
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `lessons` WHERE id = ?", [id]);
            res.json(result);

        }catch(e){
            res.status(500).json(e);
        }

    }

    async create(req, res){

        try{

            const lessonData = req.body;
            if(lessonData.title === undefined || lessonData.title.toString().trim() === "")
                return res.status(400).json({error: "Lesson title is incorrect"});

            const connection = await pool.getConnection();
            await pool.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("INSERT INTO `lessons` (title) VALUES (?)", [lessonData.title]);
            connection.commit();
            connection.release();

            res.status(200).json();

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json(e);
        }

    }

    async update(req, res){

        try{

            const {id} = req.params;
            const lessonData = req.body;
            if(lessonData.title === undefined || lessonData.title.toString().trim() === "")
                return res.status(400).json({error: "Lesson title is incorrect"});

            const connection = await pool.getConnection();
            await pool.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("UPDATE `lessons` SET title = ? WHERE id = ?", [lessonData.title, id]);
            connection.commit();
            connection.release();

            res.status(200).json();

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json(e);
        }

    }

    async delete(req, res){

        try{

            const {id} = req.params;

            await pool.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result, r] = await connection.execute("DELETE `lessons` WHERE id = ?", [id]);
            connection.commit();
            connection.release();

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