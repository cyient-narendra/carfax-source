let sqlConfig = {
    user: 'hyper',
    password: 'hyper@123',
    server: '172.27.74.23',
    database: 'CarFax_Staging2_Hold',
    trustedConnection: true,
    options: { encrypt: false }
};
let sqlConfigcidmis = {
    user: 'hyper',
    password: 'hyper@123',
    server: '172.27.74.23',
    database: 'CIDMIS',
    trustedConnection: true,
    options: { encrypt: false }
};
let sqlConfigstaging = {
    user: 'hyper',
    password: 'hyper@123',
    server: '172.27.74.23',
    database: 'CarFax_Staging',
    trustedConnection: true,
    options: { encrypt: false }
};
let sqlConfignew = {
    user: 'carfax_web_user',
    password: 'Carfax@123',
    server: '172.17.30.47\\ihsappdbserver',
    database: 'carFax_web',
    options: { encrypt: false },
    trustedConnection: true,
    pool: {
        min: 20,
        max: 100,
        idleTimeoutMillis: 3000
    }
};
let sqlConfigmis = {
    user: 'Naren',
    password: 'N@ren',
    server: '172.17.30.67',
    database: 'CID_MIS_Naren',
    options: { encrypt: false },
    trustedConnection: true,
    pool: {
        min: 20,
        max: 100,
        idleTimeoutMillis: 3000
    }
};



module.exports = {sqlConfig,sqlConfigcidmis,sqlConfigstaging,sqlConfigmis,sqlConfignew
    }