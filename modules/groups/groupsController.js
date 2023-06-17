import pool from "../../utils/database.js";
import {getSetString} from "../../utils/databaseUtils.js";

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

        let connection = null;
        try{

            const roomData = req.body;
            if(roomData.name === undefined || roomData.name.trim() === "")
                return res.status(400).json({error: "Room number is incorrect"});
            if(roomData.subgroups_count === undefined || roomData.subgroups_count <= 0)
                return res.status(400).json({error: "Room number is incorrect"});

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("INSERT INTO `groups` (name, subgroups_count) VALUES (?, ?);", [roomData.name, roomData.subgroups_count]);
            connection.commit();

            const newItemId = result.insertId;
            const [newItemResult] = await connection.execute("SELECT * FROM `groups` WHERE id = ?", [newItemId]);
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

        res.status(405).json();

    }

    async delete(req, res){

        res.status(405).json();

    }

}

export default new GroupsController();