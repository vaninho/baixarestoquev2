// Removed from another JS to make the commit easy, not needing to hide pwd.
async function connect() {
    const connectionString = 'postgresql://postgres:******@10.0.0.27:5432/LOGTEC';
    if (global.connection)
        return global.connection;

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: connectionString
    });

    //apenas testando a conexão
    const client = await pool.connect();
    console.log("PostgreSQL working!");

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return pool.connect();
}

module.exports.connect = conne