import pool from "../../utils/database.js";
import {getSetString} from "../../utils/databaseUtils.js";

class RoomsController {

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `rooms` ORDER BY number, building_number");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `rooms` WHERE id = ?", [id]);

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

            const roomData = req.body;
            if(roomData.number === undefined || roomData.number.toString().trim() === "")
                return res.status(400).json({error: "Room number is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("INSERT INTO `rooms` (number, building_number) VALUES (?, ?);", [roomData.number, roomData.building_number ? roomData.building_number : ""]);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `rooms` WHERE id = ?", [newItemId]);
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
            const roomData = req.body;
            const paramsArr = [];
            // if(roomData.number === undefined && roomData.building_number === undefined)
            //     return res.status(400).json({error: "Room data is incorrect"});
            if(roomData.number !== undefined && roomData.number.toString().trim() !== "")
                paramsArr.push(["number", roomData.number]);
            if(roomData.building_number !== undefined)
                paramsArr.push(["building_number", roomData.building_number]);


            if(!paramsArr.length)
                return res.status(400).json({error: "Room data is incorrect"});




            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            let setString = getSetString(paramsArr);
            const [result] = await connection.execute(`UPDATE \`rooms\` ${setString} WHERE id = ?`, [id]);
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
            const [result] = await connection.execute("DELETE FROM `rooms` WHERE id = ?", [id]);
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

export default new RoomsController();
