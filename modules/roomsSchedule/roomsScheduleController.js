import pool from "../../utils/database.js";

class RoomsScheduleController {

    async getAllPages(req, res){

        try{

            const [result] = await pool.execute("SELECT * FROM `rooms_schedule`");
            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getPage(req, res){

        const {id} = req.params;
        try{

            let result;
            const [pageResult] = await pool.execute("SELECT * FROM `rooms_schedule` WHERE id = ?", [id]);
            result = pageResult[0];
            result.rooms = JSON.parse(result.rooms);

            const [roomsScheduleResult] = await pool.execute("SELECT * FROM `rooms_schedule_pages__rooms` AS rsp_r JOIN \n" +
                "`schedule__rooms` AS s_r ON rsp_r.room_id = s_r.room_id LEFT JOIN\n" +
                "`schedule` AS s ON s.id = s_r.schedule_item_id LEFT JOIN\n" +
                "`schedule__week_range` AS s_wr ON s.id = s_wr.schedule_item_id LEFT JOIN\n" +
                "`groups` AS g ON s.group_id = g.id WHERE rooms_schedule_page_id = ?", [id]);
            result.rooms_schedule = roomsScheduleResult;


            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async createPage(req, res){

        let connection = null;
        const groupNames = [];
        try{

            const pageData = req.body;


            if(pageData.name === undefined || pageData.name.toString().trim() === "")
                return res.status(400).json({error: "Page data name is incorrect"});
            if(pageData.rooms === undefined || pageData.rooms.length === 0)
                return res.status(400).json({error: "Page rooms.length is 0"});



            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();


            const [pageResult] = await connection.execute("INSERT INTO `rooms_schedule_pages` (name) VALUES (?);", [pageData.name]);
            const newItemId = pageResult.insertId;



            for(let roomId of pageData.rooms) {

                const [roomResult] = await connection.execute("INSERT INTO `rooms_schedule_pages__rooms` (rooms_schedule_page_id, room_id) VALUES (?, ?);", [newItemId, roomId]);

            }


            connection.commit();

            const [newItemResult] = await connection.execute("SELECT * FROM `rooms_schedule_pages` WHERE id = ?", [newItemId]);

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

        const groupIdsForUpdate = [];
        const groupIdsForInsert = [];



        const groupNames = [];
        try{

            const {id} = req.params;
            const pageData = req.body;


            const [pageResult] = await pool.execute("SELECT * FROM `pages` WHERE id = ?", [id]);
            const groupIds = JSON.parse(pageResult[0].group_ids);




            if(!pageData.length)
                return res.status(400).json({error: "Page data is incorrect"});

            for(let group of pageData) {

                if (group.name === undefined || group.name.toString().trim() === "")
                    return res.status(400).json({error: "Group name is incorrect"});
                if (group.subgroups_count === undefined || group.subgroups_count < 1)
                    return res.status(400).json({error: `Subgroups count in group "${group.name}" is incorrect`});
                // todo: faculties_id -> faculty_id
                if (group.faculties_id === undefined)
                    return res.status(400).json({error: "Faculty id in group is undefined"});

                if ("id" in group)
                    groupIdsForUpdate.push(group.id);
                else
                    groupIdsForInsert.push(group.id);

                // todo: faculties_id -> faculty_id
                const [groupResult] = await pool.execute("SELECT * FROM `groups` WHERE LOWER(name) = LOWER(?) AND faculties_id != ?", [group.name, group.faculties_id]);
                if (groupResult.length || groupNames.includes(group.name.toLowerCase()))
                    return res.status(400).json({error: `Group ${group.name} is exist`});
                else
                    groupNames.push(group.name.toLowerCase());

            }





            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();




            const groupIdsForDelete = groupIds.filter(id => !groupIdsForUpdate.includes(id));
            if(groupIdsForDelete.length){

                const idsStr = groupIdsForDelete.join(", ");
                const query = `DELETE FROM \`groups\` WHERE id IN (${idsStr})`;
                await connection.query(query);

            }

            // Вроде это лишнее, т.к. я в начале проверяю, чтобы приходила хоть одна группа. Значит что-то либо обновится, либо создатся
            // if(groupIdsForDelete.length === groupIds.length && groupIdsForInsert.length === 0)
            //     connection.execute("DELETE FROM `pages` WHERE id = ,", [id])


            const newGroupIds = [];


            for(let group of pageData) {

                if("id" in group){

                //     UPDATE

                    const [groupResult] = await connection.execute("SELECT subgroups_count FROM `groups` WHERE id = ?", [id]);
                    const oldSubgroupsCount = groupResult[0].subgroups_count;

                    if(oldSubgroupsCount > group.subgroups_count){
                        const deletedSubgroup = Array(oldSubgroupsCount - group.subgroups_count).fill(0).map((elem, index) => index + 1);
                        const deletedSubgroupStr = deletedSubgroup.join("|");
                        const query = "DELETE FROM `schedule` WHERE group_id = ? AND subgroups REGEXP ?";
                        await connection.execute(query, [group.id, deletedSubgroupStr]);

                        // DELETE lessons from schedule, where was used deleted subgroups
                    }

                    const query = "UPDATE `groups` SET name = ?, subgroups_count = ? WHERE id = ?";
                    await connection.execute(query, [group.name, group.subgroups_count, group.id]);

                    newGroupIds.push(group.id);


                }else{

                //     INSERT
                    const groupQuery = "INSERT INTO `groups` (name, subgroups_count, faculties_id, semestr_id, type, width) VALUES (?, ?, ?, 1, 0, 80);"
                    const [groupResult] = await connection.execute(groupQuery, [group.name, group.subgroups_count, group.faculties_id]);
                    const groupId = groupResult.insertId;
                    newGroupIds.push(groupId);

                }

            }

            const newGroupIdsStr = JSON.stringify(newGroupIds);
            const pageQuery = "UPDATE `pages` SET group_ids = ? WHERE id = ?";
            const [pageUpdateResult] = await connection.execute(pageQuery, [newGroupIdsStr, id]);
            connection.commit();
            connection.release();

            if(pageUpdateResult.affectedRows)
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

    async deletePage(req, res){

        let connection = null;
        try{

            const {id} = req.params;

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [pageDelResult] = await connection.execute("DELETE FROM `rooms_schedule_pages` WHERE id = ?", [id]);

            connection.commit();
            connection.release();

            if(pageDelResult.affectedRows)
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

export default new RoomsScheduleController();
