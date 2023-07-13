import pool from "../../utils/database.js";
import {getSetString} from "../../utils/databaseUtils.js";

class TeachersController {

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT  * FROM `teachers_with_departments`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT  * FROM `teachers_with_departments` WHERE id = ?", [id]);

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

            const teacherData = req.body;
            if(teacherData.name === undefined || teacherData.name.trim() === "")
                return res.status(400).json({error: "Teacher name is incorrect"});
            if(teacherData.surname === undefined || teacherData.surname.trim() === "")
                return res.status(400).json({error: "Teacher surname is incorrect"});
            if(teacherData.patronymic === undefined)
                return res.status(400).json({error: "Teacher patronymic is incorrect"});
            if(teacherData.post === undefined)
                return res.status(400).json({error: "Teacher post is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();

            const queryData = [
                teacherData.name,
                teacherData.surname,
                teacherData.patronymic,
                teacherData.post,
                teacherData.faculty_department_id ? teacherData.faculty_department_id : null
            ];
            const [result] = await connection.execute("INSERT INTO `teachers` (name, surname, patronymic, post, faculty_department_id) VALUES (?, ?, ?, ?, ?);", queryData);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `teachers_with_departments` WHERE id = ?", [newItemId]);
            connection.release();

            res.status(201).json(newItemResult[0]);

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
            const paramsArr = [];

            const teacherData = req.body;
            if(teacherData.name !== undefined && teacherData.name.trim() !== "")
                paramsArr.push(["name", teacherData.name]);
            if(teacherData.surname !== undefined && teacherData.surname.trim() !== "")
                paramsArr.push(["surname", teacherData.surname]);
            if(teacherData.patronymic !== undefined)
                paramsArr.push(["patronymic", teacherData.patronymic]);
            if(teacherData.post !== undefined)
                paramsArr.push(["post", teacherData.post]);
            if(teacherData.faculty_department_id !== undefined)
                paramsArr.push(["faculty_department_id", teacherData.faculty_department_id]);


            if(!paramsArr.length)
                return res.status(400).json({error: "Teacher data is incorrect"});



            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            let setString = getSetString(paramsArr);
            const [result] = await connection.execute(`UPDATE \`teachers\` ${setString} WHERE id = ?`, [id]);
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
            const [result] = await connection.execute("UPDATE `teachers` SET status = 0 WHERE id = ?", [id]);
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

export default new TeachersController();
