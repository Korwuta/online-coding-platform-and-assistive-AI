const {Pool} = require('pg')
const crypt = require('crypto')
const pool = new Pool({
    user:process.env['DATABASE_USERNAME'],
    host:process.env['DATABASE_HOST'],
    database:'master',
    password:process.env['DATABASE_PASSWORD'],
    max: 20,
    port:process.env['DATABASE_PORT'],
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

async function createUserLocal({id,firstName,lastName,username,email,password,createdAt,displayName,salt}){
    const res = await pool.
    query(
        'INSERT INTO "Users"(id,first_name,last_name,username,email,password_hash,created_at,display_name,salt) VALUES($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8) RETURNING *',
        [id,firstName,lastName,username,email,password,displayName,salt])
    return res.rows[0]
}
async function createUserNonLocal({issuer,subject,displayName}){
    let id = crypt.randomUUID()
    const userInserted = await pool.
        query('INSERT INTO "Users"(id,display_name,created_at) VALUES($1,$2,CURRENT_TIMESTAMP)',
        [id,displayName])
    if(userInserted){
        const res = await pool.
        query(
            'INSERT INTO "FederatedAuth"(user_id,issuer,subject) VALUES($1,$2,$3) RETURNING *',
            [id,issuer,subject])
        return res.rows[0]
    }

}
async function findAuthentication({subject,issuer}){
    const res = await pool.
    query(
        'SELECT user_id FROM "FederatedAuth" WHERE subject = $1 AND issuer=$2',
        [subject,issuer])
    return res.rows[0]
}
async function getUserById(id){
    const res = await pool.
    query(
        'SELECT id,display_name FROM "Users" WHERE id=$1',
        [id])
    return res.rows[0]
}
async function getUserWithUsername(username){
    const res = await pool.
    query(
        'SELECT id,display_name,salt,email,password_hash FROM "Users" WHERE username=$1',
        [username])
    return res.rows[0]
}
async function updatePassword(username,password_hash,salt){
    const res = await pool.
    query(
        `UPDATE "Users" 
        SET password_hash=$1,salt=$2,last_changed_password=(SELECT password_hash FROM "Users" WHERE username=$3),
        last_salt=(SELECT salt FROM "Users" WHERE username=$3) 
        WHERE username=$3`,
        [password_hash,salt,username])
    return res.rows[0]
}
async function getTopic(language){
    const res = await pool.
    query(
        `SELECT name,index FROM "Topic" WHERE language = $1 ORDER BY index`,
        [language])
    return res.rows
}
async function getTutorial(language,index){
    const res = await pool.
    query(
        `SELECT topic,passage,question FROM "Tutorial" WHERE language = $1 AND index = $2`,
        [language,index])
    return res.rows[0]
}
async function getQuestion(language){
    const res = await pool.
    query(
        `SELECT * FROM "Question" WHERE language = $1 ORDER BY RANDOM() LIMIT 5`,
        [language])
    return res.rows
}
module.exports = {
    createUserLocal,
    createUserNonLocal,
    findAuthentication,
    getUserById,
    getUserWithUsername,
    updatePassword,
    getTopic,
    getTutorial,
    getQuestion
}