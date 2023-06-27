const client = require("./client");
const {getUserByUsername}= require("./users")

async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("=================================", creatorId, isPublic, name, goal)
  const {rows:[newRoutine]} = await client.query (
    `INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES (${creatorId},${isPublic},'${name}','${goal}')
    RETURNING *; `
    )
    return newRoutine;
}

async function getRoutineById(id) {
  const {rows:[routine]} = await client.query (
    `SELECT * FROM routines
    WHERE id = ${id}`
  )
  return routine;
}

async function getRoutinesWithoutActivities(){
const { rows } = await client.query ( 
`SELECT * FROM routines;`
)
// console.log(rows);
return rows;
} 

//join the activity
async function getAllRoutines() {
  const { rows } = await client.query ( 
    `SELECT r.id,r.name,r.goal,r["isPublic"],r["creatorId"],a.name,a.description, ra.count, ra.duration
    FROM routines r 
    JOIN routineactivities ra 
    ON r.id = ra["routineId"]
    JOIN activities a
    ON ra["activityId"] = a.id];`
    )
    console.log(rows);
    return rows;
}

async function getAllPublicRoutines() {
  const { rows } = await client.query ( 
  `SELECT r.id,r.name,r.goal,r["isPublic"],r["creatorId"],a.name,a.description, ra.count, ra.duration
  FROM routines r 
  JOIN routineactivities ra 
  ON r.id = ra["routineId"]
  JOIN activities a
  ON ra["activityId"] = a.id;
  WHERE r["isPublic"]= true;`
  )
  console.log(rows);
  return rows;
}

async function getAllRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);
  const { rows } = await client.query ( 
    `SELECT r.id,r.name,r.goal,r["isPublic"],r["creatorId"],a.name,a.description, ra.count, ra.duration
    FROM routines r 
    JOIN routineactivities ra 
    ON r.id = ra["routineId"]
    JOIN activities a
    ON ra["activityId"] = a.id
    WHERE r["creatorId"]= ${user.id};`
    )
    console.log(rows);
    return rows;
}

async function getPublicRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);
  const { rows } = await client.query ( 
    `SELECT r.id,r.name,r.goal,r["isPublic"],r["creatorId"],a.name,a.description, ra.count, ra.duration
    FROM routines r 
    JOIN routineactivities ra 
    ON r.id = ra["routineId"]
    JOIN activities a
    ON ra["activityId"] = a.id
    WHERE r["creatorId"]= ${user.id}
    AND r["isPublic"] = true;`
    )
    console.log(rows);
    return rows;
}

async function getPublicRoutinesByActivity({ id }) {
  const { rows } = await client.query ( 
    `SELECT r.id,r.name,r.goal,r["isPublic"],r["creatorId"],a.name,a.description, ra.count, ra.duration
    FROM routines r 
    JOIN routineactivities ra 
    ON r.id = ra["routineId"]
    JOIN activities a
    ON ra["activityId"] = a.id
    WHERE a.id= ${id}
    AND r["isPublic"] = true;`
    )
    console.log(rows);
    return rows;
}

async function updateRoutine({ id, isPublic, name, goal }) {
  const routine = await client.query(
    `UPDATE routines 
    SET name='${name}', goal= '${goal}', "isPublic"=${isPublic}
    WHERE id = ${id};`
  )
  return routine;
}

async function destroyRoutine(id) {
  const result = await client.query(
    `DELETE from routines
    WHERE id = ${id};`
  )
  const result2 = await client.query(
    `DELETE from routineactivities
    WHERE "routineId" = ${id};`
  )
  return result;
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
