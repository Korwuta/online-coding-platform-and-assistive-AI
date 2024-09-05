const {Pool} = require('pg')
const crypt = require('crypto')
const pool = new Pool({
    user:process.env['DATABASE_USERNAME'],
    host:process.env['DATABASE_HOST'],
    database:process.env['DATABASE_NAME'],
    password:process.env['DATABASE_PASSWORD'],
    max: 20,
    port:process.env['DATABASE_PORT'],
    idleTimeoutMillis: 40000,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false, // You might need to disable SSL verification (only for testing, not recommended in production).
    },
})

async function createUserLocal({id,firstName,lastName,username,email,password,createdAt,displayName,salt,profileImage}){
    try{
        const res = await pool.
        query(
            'INSERT INTO "Users"(id,first_name,last_name,username,email,password_hash,created_at,display_name,salt,profile_image) VALUES($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP,$7,$8,$9) RETURNING *',
            [id,firstName,lastName,username,email,password,displayName,salt,profileImage])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function createUserNonLocal({issuer,subject,displayName,profileImage}){
    try{
        let id = crypt.randomUUID()
        const userInserted = await pool.
        query('INSERT INTO "Users"(id,display_name,created_at,profile_image) VALUES($1,$2,CURRENT_TIMESTAMP,$3)',
            [id,displayName,profileImage])
        if(userInserted){
            const res = await pool.
            query(
                'INSERT INTO "FederatedAuth"(user_id,issuer,subject) VALUES($1,$2,$3) RETURNING *',
                [id,issuer,subject])
            return res.rows[0]
        }
    }catch(e){
        console.log(e)
    }

}

async function findAuthentication({subject,issuer}){
    try{
        const res = await pool.
        query(
            'SELECT user_id FROM "FederatedAuth" WHERE subject = $1 AND issuer=$2',
            [subject,issuer])
        return res.rows[0]
    }catch(e){
        console.log(e)
    }
}
async function getUserById(id){
    try{
        const res = await pool.
        query(
            'SELECT id,display_name,email,profile_image FROM "Users" WHERE id=$1',
            [id])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function getUserWithUsername(username){
    try{
        const res = await pool.
        query(
            'SELECT id,display_name,salt,email,password_hash FROM "Users" WHERE username=$1',
            [username])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function updatePassword(username,password_hash,salt){
    try{
        const res = await pool.
        query(
            `UPDATE "Users" 
        SET password_hash=$1,salt=$2,last_changed_password=(SELECT password_hash FROM "Users" WHERE username=$3),
        last_salt=(SELECT salt FROM "Users" WHERE username=$3) 
        WHERE username=$3`,
            [password_hash,salt,username])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function getTopic(language){
    try{
        const res = await pool.
        query(
            `SELECT name,index FROM "Topic" WHERE language = $1 ORDER BY index`,
            [language])
        return res.rows
    }catch (e){
        console.log(e)
    }
}
async function getTutorial(language,index){
    try{
        const res = await pool.
        query(
            `SELECT topic,passage,question FROM "Tutorial" WHERE language = $1 AND index = $2`,
            [language,index])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function getQuestion(language,id){
    try{
        const res = await pool.
        query(
            `SELECT * FROM "Question" WHERE language = $1 AND question_type = 'MCQ' AND question_id NOT IN  (SELECT question_id FROM "AnsweredQuestion" WHERE user_id = $2) ORDER BY RANDOM() LIMIT 5`,
            [language,id])
        return res.rows
    }catch (e){
        console.log(e)
    }
}
async function getContestQuestion(language){
    try{
        const res = await pool.
        query(
            `SELECT * FROM "Question" WHERE language = $1 AND question_type = 'CONTEST' ORDER BY RANDOM() `,
            [language])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function setAnswer(userId,answer){
    try{
        for (const key of Object.keys(answer)) {
            try {
                await pool.query("BEGIN")
                await pool.query(
                    `INSERT INTO "AnsweredQuestion" 
            VALUES ($1, $2, $3,'QA') 
            RETURNING *`,
                    [answer[key], key, userId]
                )
                await pool.query("COMMIT")
            } catch (error) {
                console.error(`Error inserting record for ${key}:`, error);
            }
        }
    }catch (e){
        console.log(e)
    }

}
async function getScore(userId){
   try{
       const res = await pool.
       query(
           `SELECT (SELECT score as QAScore FROM "Score" WHERE user_id=$1 AND score_type='QA'),
(SELECT score as ContestScore FROM "Score" WHERE user_id=$1 AND score_type='CONTEST'),
(SELECT COUNT(*) FROM "AnsweredQuestion" WHERE user_id=$1 AND answer_type='QA') AS QATotal,
(SELECT COUNT(*) FROM "AnsweredQuestion" WHERE user_id=$1 AND answer_type='CONTEST') as ContestTotal
 FROM "Score" WHERE user_id=$1`,
           [userId])
       return res.rows[0]
   }catch (e){
       console.log(e)
   }
}
async function updateProfile(id,displayName,profileImage){
    try{
        return (await pool.
        query(
            `UPDATE "Users" SET display_name = $1, profile_image = $2 WHERE id = $3 RETURNING *`,
            [displayName,profileImage,id])).rows[0]
    }catch (e){
        console.log(e)
    }

}
async function getCodeDependency(questionId){
    try{
        const res = await pool.
        query(
            `SELECT code_output,answer_key FROM "Question" WHERE question_id=$1`,
            [questionId])
        return res.rows[0]
    }catch (e){
        console.log(e)
    }
}
async function addContestScore(userId){
    try {
        const res = await pool.query(
            `SELECT update_or_insert_score($1)`,
            [userId]
        );
    }catch (e){
        console.log(e)
    }

}
async function addContest(userId,answer,question_id){
    try{
        await pool.query(
            `INSERT INTO "AnsweredQuestion" (user_answer,question_id,user_id,answer_type)
            VALUES ($1, $2, $3,'CONTEST') 
            RETURNING *`,
            [answer,question_id, userId]
        )
    }catch(e){
        console.log(e)
    }
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
    getQuestion,
    getContestQuestion,
    setAnswer,
    getScore,
    updateProfile,
    getCodeDependency,
    addContestScore,
    addContest
}