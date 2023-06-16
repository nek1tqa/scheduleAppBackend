import pool from "../../utils/database.js";

class FacultiesController{

    async getAll(req, res){

        try{

            const [result] = await pool.query("SELECT * FROM `faculties_with_departments`");
            for(let facultyData of result)
                facultyData.departments = JSON.parse(facultyData.departments);

            res.status(200).json(result);

        }catch(e){
            res.status(500).json(e);
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `faculties_with_departments` WHERE id = ?", [id]);

            if(result.length){

                result[0].departments = JSON.parse(result[0].departments);
                res.status(200).json(result[0]);

            }else
                res.status(404).json();

        }catch(e){
            res.status(500).json(e);
        }

    }

    async create(req, res){

        let connection = null;
        try{

            const facultyData = req.body;
            if(facultyData.name === undefined || facultyData.name.toString().trim() === "")
                return res.status(400).json({error: "Faculty name is incorrect"});
            if(facultyData.dean === undefined || facultyData.dean.toString().trim() === "")
                return res.status(400).json({error: "Faculty dean is incorrect"});
            if(facultyData.departments === undefined)
                return res.status(400).json({error: "Faculty departments is undefined"});

            try{
                facultyData.departments = JSON.parse(facultyData.departments);
            }catch(e){
                throw new Error("Can`t parse faculty departments. Format isn`t JSON");
            }

            for(let department of facultyData.departments)
                if(department.name === undefined || department.name.toString().trim() === "")
                    return res.status(400).json({error: "Faculty department name is incorrect"});


            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("INSERT INTO `faculties` (name, dean) VALUES (?, ?);", [facultyData.name, facultyData.dean]);

            const newItemId = result.insertId;
            const departmentsData = Array.from(facultyData.departments.map(department => [newItemId, department.name]));
            if(departmentsData.length)
                for(let departmentData of departmentsData)
                    await connection.execute("INSERT INTO `faculty_departments` (faculty_id, name) VALUES (?, ?)", departmentData);

            connection.commit();

            const [newItemResult] = await connection.execute("SELECT * FROM `faculties_with_departments` WHERE id = ?", [newItemId]);
            newItemResult[0].departments = JSON.parse(newItemResult[0].departments);

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

            const updateArr = [];
            const insertArr = [];

            const facultyData = req.body;
            if(facultyData.name === undefined || facultyData.name.toString().trim() === "")
                return res.status(400).json({error: "Faculty name is incorrect"});
            if(facultyData.dean === undefined || facultyData.dean.toString().trim() === "")
                return res.status(400).json({error: "Faculty dean is incorrect"});
            if(facultyData.departments === undefined)
                return res.status(400).json({error: "Faculty departments is undefined"});




            try{
                facultyData.departments = JSON.parse(facultyData.departments);
            }catch(e){
                throw new Error("Can`t parse faculty departments. Format isn`t JSON");
            }

            for(let department of facultyData.departments){

                if(department.name === undefined)
                    return res.status(400).json({error: "Faculty department name is undefined"});

                if(department.id !== undefined)
                    updateArr.push(department);
                else
                    insertArr.push(department);

            }


            connection = await pool.getConnection();
            const [facultyDepartmentsData] = await connection.execute("SELECT * FROM `faculty_departments` WHERE faculty_id = ?", [id]);
            const departmentsIdsForDelete = Array.from(facultyDepartmentsData.map(dep => dep.id));
            updateArr.forEach(department => departmentsIdsForDelete.splice(departmentsIdsForDelete.indexOf(department.id), 1));


            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();



            if(departmentsIdsForDelete.length){

                const idsString = departmentsIdsForDelete.join(",");
                connection.query(`DELETE FROM \`faculty_departments\` WHERE id IN (${idsString})`);

            }

            updateArr.forEach(async department =>
                await connection.execute("UPDATE `faculty_departments` SET name = ? WHERE id = ?", [department.name, department.id])
            );


            insertArr.forEach(async department =>
                await connection.execute("INSERT INTO `faculty_departments` (name, faculty_id) VALUES (?, ?)", [department.name, id])
            );


            await connection.execute("UPDATE `faculties` SET name = ?, dean = ? WHERE id = ?", [facultyData.name, facultyData.dean, id]);


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

        let connection = null;
        try{

            const {id} = req.params;

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [result] = await connection.execute("DELETE FROM `faculties` WHERE id = ?", [id]);
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

export default new FacultiesController();