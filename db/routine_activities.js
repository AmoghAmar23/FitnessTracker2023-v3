const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {rows:[routineActivity] } = await client.query(
    `INSERT INTO routineactivities ("routineId", "activityId", count, duration) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;`, [routineId, activityId, count, duration]
  )
  return routineActivity;
}

async function getRoutineActivityById(id) {
  const {rows:[routineActivity]} = await client.query(
    `SELECT * FROM routineactivities 
    WHERE id = ${id};`
  )
    return routineActivity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const {rows} = await client.query(
    `SELECT * FROM routineactivities 
    WHERE "routineId" = ${id};`
  )
    return rows;
}

async function updateRoutineActivity({ id, count, duration }) {
  const routineActivity = await client.query(
    `UPDATE routineactivities 
    SET count='${count}', duration= '${duration}'
    WHERE id = ${id};`
  )
  return routineActivity;
}

async function destroyRoutineActivity(id) {
  const result = await client.query(
    `DELETE from routineactivities
    WHERE id = ${id};`
  )
  return result;
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
