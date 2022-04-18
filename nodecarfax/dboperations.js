var config = require('./dbconfig');
const sql = require('mssql');
var express = require('express');

async function getLogin(req,res) {   
    
        let pool = await sql.connect(config.sqlConfig);
        let _userName = req.body.username;
        let _userPassword = req.body.password;
        let resultnode ={} ;

        let query = "EXEC UserAuthentication '" + _userName + "','" + _userPassword + "'";
        console.log(`Query  ---> ${query}`);
        return pool.request().query(query).then(function (result) {
            console.log("*** Data successfully returned *** ");
            let _returnSql = result.recordset[0].RETURN;
            let _password = result.recordset[0].PassWord;

            if (_returnSql === 1) {
                console.log("User does not exist");
                sql.close();
                return resultnode.json(
                    {
                        "status": false,
                        "msg": "User does not exist",
                        "cod": 1
                    }
                )
            } else {
                // Verifying username
                console.log(`username ->  browser: ${_userName} and SQL: ${_returnSql},Password ->  browser: ${_userPassword} and SQL: ${_password}`)
                let Role = result.recordset[0].Role;
                let user = result.recordset[0].RETURN;
                let empName = result.recordset[0].empname;
                let userId = result.recordset[0].userid;
                if (_userName == _returnSql && _userPassword == _password) {
                    console.log("Authenticated");
                    sql.close();
                    delete result.recordset[0].RETURN;

                    resultnode.json(
                        {
                            "status": true,
                            "msg": "Valid User",
                            user,
                            empName, Role, userId
                        }
                    )

                }
                else {
                    console.log("Unauthenticated");
                    sql.close();
                    resultnode.json(
                        {
                            "status": false,
                            "msg": "Incorrect empId"
                        }
                    )

                }
            }
        }).catch(function (err) {
            console.log("SQL Error", err);
            sql.close();
            resultnode.json(
                {
                    "status": false,
                    "msg": "SQL Error"
                }
            )
        }); 
    
}

module.exports = {
    getLogin: getLogin
}


