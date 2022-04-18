var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var XLSX = require('xlsx');
var formidable = require('formidable');
const mv = require('mv');
const fs = require('fs');
const download = require('download');
var path = require('path');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./dbconfig');
const sql = require('mssql'); // Update data for connection to your database instance
let mssql = require('./mssql-connection-pooling.js')
//const dboperations = require('./dboperations');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use('/api', router);
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
router.use((request, response, next) => {
    //console.log('middleware');
    next();
    
})
app.post("/login", function (req, res) {

    sql.connect(config.sqlConfig).then(function (pool) {
        console.log("==== DATABASE CONNECTED =====");

        let _userName = req.body.username;
        let _userPassword = req.body.password;

        let query = "EXEC UserAuthentication '" + _userName + "','" + _userPassword + "'";
        console.log(`Query  ---> ${query}`);
        return pool.request().query(query).then(function (result) {
            console.log("*** Data successfully returned *** ");
            let _returnSql = result.recordset[0].RETURN;
            let _password = result.recordset[0].PassWord;

            if (_returnSql === 1) {
                console.log("User does not exist");
                sql.close();
                return res.json(
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
                let wsml = result.recordset[0].wsml;
                let qcAccess = result.recordset[0].QCaccess;
                let qaAccess = result.recordset[0].QAaccess;
                
                if (_userName == _returnSql && _userPassword == _password) {
                    console.log("Authenticated");
                    sql.close();
                    delete result.recordset[0].RETURN;

                    res.json(
                        {
                            "status": true,
                            "msg": "Valid User",
                            user,
                            empName, Role, userId,wsml,qcAccess,qaAccess
                        }
                    )

                }
                else {
                    console.log("Unauthenticated");
                    sql.close();
                    res.json(
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
            res.json(
                {
                    "status": false,
                    "msg": "SQL Error"
                }
            )
        });
    }).catch(function (errsql) {
        console.log("SQL Error", errsql);
        sql.close();
        res.json(
            {
                "status": false,
                "msg": "SQL Error"
            }
        )
    })
})
app.post("/dataentry", async (req, res, next) => {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        //console.log(req.body);

        let _agencyori = req.body.agencyori;
        let _receivedDate = req.body.receivedDate;
        let _source = req.body.source;
        let _rfi = req.body.rfi;
        let _fileorgname = req.body.fileorgname;
        let _controlno = req.body.controlno;
        let _crashdate = req.body.crashdate;
        let _reportno = req.body.reportno;
        let _reporttype = req.body.reporttype;
        let _city = req.body.city;
        let _county = req.body.county;
        let _state = req.body.state;
        let _dcremarks = req.body.dcremarks;
        let _qcremarks = req.body.qcremarks;
        let _qaremarks = req.body.qaremarks;
        let _timespent = req.body.timespent;
        let _dctime = req.body.dctime;
        let _qctime = req.body.qctime;
        let _qatime = req.body.qatime;
        let _Parties = req.body.parties;
        let _passengers = req.body.passengers;
        let _status = req.body.status;
        let _user = req.body.user;
        let _reportselect = req.body.reportselect;
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let qr2; let qr3; let qr1;
        let pdf_name;

        let qr = "Select File_org_name from Accident where File_org_name = '"+_fileorgname+"'"
        pool.request().query(qr).then(function (result, err) { 
            console.log(qr);
            console.log(result);
            if(result.rowsAffected == 0){
                if (_dctime != undefined) {            
                    qr1 = "INSERT INTO Accident(agency_ori,Received_Date,control_number,source,RFI,state,City,County,crash_date,report_number,report_type,File_org_name,pdf_name,DC_Remarks,DC_Time,DC_Status,Updated_On,Type_Of_Report,Updated_by) values('"+_agencyori+"','"+_receivedDate+"','"+_controlno+"','"+_source+"','"+_rfi+"','"+_state+"','"+_city+"','"+_county+"','"+_crashdate+"','"+_reportno+"','"+_reporttype+"','"+_fileorgname+"','"+_agencyori+'_'+_reportno+'_'+_rfi+'.PDF'+"','"+_dcremarks+"','"+_dctime+"','"+_status+"','"+date+"','"+_reportselect+"','"+_user+"')";
            
                    }
                else if (_qctime != undefined) {
                     qr1 = `Update Accident set agency_ori = '${_agencyori}',Received_Date ='${_receivedDate},control_number ='${_controlno}',source ='${_source}',RFI = '${_rfi}',state = '${_state}',City = '${_city}',County = '${_county}',crash_date = '${_crashdate}',report_number ='${_reportno}',report_type = '${_reporttype}',File_org_name = '${_fileorgname}',pdf_name = '${_agencyori}_${_reportno}_${_rfi}.PDF',QC_Remarks = '${_qcremarks}',QC_Time = '${_qctime}',QC_Status = '${_status}',Updated_by = '${_user}',Updated_On = '${date}'  where File_org_name = '${_fileorgname}';`

                    }
                else if (_qatime != undefined) {
                    qr1 = `Update Accident set agency_ori = '${_agencyori}',Received_Date ='${_receivedDate},control_number ='${_controlno}',source ='${_source}',RFI = '${_rfi}',state = '${_state}',City = '${_city}',County = '${_county}',crash_date = '${_crashdate}',report_number ='${_reportno}',report_type = '${_reporttype}',File_org_name = '${_fileorgname}',pdf_name = '${_agencyori}_${_reportno}_${_rfi}.PDF',QA_Remarks = '${_qaremarks}',QA_Time = '${_qatime}',QA_Status = '${_status}',Updated_by = '${_user}',Updated_On = '${date}'  where File_org_name = '${_fileorgname}';`
                    }

        pool.request().query(qr1).then(function (result, err) { 
            //console.log(result);
            console.log(qr1);
            console.log("Inserted -Accident");
            if(result.rowsAffected > 0) {         

            for (var i = 0; i < _Parties.length; i++) {

                console.log("pid =" + _Parties[i].P_ID);
                var request = new sql.Request();
    
                request.input('P_ID', _Parties[i].P_ID)
                request.input('first_name', _Parties[i].first_name)
                request.input('last_name', _Parties[i].last_name)
                request.input('insurance_company', _Parties[i].insurance_company)
                request.input('Updated_by', _Parties[i]._user)
                request.input('V_ID', _Parties[i].V_ID)
                request.input('vin', _Parties[i].vin)
                request.input('vehicle_make', _Parties[i].vehicle_make)
                request.input('vehicle_model', _Parties[i].vehicle_model)
                request.input('vehicle_plate', _Parties[i].vehicle_plate)
                request.input('vehicle_year', _Parties[i].vehicle_year)
                request.input('plate_state', _Parties[i].plate_state)
                request.input('airbag', _Parties[i].airbag)
                request.input('damage', _Parties[i].damage)
                request.input('extraction', _Parties[i].extraction)
                request.input('fire', _Parties[i].fire)
                request.input('towing', _Parties[i].towing)
                request.input('point_of_impact', _Parties[i].point_of_impact)
    
                qr2 = `INSERT INTO parties(P_ID,first_name,last_name,insurance_company,Updated_by,File_org_name,Updated_On) values('${_Parties[i].P_ID}','${_Parties[i].Driver_first_name}','${_Parties[i].Driver_last_name}','${_Parties[i].insurance_company}','${_user}','${_fileorgname}','${date}');INSERT INTO vehicles(V_ID,vin,vehicle_make,vehicle_model,vehicle_plate,vehicle_year,plate_state,airbag,damage,extraction,fire,towing,point_of_impact,File_org_name,Updated_On,Updated_by) values('${_Parties[i].V_ID}','${_Parties[i].vin}','${_Parties[i].vehicle_make}','${_Parties[i].vehicle_model}','${_Parties[i].vehicle_plate}','${_Parties[i].vehicle_year}','${_Parties[i].plate_state}','${_Parties[i].airbag}','${_Parties[i].damage}','${_Parties[i].extraction}','${_Parties[i].fire}','${_Parties[i].towing}','${_Parties[i].point_of_impact}','${_fileorgname}','${date}','${_user}');`
                console.log(`Query  ---> ${qr2}`);
                pool.request().query(qr2).then(function (result) {
                    console.log("*** Data successfully Inserted-parties,vechicles*** ");
                })
            }
                for (var i = 0; i < _passengers.length; i++) {
                    console.log("passfirst =" + _passengers[i].Passenger_first_name);
                    console.log("passlast =" + _passengers[i].Passenger_last_name);
                    var request = new sql.Request();
                    request.input('first_name', _passengers[i].Passenger_first_name)
                    request.input('last_name', _passengers[i].Passenger_last_name)
                    request.input('Updated_by', _passengers[i]._user)
        
                    qr3 = `INSERT INTO passengers(first_name,last_name,File_org_name,Updated_by,Updated_On) values('${_passengers[i].Passenger_first_name}','${_passengers[i].Passenger_last_name}','${_fileorgname}','${_user}','${date}');`
                    //console.log(`Query  ---> ${qr3}`);
                    pool.request().query(qr3).then(function (result) {
                        console.log("*** Data successfully Inserted--passengers *** ");                        
                    })
                }
                let qr7 = "Exec UpdateUID_AllTables;Exec SD_SP_MetroTypeUpdate;"
                        pool.request().query(qr7).then(function (result, err) {
                        console.log("*** Data successfully Updated *** ");
                        })
            
        }
        return res.json(
            {
                "pdf_name": _agencyori + '_' + _reportno + '_' + _rfi + '.PDF',
                "msg": "Success"
            })
            })
        }else{
            return res.json({
                "msg":"File Existed"
            })
        }
        })
    
    } catch (error) {
        next(error.response)
    }
});
app.post("/hyperdata", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _filename = req.body.filename;
        let _org = req.body.filename.File_org_name;
        let qr;
        if (_filename == '[object Object]') {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate,CONVERT(varchar,crash_date,23) as crashdate from [CarFax_Staging2_Hold].[dbo].[Accident] where File_org_name = '" + _org + "'";
        }
        else {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate,CONVERT(varchar,crash_date,23) as crashdate from [CarFax_Staging2_Hold].[dbo].[Accident] where File_org_name = '" + _filename + "'";
        }
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);

        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/hyperfilename", async (req, res) => {
    try {
        let pool1 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        pool1.connect(function () {
            //console.log(req.body);
            let _user = req.body.fileuser;
            let qr = "Select File_org_name,convert(varchar,Received_Date,23) as ReceivedDate,Metro_Type from [CarFax_Staging2_Hold].[dbo].[Accident] where DC_Name = '" + _user + "' or QC_By = '" + _user + "' or QA_By = '" + _user + "' order by ReceivedDate DESC";
            //console.log(`Query  ---> ${qr}`);
            pool1.request().query(qr).then(function (result, err) {
                console.log(qr);
                //console.log("*** Data successfully returned *** ");
                //console.log(result);
                res.status(200).json(result);
            })
        });
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getparties", async (req, res) => {
    try {
        let pool2 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        pool2.connect(function () {
            let _filename = req.body.filename;
            let _orgname = req.body.filename.File_org_name;
            let qr;
            //console.log(req.body);
            if (_filename == '[object Object]') {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[parties] where File_org_name = '" + _orgname + "'";
            }
            else {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[parties] where File_org_name = '" + _filename + "'";
            }
            console.log(`Query  ---> ${qr}`);
            pool2.request().query(qr).then(function (result, err) {
                //console.log("*** Data successfully returned *** ");
                //console.log(result);
                res.status(200).json(result);
            })
        });
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getvechicles", async (req, res) => {
    try {
        let pool3 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        pool3.connect(function () {

            let _file = req.body.filename;
            let _org = req.body.filename.File_org_name;
            let qr;
            //console.log(req.body);
            if (_file == '[object Object]') {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[vehicles] where File_org_name = '" + _org + "'";
            }
            else {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[vehicles] where File_org_name = '" + _file + "'";
            }

            console.log(`Query  ---> ${qr}`);
            pool3.request().query(qr).then(function (result, err) {
                //console.log("*** Data successfully returned *** ");
                //console.log(result);
                res.status(200).json(result);
            })

        });
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getpassengers", async (req, res) => {

    try {
        let pool4 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        pool4.connect(function () {
            let _passengerfile = req.body.passengerfileName;
            let _org = req.body.passengerfileName.File_org_name;
            let qr;

            //console.log(req.body);
            if (_passengerfile == '[object Object]') {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[passengers] where File_org_name = '" + _org + "'";

            }
            else {
                qr = "Select * from [CarFax_Staging2_Hold].[dbo].[passengers] where File_org_name = '" + _passengerfile + "'";
            }
            console.log(`Query  ---> ${qr}`);
            pool4.request().query(qr).then(function (result, err) {
                //console.log("*** Data successfully returned *** ");
                //console.log(result);
                res.status(200).json(result);
            })
        });
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/hyperEntryData", async (req, res, next) => {

    try {
        let pool5 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log("connection Done");
        let _hyperagencyori = req.body.hyperagencyori;
        let _hyperreceivedDate = req.body.hyperreceivedDate;
        let _hypersource = req.body.hypersource;
        let _hyperrfi = req.body.hyperrfi;
        let _hyperfileorgname = req.body.hyperfileorgname;
        let _hypercontrolno = req.body.hypercontrolno;
        let _hypercrashdate = req.body.hypercrashdate;
        let _hyperreportno = req.body.hyperreportno;
        let _hyperreporttype = req.body.hyperreporttype;
        let _hypercity = req.body.hypercity;
        let _hyperpdfname = req.body.hyperpdfname;
        let _hypercounty = req.body.hypercounty;
        let _hyperstate = req.body.hyperstate;
        let _hyperdcremarks = req.body.hyperdcremarks;
        let _hyperqcremarks = req.body.hyperqcremarks;
        let _hyperqaremarks = req.body.hyperqaremarks;
        let _hypertimespent = req.body.hypertimespent;
        let _hyperdctime = req.body.hyperdctime;
        let _hyperqctime = req.body.hyperqctime;
        let _hyperqatime = req.body.hyperqatime;
        let _hyperStatus = req.body.hyperStatus;
        let _hyperuser = req.body.hyperuser;
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let qr1; let qr2; let qr; let qr3

        if (_hyperdctime != '') {
            qr3 = `UPDATE Accident set agency_ori = '${_hyperagencyori}',Received_Date = convert(varchar,convert(datetime,'${_hyperreceivedDate}'),23),control_number = '${_hypercontrolno}' ,File_org_name = '${_hyperfileorgname}',source = '${_hypersource}',pdf_name ='${_hyperpdfname}',RFI = '${_hyperrfi}',state = '${_hyperstate}',City = '${_hypercity}',County ='${_hypercounty}',crash_date = convert(varchar,convert(datetime,'${_hypercrashdate}'),23),report_number='${_hyperreportno}',report_type='${_hyperreporttype}',DC_Remarks='${_hyperdcremarks}',DC_Time='${_hyperdctime}',DC_Status='${_hyperStatus}',Updated_by = '${_hyperuser}',Updated_On= '${date}' where File_org_name = '${_hyperfileorgname}'`;
        }
        else if (_hyperqctime != '') {
            qr3 = `UPDATE Accident set agency_ori = '${_hyperagencyori}',Received_Date = convert(varchar,convert(datetime,'${_hyperreceivedDate}'),23),control_number = '${_hypercontrolno}' ,File_org_name = '${_hyperfileorgname}',source = '${_hypersource}',pdf_name ='${_hyperpdfname}',RFI = '${_hyperrfi}',state = '${_hyperstate}',City = '${_hypercity}',County ='${_hypercounty}',crash_date = convert(varchar,convert(datetime,'${_hypercrashdate}'),23),report_number='${_hyperreportno}',report_type='${_hyperreporttype}',QC_Remarks='${_hyperqcremarks}',QC_Time='${_hyperqctime}',QC_Status='${_hyperStatus}',Updated_by = '${_hyperuser}',Updated_On= '${date}' where File_org_name = '${_hyperfileorgname}'`;
        }
        else if (_hyperqatime != '') {
            qr3 = `UPDATE Accident set agency_ori = '${_hyperagencyori}',Received_Date = convert(varchar,convert(datetime,'${_hyperreceivedDate}'),23),control_number = '${_hypercontrolno}' ,File_org_name = '${_hyperfileorgname}',source = '${_hypersource}',pdf_name ='${_hyperpdfname}',RFI = '${_hyperrfi}',state = '${_hyperstate}',City = '${_hypercity}',County ='${_hypercounty}',crash_date = convert(varchar,convert(datetime,'${_hypercrashdate}'),23),report_number='${_hyperreportno}',report_type='${_hyperreporttype}',QA_Remarks='${_hyperqaremarks}',QA_Time='${_hyperqctime}',QA_Status='${_hyperStatus}',Updated_by = '${_hyperuser}',Updated_On= '${date}' where File_org_name = '${_hyperfileorgname}'`;
        }
        pool5.request().query(qr3).then(function (result, err) {
            console.log("*** Data successfully updated -accident *** ");
            console.log(result);
            

            if (err) {
                return res.json(
                    {
                        "msg": "Error, Please Check"
                    })
            } else {
                return res.json(
                    {

                        "msg": "Successfully Updated"

                    })
            }
        })

        // console.log("request="+_hypersource);
        // console.log(_hyperParties.length);
        // console.log("fileorg="+_hyperfileorgname);

        // for(var i=0;i<_hyperParties.length;i++){

        //     console.log("lastname ="+_hyperParties[i].last_name);
        //    var request = new sql.Request();
        //    request.input('P_ID', _hyperParties[i].P_ID)
        //    request.input('first_name', _hyperParties[i].first_name)
        //    request.input('last_name', _hyperParties[i].last_name)           
        //    request.input('insurance_company', _hyperParties[i].insurance_company)

        //    qr = `Update parties set P_ID ='${_hyperParties[i].P_ID}',first_name = '${_hyperParties[i].first_name}',last_name = '${_hyperParties[i].last_name}',insurance_company = '${_hyperParties[i].insurance_company}',File_org_name = '${_hyperfileorgname}',Updated_by = '${_hyperuser}',Updated_On = '${date}' where File_org_name = '${_hyperfileorgname}';`
        //    pool5.request().query(qr).then(function (result, err) {
        //     console.log("*** Data successfully Updated-parties *** ");            
        //     })
        // }
        // for(var i=0;i<_hypervechicles.length;i++){            
        //    console.log(_hypervechicles[i].vin);
        //    var request = new sql.Request();
        //    request.input('V_ID', _hypervechicles[i].V_ID)
        //    request.input('vin', _hypervechicles[i].vin)
        //    request.input('vehicle_make', _hypervechicles[i].vehicle_make)
        //    request.input('vehicle_model', _hypervechicles[i].vehicle_model)
        //    request.input('vehicle_plate', _hypervechicles[i].vehicle_plate)
        //    request.input('vehicle_year', _hypervechicles[i].vehicle_year)
        //    request.input('plate_state', _hypervechicles[i].plate_state)
        //    request.input('airbag', _hypervechicles[i].airbag)
        //    request.input('damage', _hypervechicles[i].damage)
        //    request.input('extraction', _hypervechicles[i].extraction)
        //    request.input('fire', _hypervechicles[i].fire)
        //    request.input('towing', _hypervechicles[i].towing)
        //    request.input('point_of_impact', _hypervechicles[i].point_of_impact)

        //    qr1 = `UPDATE vehicles set V_ID = '${_hypervechicles[i].V_ID}',vin = '${_hypervechicles[i].vin}',vehicle_make = '${_hypervechicles[i].vehicle_make}',vehicle_model = '${_hypervechicles[i].vehicle_model}',vehicle_plate = '${_hypervechicles[i].vehicle_plate}',vehicle_year = '${_hypervechicles[i].vehicle_year}',plate_state = '${_hypervechicles[i].plate_state}',airbag = '${_hypervechicles[i].airbag}',damage = '${_hypervechicles[i].damage}',extraction = '${_hypervechicles[i].extraction}',fire = '${_hypervechicles[i].fire}',towing = '${_hypervechicles[i].towing}',point_of_impact = '${_hypervechicles[i].point_of_impact}',File_org_name = '${_hyperfileorgname}',Updated_by = '${_hyperuser}',Updated_On = '${date}' where File_org_name = '${_hyperfileorgname}';`
        //    pool5.request().query(qr1).then(function (result, err) {
        //     console.log("*** Data successfully Updated-vechicles *** ");            
        //     })
        // }
        // for(var i=0;i<_hyperpassengers.length;i++){            

        //    var request = new sql.Request();
        //    request.input('first_name', _hyperpassengers[i].first_name)
        //    request.input('last_name', _hyperpassengers[i].last_name)           

        //    qr2 = `UPDATE passengers set first_name = '${_hyperpassengers[i].first_name}',last_name = '${_hyperpassengers[i].last_name}',File_org_name = '${_hyperfileorgname}',Updated_by = '${_hyperuser}',Updated_On = '${date}' where File_org_name = '${_hyperfileorgname}';`
        //    pool5.request().query(qr2).then(function (result, err) {
        //     console.log("*** Data successfully Updated-passengers *** ");            
        //     })
        // } 
        let qr7 = "Exec UpdateUID_AllTables;Exec SD_SP_MetroTypeUpdate;"
        pool5.request().query(qr7).then(function (result, err) {
            console.log("*** Data successfully Updated *** ");
        })

    } catch (err) {
        if (err) console.log(err);
    }

});
app.post("/tableDataParties", async (req, res, next) => {
    try {
        let pool5 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log("connection Done");
        console.log(req.body);
        let _tableparties = req.body.tableparties;
        let _tablevechicles = req.body.tablevechicle;
        let _tablepassengers = req.body.tablepassengers;
        let _tablefileorg = req.body.tablefileorgname;
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let _tableuser = req.body.tableuser;
        let qr1; let qr2; let qr; let qr3
        console.log("fileorg=" + _tablefileorg);

        console.log("firstname =" + _tableparties.first_name);
        var request = new sql.Request();

        qr = `Update parties set P_ID ='${_tableparties.P_ID}',first_name = '${_tableparties.first_name}',last_name = '${_tableparties.last_name}',insurance_company = '${_tableparties.insurance_company}',File_org_name = '${_tablefileorg}',Updated_by = '${_tableuser}',Updated_On = '${date}' where File_org_name = '${_tablefileorg}' and ID = '${_tableparties.ID}';`
        console.log(qr);
        pool5.request().query(qr).then(function (result, err) {
            console.log("*** Data successfully Updated-parties *** ");
        })

        // for(var i=0;i<_tablevechicles.length;i++){            
        //    console.log(_tablevechicles[i].vin);
        //    var request = new sql.Request();
        //    request.input('V_ID', _tablevechicles[i].V_ID)
        //    request.input('vin', _tablevechicles[i].vin)
        //    request.input('vehicle_make', _tablevechicles[i].vehicle_make)
        //    request.input('vehicle_model', _tablevechicles[i].vehicle_model)
        //    request.input('vehicle_plate', _tablevechicles[i].vehicle_plate)
        //    request.input('vehicle_year', _tablevechicles[i].vehicle_year)
        //    request.input('plate_state', _tablevechicles[i].plate_state)
        //    request.input('airbag', _tablevechicles[i].airbag)
        //    request.input('damage', _tablevechicles[i].damage)
        //    request.input('extraction', _tablevechicles[i].extraction)
        //    request.input('fire', _tablevechicles[i].fire)
        //    request.input('towing', _tablevechicles[i].towing)
        //    request.input('point_of_impact', _tablevechicles[i].point_of_impact)

        //    qr1 = `UPDATE vehicles set V_ID = '${_tablevechicles[i].V_ID}',vin = '${_tablevechicles[i].vin}',vehicle_make = '${_tablevechicles[i].vehicle_make}',vehicle_model = '${_tablevechicles[i].vehicle_model}',vehicle_plate = '${_tablevechicles[i].vehicle_plate}',vehicle_year = '${_tablevechicles[i].vehicle_year}',plate_state = '${_tablevechicles[i].plate_state}',airbag = '${_tablevechicles[i].airbag}',damage = '${_tablevechicles[i].damage}',extraction = '${_tablevechicles[i].extraction}',fire = '${_tablevechicles[i].fire}',towing = '${_tablevechicles[i].towing}',point_of_impact = '${_tablevechicles[i].point_of_impact}',File_org_name = '${_tablefileorg}',Updated_by = '${_tableuser}',Updated_On = '${date}' where File_org_name = '${_tablefileorg}';`
        //    pool5.request().query(qr1).then(function (result, err) {
        //     console.log("*** Data successfully Updated-vechicles *** ");            
        //     })
        // }
        // for(var i=0;i<_tablepassengers.length;i++){            

        //    var request = new sql.Request();
        //    request.input('first_name', _tablepassengers[i].first_name)
        //    request.input('last_name', _tablepassengers[i].last_name)           

        //    qr2 = `UPDATE passengers set first_name = '${_tablepassengers[i].first_name}',last_name = '${_tablepassengers[i].last_name}',File_org_name = '${_tablefileorg}',Updated_by = '${_tableuser}',Updated_On = '${date}' where File_org_name = '${_tablefileorg}';`
        //    pool5.request().query(qr2).then(function (result, err) {
        //     console.log("*** Data successfully Updated-passengers *** ");            
        //     })
        // }     

    } catch (err) {
        if (err) console.log(err);
    }

});
app.post("/tableDataVechicles", async (req, res, next) => {
    try {
        let pool5 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log("connection Done");
        console.log(req.body);

        let _tablevechicles = req.body.tablevechicles;
        let _tablefileorg = req.body.tablefileorgname;
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let _tableuser = req.body.tableuser;
        let qr1; let qr2; let qr; let qr3
        console.log("fileorg=" + _tablefileorg);

        qr1 = `UPDATE vehicles set V_ID = '${_tablevechicles.V_ID}',vin = '${_tablevechicles.vin}',vehicle_make = '${_tablevechicles.vehicle_make}',vehicle_model = '${_tablevechicles.vehicle_model}',vehicle_plate = '${_tablevechicles.vehicle_plate}',vehicle_year = '${_tablevechicles.vehicle_year}',plate_state = '${_tablevechicles.plate_state}',airbag = '${_tablevechicles.airbag}',damage = '${_tablevechicles.damage}',extraction = '${_tablevechicles.extraction}',fire = '${_tablevechicles.fire}',towing = '${_tablevechicles.towing}',point_of_impact = '${_tablevechicles.point_of_impact}',File_org_name = '${_tablefileorg}',Updated_by = '${_tableuser}',Updated_On = '${date}' where File_org_name = '${_tablefileorg}' and ID = '${_tablevechicles.ID}';`
        pool5.request().query(qr1).then(function (result, err) {
            console.log(qr1);
            console.log("*** Data successfully Updated-vechicles *** ");
        })


    } catch (err) {
        if (err) console.log(err);
    }

});
app.post("/tableDataPassengers", async (req, res, next) => {
    try {
        let pool5 = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let _tablepassengers = req.body.tablepassengers;
        let _tablefileorg = req.body.tablefileorgname;
        var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let _tableuser = req.body.tableuser;
        let qr1; let qr2; let qr; let qr3
        console.log("fileorg=" + _tablefileorg);

        qr2 = `UPDATE passengers set first_name = '${_tablepassengers.first_name}',last_name = '${_tablepassengers.last_name}',File_org_name = '${_tablefileorg}',Updated_by = '${_tableuser}',Updated_On = '${date}' where File_org_name = '${_tablefileorg}' and ID = '${_tablepassengers.ID}';`
        pool5.request().query(qr2).then(function (result, err) {
            console.log(qr2);
            console.log("*** Data successfully Updated-passengers *** ");
        })


    } catch (err) {
        if (err) console.log(err);
    }

});
app.post("/changepassword", async (req, res) => {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let _Password = req.body.password;
        let _oldpassword = req.body.old;
        let _userName = req.body.userid;
        let _phone = req.body.phone;
        let _email = req.body.email;
        let qr;

        if ((_oldpassword != undefined || _oldpassword != '') && (_Password != undefined || _Password != '')) {
            qr = "UPDATE Userdetails_web SET Password = '" + _Password + "',Phone = '" + _phone + "',email = '" + _email + "' where Username = '" + _userName + "' and Password = '" + _oldpassword + "' ";
        }
        else {
            console.log(err);
        }
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            console.log(result);
            if (result.rowsAffected > 0) {
                return res.json({
                    "msg": "Password Changed"
                })
            } else {
                return res.json({
                    "err": "eRROR"
                })
            }
        })
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getname", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let qr = "SELECT [Username] FROM [Login] where [Exist]='True' and Username<>'ADMIN'  group by [Username]  order by [Username];SELECT [Username] FROM [Login] where [Exist]='True' and QC_Access='True' and Username<>'ADMIN'  group by [Username]  order by [Username];SELECT [Username] FROM [Login] where [Exist]='True' and QA_Access='True' and Username<>'ADMIN'  group by [Username]  order by [Username] ";
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getMetroFiles", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _state = req.body.state;
        let _agencyori = req.body.agencyori;
        let _receiveddata = req.body.receiveddata;
        let _type = req.body.type;
        let _dcname = req.body.dcname;
        let qr;
        console.log("Hi");
        console.log('req',req.body);
        if( _step != '' && _commerce != ''){
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','','','';`            
        }
        if(_step != '' && _commerce != '' && _state != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','${_state}','','';`
        }
        if(_step != '' && _commerce != '' && _state != undefined && _agencyori != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','${_state}','${_agencyori}','';`
        }
        if(_step != '' && _commerce != '' && _state != undefined && _agencyori != undefined && _receiveddata != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','${_state}','${_agencyori}','${_receiveddata}';`
        }
        if(_step != '' && _commerce != '' && _state == undefined && _agencyori != undefined && _receiveddata != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','','${_agencyori}','${_receiveddata}';`
        }
        if(_step != '' && _commerce != '' && _state != undefined && _agencyori == undefined && _receiveddata != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','${_state}','','${_receiveddata}';`
        }
        if(_step != '' && _commerce != '' && _state != undefined && _agencyori != undefined && _receiveddata == undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','${_state}','${_agencyori}','';`
        }
        if(_step != '' && _commerce != '' && _state == undefined && _agencyori == undefined && _receiveddata != undefined)
        {
            qr = `Exec GetWorkdata '${_type}','${_step}','${_commerce}','','','${_receiveddata}';`
        }
        
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            console.log(qr);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            
            if(result.rowsAffected < 0){               
                return res.json({
                    'msg':"Please Check"
                    
                })
               
            }
            res.status(200).json(result);
        })
        
    } catch (err) {
        console.log(err);
    }
});
app.post("/getNonMetroFiles", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let qr;

        if (_step == 'QC') {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate from [CarFax_Staging2_Hold].[dbo].[Accident] where agency_ori not in ('METRO16DI','METROCFX1') AND (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_type = '" + _commerce + "' ";
        }
        else if (_step == 'DC') {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate from [CarFax_Staging2_Hold].[dbo].[Accident] where agency_ori not in ('METRO16DI','METROCFX1') AND (DC_Name is null or DC_Name = '') AND Commerce_type = '" + _commerce + "' ";
        }
        else if (_step == 'QA') {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate from [CarFax_Staging2_Hold].[dbo].[Accident] where agency_ori not in ('METRO16DI','METROCFX1') AND (QA_By is null or QA_By = '') AND DC_Status = 'COMP' AND QC_Status = 'COMP' AND Commerce_type = '" + _commerce + "' ";
        }
        else if (_step == 'Rework') {
            qr = "Select *,CONVERT(varchar,Received_Date,23) as ReceivedDate from [CarFax_Staging2_Hold].[dbo].[Accident] where agency_ori not in ('METRO16DI','METROCFX1')  AND DC_Status = 'COMP' AND QC_Status = 'REJECT' AND Commerce_type = '" + _commerce + "' ";
        }
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            console.log(qr);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/allotment", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _type = req.body.metroType;
        let _user = req.body.metrouser;
        let _dcname = req.body.dcname;
        let _qcname = req.body.qcname;
        let _qaname = req.body.qaname;
        //let _org = req.body.metropdfname[0].File_org_name;
        let _org = req.body.metropdfname;
        let qr;
        //console.log(_org.length);
        for (let i = 0; i < _org.length; i++) {

            if (_user == 'DC') {
                qr = "Update Accident set DC_Name ='" + _dcname + "',DC_Alloted_date = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (DC_Status Is Null Or DC_Status='') AND (DC_Name Is Null or DC_Name ='') ";
            }
            else if (_user == 'QC') {
                qr = "Update Accident set QC_By ='" + _qcname + "',QC_Allotment = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (DC_Status = 'COMP') AND (QC_Status Is Null Or QC_Status='') AND (QC_By Is Null or QC_By = '' ) ";
            }
            else if (_user == 'QA') {
                qr = "Update Accident set QA_By ='" + _qaname + "',QA_Allotment = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (QC_Status = 'COMP') AND (QA_Status Is Null Or QA_Status='') AND (QA_By Is Null or QA_By = '' ) ";
            }
            pool.request().query(qr).then(function (result, err) {
                //console.log("*** Data successfully returned *** ");
                console.log(result);
                // res.status(200).json(result);
                if (result.rowsAffected > 0) {
                    return res.json(
                        {

                            "msg": "Successfully Allotted"

                        })

                } else {
                    return res.json(
                        {
                            "msg": "Error In Work Allocation, Please Check"
                        })
                }
            })
        }

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/multiAllot", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);        
        let _user = req.body.metrouser;
        let _dcname = req.body.dcname;
        let _qcname = req.body.qcname;
        let _qaname = req.body.qaname;
        //let _org = req.body.metropdfname[0].File_org_name;
        let _org = req.body.metropdfname;
        let qr;
        //console.log(_org.length);
        for (let i = 0; i < _org.length; i++) {

            if (_user == 'DC') {
                qr = "Update Accident set DC_Name ='" + _dcname + "',DC_Alloted_date = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (DC_Status Is Null Or DC_Status='') AND (DC_Name Is Null or DC_Name ='') ";
            }
            else if (_user == 'QC') {
                qr = "Update Accident set QC_By ='" + _qcname + "',QC_Allotment = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (DC_Status = 'COMP') AND (QC_Status Is Null Or QC_Status='') AND (QC_By Is Null or QC_By = '' ) ";
            }
            else if (_user == 'QA') {
                qr = "Update Accident set QA_By ='" + _qaname + "',QA_Allotment = GETDATE() where File_org_name ='" + _org[i].File_org_name + "' AND (QC_Status = 'COMP') AND (QA_Status Is Null Or QA_Status='') AND (QA_By Is Null or QA_By = '' ) ";
            }
            pool.request().query(qr).then(function (result, err) {
                //console.log("*** Data successfully returned *** ");
                console.log(result);
                // res.status(200).json(result);
                if (result.rowsAffected > 0) {
                    return res.json(
                        {

                            "msg": "Successfully Allotted"

                        })

                } else {
                    return res.json(
                        {
                            "msg": "Error, Please Check"
                        })
                }
            })
        }

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getProductionFiles", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        let _user = req.body.produser;
        console.log(req.body);
        let qr = "Select *,convert(varchar,Received_Date,23) as ReceivedDate from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(DC_Name AS varchar) ='" + _user + "' OR CAST(QC_By AS varchar) ='" + _user + "' OR CAST(QA_By AS varchar) ='" + _user + "'";
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

        console.log(req.body);

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/gettlnames", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let qr = "Select distinct TL  from login where Exist = 1 and TL is not null  order by TL";
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getRecdDates", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let qr = "select Distinct convert(varchar,Received_Date,23) as RecedDate FROM [CarFax_Staging2_Hold].[dbo].[Accident]  order BY RecedDate DESC";
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getUsernames", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        let _user = req.body.username;
        //console.log("use ="+_user);
        let qr = "Select Username,Full_Name,TL from [CarFax_Staging2_Hold].[dbo].[Login] where TL ='" + _user + "'";
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getFilesCount", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let _recDate = req.body.recDate;

        let qr;
        console.log(req.body);

        if (_recDate != '') {
            qr = "Select * from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(Received_Date as date) = convert(varchar,'" + _recDate + "',103) and (DC_Status Is Null Or DC_Status='') AND (DC_Name =''  or DC_Name Is Null) AND (Metro_Type = 'Metro' or Metro_Type = 'Non-METRO') AND (Commerce_Type='Non-Ecommerce' or Commerce_Type='Ecommerce') ";
        }
        // else if(_rectoDate != '' && _recfromDate !='' && _recfromDate != _rectoDate){
        // qr = ` Select * from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(Received_Date as date) between convert(varchar,'${_recfromDate}',103) and convert(varchar,'${_rectoDate}',103) and (DC_Status Is Null Or DC_Status='') AND (DC_Name =''  or DC_Name Is Null) and (QC_Status Is Null Or QC_Status='') AND (QC_By='' or QC_By Is Null) AND (QA_Status Is Null Or QA_Status='') AND (QA_By ='' or QA_By Is Null) AND (Metro_Type = 'Metro') or (Metro_Type = 'Non-METRO')`;
        // }
        // else if(_recfromDate == '' && _rectoDate != ''){
        //     qr = ` Select * from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(Received_Date as date) = convert(varchar,'${_rectoDate}',103) and (DC_Status Is Null Or DC_Status='') AND (DC_Name = ''  or DC_Name Is Null) and (QC_Status Is Null Or QC_Status='') AND (QC_By='' or QC_By Is Null) AND (QA_Status Is Null Or QA_Status='') AND (QA_By ='' or QA_By Is Null) AND (Metro_Type = 'Metro') or (Metro_Type = 'Non-METRO')`;  
        // }
        // else if(_recfromDate != '' && _rectoDate == ''){
        //     qr = ` Select * from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(Received_Date as date) = convert(varchar,'${_recfromDate}',103) and (DC_Status Is Null Or DC_Status='') AND (DC_Name =''  or DC_Name Is Null) and (QC_Status Is Null Or QC_Status='') AND (QC_By='' or QC_By Is Null) AND (QA_Status Is Null Or QA_Status='') AND (QA_By ='' or QA_By Is Null) AND (Metro_Type = 'Metro') or (Metro_Type = 'Non-METRO')`;  
        // }
        // else if(_recfromDate == _rectoDate){
        //     qr = ` Select * from [CarFax_Staging2_Hold].[dbo].[Accident] where CAST(Received_Date as date) = convert(varchar,'${_recfromDate}',103) and (DC_Status Is Null Or DC_Status='') AND (DC_Name =''  or DC_Name Is Null) and (QC_Status Is Null Or QC_Status='') AND (QC_By='' or QC_By Is Null) AND (QA_Status Is Null Or QA_Status='') AND (QA_By ='' or QA_By Is Null) AND (Metro_Type = 'Metro') or (Metro_Type = 'Non-METRO')`;  
        // }        


        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/bulkAllotment", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        let _userrows = req.body.userrow;
        let _type = req.body.type;
        let _step = req.body.step;
        let _count = req.body.count;
        let _recfromDate = req.body.recfromDate;
        let _rectoDate = req.body.rectoDate;
        let _shift = req.body.shift;
        let _commerce = req.body.commerce;
        let _recddate = req.body.recddate;
        console.log("_recddate=" + _recddate);
        let qr;
        let where = '';
        let type = '';
        let commerce = '';
        let redate = '';
        if (_type == "Metro") {
            if (type == "")
                type = "(Metro_Type =''" + _type + "'')";
            else
                type = type + "And (Metro_Type = ''" + _type + "'')";
        }
        if (_type == "Non-METRO") {
            if (type == "")
                type = "(Metro_Type = ''" + _type + "'')";
            else
                type = type + "And (Metro_Type = ''" + _type + "'')";
        }
        if (_commerce == "Ecommerce") {
            if (commerce == '')
                commerce = "(Commerce_type = ''" + _commerce + "'')";
            else
                commerce = commerce + "And (Commerce_type = ''" + _commerce + "'')";
        }
        if (_commerce == "Non-Ecommerce") {
            if (commerce == '')
                commerce = "(Commerce_type = ''" + _commerce + "'')";
            else
                commerce = commerce + "And (Commerce_type = ''" + _commerce + "'')";
        }
        // if (_recfromDate == true) {
        //     if (where == "")
        //         where = "(Received_Date between '" + _recfromDate + "' and '" + _rectoDate + "') ";
        //     else
        //         where = where + " And (Received_Date between '" + _recfromDate + "' and '" + _rectoDate + "') ";
        // }
        if (_recddate != '') {
            if (redate == "")
                redate = "(Received_Date = ''" + _recddate + "''  ) ";
            else
                redate = redate + " And (Received_Date = ''" + _recddate + "'') ";
        }
        if (_step == "DC") {
            if (where == "")
                where = "(DC_Name='''' or DC_Name is null)";
            else
                where = where + " And (DC_Name='''' or DC_Name is null)";
        }
        if (_step == "QC") {
            if (where == "")
                where = "(QC_By='''' or QC_By is null)";
            else
                where = where + " And (QC_By='''' or QC_By is null)";
        }
        if (_step == "QA") {
            if (where == "")
                where = "(QA_By='''' or QA_By is null)";
            else
                where = where + " And (QA_By='''' or QA_By is null)";
        }
        console.log("redate = " + redate);
        for (let i = 0; i < _userrows.length; i++) {
            let username = _userrows[i].Username;

            qr = `EXEC Bulkallotment '${_step}','${_count}','${where}','${type}','${commerce}','${redate}','${username}'`;

            console.log(`Query  ---> ${qr}`);
            pool.request().query(qr).then(async (result, err) => {
                console.log(result);
                if (result.recordset[0].id > 0) {
                    return res.json({
                        "msg": "Success"
                    });
                } else {
                    return res.json({
                        "err": "Problem, pLEASE cHECK"
                    });
                }

            })
        }

    } catch (err) {
        if (err) console.log(err);
    }
});
jsonArrayToValueArray = (jsonArray) => {
    let valueArrayN = new Array();
    let valueArray = new Array();
    let valueArray1 = new Array();
    let valueArray2 = new Array();
    let valueArray3 = new Array();
    let valueArray4 = new Array();
    let valueArray5 = new Array();
    let valueArray6 = new Array();
    let valueArray7 = new Array();
    let valueArray8 = new Array();
    let valueArray9 = new Array();
    let valueArray10 = new Array();
    let valueArray11 = new Array();
    let valueArray12 = new Array();
    let valueArray13 = new Array();
    let valueArray14 = new Array();
    let valueArray15 = new Array();
    let valueArray16 = new Array();
    let valueArray17 = new Array();
    let valueArray18 = new Array();
    let valueArray19 = new Array();
    let valueArray20 = new Array();
    let valueArray21 = new Array();

    for (let index = 0; index < jsonArray.length; index++) {
        let object = jsonArray[index];
        let keys = Object.keys(object);
        valueArray.push([object[keys[0]]])
        valueArray1.push([object[keys[1]]])
        valueArray2.push([object[keys[2]]])
        valueArray3.push([object[keys[3]]])
        valueArray4.push([object[keys[4]]])
        valueArray5.push([object[keys[5]]])
        valueArray6.push([object[keys[6]]])
        valueArray7.push([object[keys[7]]])
        valueArray8.push([object[keys[8]]])
        valueArray9.push([object[keys[9]]])
        valueArray10.push([object[keys[10]]])
        valueArray11.push([object[keys[11]]])
        valueArray12.push([object[keys[12]]])
        valueArray13.push([object[keys[13]]])
        valueArray14.push([object[keys[14]]])
        valueArray15.push([object[keys[15]]])
        valueArray16.push([object[keys[16]]])
        valueArray17.push([object[keys[17]]])
        valueArray18.push([object[keys[18]]])
        valueArray19.push([object[keys[19]]])
        valueArray20.push([object[keys[20]]])
        valueArray21.push([object[keys[21]]])

        //console.log(valueArrayN) ;
        //console.log("valueArray7"+valueArray7);
    }
    valueArrayN = [valueArray, valueArray1, valueArray2, valueArray3, valueArray4, valueArray5, valueArray6, valueArray7, valueArray8, valueArray9, valueArray10, valueArray11, valueArray12, valueArray13, valueArray14, valueArray15, valueArray16, valueArray17, valueArray18, valueArray19, valueArray20, valueArray21];
    return valueArrayN;
}
app.post('/datauploadfile', function (req, res) {
    sql.connect(config.sqlConfig).then(function (pool, err) {

        if (req.url == '/datauploadfile') {
            var form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                try {
                    // let _recddate = req.body.date;
                    // console.log("_recddate ="+_recddate);
                    var oldpath = await files.myfile.path;
                    var user = fields.user;
                    var receivedDate = fields.recdate;
                    console.log(receivedDate);
                    var newpath = __dirname + '/uploadedfiles/' + files.myfile.name;
                    mv(oldpath, newpath, function (err) {
                        res.write('File uploaded and moved!');
                        var workbook = XLSX.readFile(newpath);
                        var sheet_name_list = workbook.SheetNames;
                        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
                            raw: false, header: 0, defval: ""
                        });
                        let valueArrayN = jsonArrayToValueArray(xlData);
                        //console.log("valueArrayN ="+valueArrayN);
                        var i;
                        //console.log("valueArrayN:"+valueArrayN[0]);
                        for (i = 0; i < valueArrayN[0].toString().split(',').length; i++) {
                            //console.log("valueArrayN[0].toString().split(',').length "+valueArrayN[0].toString().split(',').length);
                            //console.log("[0]"+valueArrayN[0].toString().split(',')[0]);
                            // const temp=valueArrayN[0].split(',');
                            if (err) { alert(err); }
                            // create Request object
                            var request = new sql.Request();

                            request.input('agency_ori', valueArrayN[0].toString().split(',')[i])
                            request.input('source', valueArrayN[1].toString().split(',')[i])
                            request.input('pdf_name', valueArrayN[2].toString().split(',')[i])
                            request.input('transaction_id', valueArrayN[3].toString().split(',')[i])
                            request.input('asset_locator', valueArrayN[4].toString().split(',')[i])
                            request.input('package_id', valueArrayN[5].toString().split(',')[i])
                            request.input('data_type', valueArrayN[6].toString().split(',')[i])
                            request.input('City', valueArrayN[7].toString().split(',')[i])
                            request.input('County', valueArrayN[8].toString().split(',')[i])
                            request.input('state', valueArrayN[9].toString().split(',')[i])
                            request.input('crash_date', valueArrayN[10].toString().split(',')[i])
                            request.input('report_number', valueArrayN[11].toString().split(',')[i])
                            request.input('report_type', valueArrayN[12].toString().split(',')[i])
                            request.input('RFI', valueArrayN[13].toString().split(',')[i])
                            request.input('File_org_name', valueArrayN[14].toString().split(',')[i])
                            request.input('control_number', valueArrayN[15].toString().split(',')[i])
                            request.input('Extracted_Count', valueArrayN[16].toString().split(',')[i])
                            request.input('No_Of_Units', valueArrayN[17].toString().split(',')[i])
                            request.input('Doc_Title', valueArrayN[18].toString().split(',')[i])
                            request.input('DC_Name', valueArrayN[19].toString().split(',')[i])
                            request.input('QC_By', valueArrayN[20].toString().split(',')[i])
                            request.input('QA_By', valueArrayN[21].toString().split(',')[i])

                            let query2 = `INSERT INTO Accident_web(agency_ori,source,pdf_name,transaction_id,asset_locator,package_id,data_type,City,County,state,crash_date,report_number,report_type,RFI,File_org_name,control_number,Extracted_Count,No_Of_Units,Doc_Title,DC_Name,QC_By,QA_By,Updated_by,Received_Date) values('${valueArrayN[0].toString().split(',')[i]}','${valueArrayN[1].toString().split(',')[i]}','${valueArrayN[2].toString().split(',')[i]}','${valueArrayN[3].toString().split(',')[i]}','${valueArrayN[4].toString().split(',')[i]}','${valueArrayN[5].toString().split(',')[i]}','${valueArrayN[6].toString().split(',')[i]}','${valueArrayN[7].toString().split(',')[i]}','${valueArrayN[8].toString().split(',')[i]}','${valueArrayN[9].toString().split(',')[i]}','${valueArrayN[10].toString().split(',')[i]}','${valueArrayN[11].toString().split(',')[i]}','${valueArrayN[12].toString().split(',')[i]}','${valueArrayN[13].toString().split(',')[i]}','${valueArrayN[14].toString().split(',')[i].replace('.xlsx', '.PDF')}','${valueArrayN[15].toString().split(',')[i]}','${valueArrayN[16].toString().split(',')[i]}','${valueArrayN[17].toString().split(',')[i]}','${valueArrayN[18].toString().split(',')[i]}','${valueArrayN[19].toString().split(',')[i]}','${valueArrayN[20].toString().split(',')[i]}','${valueArrayN[21].toString().split(',')[i]}','${user}','${receivedDate}')`;

                            //console.log(`Query  ---> ${query2}`);
                            pool.request().query(query2).then(function (result, err) {
                                //console.log(result);
                                if (err) {
                                    console.log(err);
                                }
                            })
                        }

                    });
                } catch (err) {
                    console.log(err);
                }
            })

        }
    })
});
app.post("/pdf", async (req, res) => {

    if (req.url == '/pdf') {
        var form = new formidable.IncomingForm();
        //console.log(form);        
        form.parse(req, async (err, fields, files) => {
            try {
                console.log("Hi");
                var old = await files.myfile.path;
                const newpath = __dirname + '/src/assets/FL/' + files.myfile.name;
                mv(old, newpath, function (err) {
                    if (err) return console.error(err)
                    console.log("success!")
                })
            } catch (err) {
                console.log(err);
            }
        })
    }

});
app.post("/getdeliveryFilesCount", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);
        let _deltype = req.body.type;
        let _delrecdatefrom = req.body.recdatefrom;
        let _delrecdateto = req.body.recdateto

        let qr;

        if (_deltype != '' && _delrecdatefrom != '' && _delrecdateto != '') {
            qr = "Select *,Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging].[dbo].[Accident] where Received_Date between '" + _delrecdatefrom + "' and '" + _delrecdateto + "' and Metro_Type = '" + _deltype + "' and File_Status ='COMP';"
        }
        else if (_delrecdateto != '' && _delrecdatefrom != '' && (_delrecdatefrom != _delrecdateto)) {
            qr = "Select *,Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging].[dbo].[Accident] where Received_Date = '" + _delrecdatefrom + "' and Metro_Type = '" + _deltype + "' and File_Status ='COMP';"
        }

        else if (_delrecdatefrom == '' && _delrecdateto != '') {
            qr = "Select *,Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging].[dbo].[Accident] where Received_Date = '" + _delrecdateto + "' and Metro_Type = '" + _deltype + "' and File_Status ='COMP';"
        }
        else if (_delrecdatefrom != '' && _delrecdateto == '') {
            qr = "Select *,Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging].[dbo].[Accident] where Received_Date = '" + _delrecdatefrom + "' and Metro_Type = '" + _deltype + "' and File_Status ='COMP';"
        }
        else if (_delrecdatefrom == _delrecdateto) {
            qr = "Select *,Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging].[dbo].[Accident] where Received_Date = '" + _delrecdatefrom + "' and Metro_Type = '" + _deltype + "' and File_Status ='COMP';"
        }

        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            console.log(qr);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getDeliveryRecDate", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        qr = "  Select Distinct Convert(varchar,Received_Date,23) as Receiveddelivery from [CarFax_Staging2_Hold].[dbo].[Accident] order by Receiveddelivery desc;"

        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log(qr);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/xmlConvert", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log('req',req.body);

        let _file = req.body.file;
        let _user = req.body.user;
        
        console.log(_file);   

        for (var i = 0; i < _file.length; i++) {
            let recdt = _file[i].recivedDate.toString().split('T')[0].replace(/[-]/g, '_');
            console.log(recdt);
            let month = recdt.substring(5,7);
            let file = '';
            console.log('month',month);
            if(month == '01'){
                file = "http://172.17.30.56:80/carfaxinputs/January_2022/" + _file[i].Metro_Type + '/' + recdt + '/' + _file[i].File_org_name;
            console.log(file);
            }
            else if(month == '02'){
                file = "http://172.17.30.56:80/carfaxinputs/February_2022/" + _file[i].Metro_Type + '/' + recdt + '/' + _file[i].File_org_name;
            console.log(file);
            }
            else if(month == '03'){
                file = "http://172.17.30.56:80/carfaxinputs/March_2022/" + _file[i].Metro_Type + '/' + recdt + '/' + _file[i].File_org_name;
            console.log(file);
            }
            else if(month == '04'){
                file = "http://172.17.30.56:80/carfaxinputs/April_2022/" + _file[i].Metro_Type + '/' + recdt + '/' + _file[i].File_org_name;
            console.log(file);
            }
            else if(month == '05'){
                file = "http://172.17.30.56:80/carfaxinputs/May_2022/" + _file[i].Metro_Type + '/' + recdt + '/' + _file[i].File_org_name;
            console.log(file);
            }
            
            var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
            const filePath = path.join(DOWNLOAD_DIR);
            download(file, filePath).then(() => { console.log('Download Completed'); })

        }
        for (var i = 0; i < _file.length; i++) {

            var request = new sql.Request();
            request.input('id', _file[i].uid)
            request.input('PDF_Name', _file[i].pdfname)

            qr = `Insert into [CarFax_Staging2_Hold].[dbo].[UIDs_user] (id,PDF_Name,[User]) values('${_file[i].uid}','${_file[i].pdfname}','${_user}'); `
            console.log(`Query  ---> ${qr}`);
            pool.request().query(qr).then(function (result, err) {
                console.log(result);
                console.log(qr);
                res.status(200);
            })
        }
        let qr1 = "Exec SD_SP_XML_Creation_user '" + _user + "'";
        pool.request().query(qr1).then(function (result, err) {
            console.log(qr1);
            res.status(200);
            let result1 = result.recordset;
            for (var i = 0; i < result1.length; i++) {
                let xml2 = result1[i].xmlmemo;
                let orgname = result1[i].Org_filename;
                let pdfname = result1[i].PDFname

                var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');
                const filePath = path.join(DOWNLOAD_DIR);

                fs.writeFileSync(filePath + pdfname.replace('.PDF', '.') + 'xml', xml2, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });

                //   fs.copyFile('http://172.17.30.56:80/carfaxinputs/January_2022/'+_type+'/'+_recvdate +'/'+orgname, 'D:/xmls/',  (err) => {
                //     if(err) throw err;
                //     console.log('Moved!');                               
                //   }); 

            } return res.json({
                "msg": "Download Completed"
            })

        })
        // const file = 'http://172.17.30.56:80/carfaxinputs/January_2022/'+_type+'/'+_recvdate +'/'+orgname;
        //           const filePath = `${__dirname}/xmls`;
        //           download(file,filePath).then(() => {console.log('Download Completed');})         

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getService", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        qr = "select Distinct Region from [CarFax_Staging2_Hold].[dbo].[tbl_statecodes];select Distinct Statename,Shortname from [CarFax_Staging2_Hold].[dbo].[tbl_statecodes];  Select DIstinct agency_ori from [CarFax_Staging].[dbo].[Accident];Select DIstinct State from [CarFax_Staging].[dbo].[Accident];"

        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            console.log(qr);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});

app.post("/getMISData", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);
        console.log(req.body);
        let _empid = req.body.misuserid;
        let _empname = req.body.misusername;
        let _receiveddatefrom = req.body.receiveddatefrom;
        let _receiveddateto = req.body.receiveddateto;
        let _step = req.body.step;
        let _service = req.body.service;
        let _state = req.body.state;
        let _misdcname = req.body.misdcname;
        let _misqcname = req.body.misqcname;
        let _misqaname = req.body.misqaname;
        let _mistlname = req.body.mistlname;
        let _mistype = req.body.mistype;

        let qr;
        if (_mistlname == undefined && _step == 'Received' && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_mistlname == undefined && _step == 'Received') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _misdcname != undefined && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _misdcname != undefined && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _misqcname != undefined && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _misqcname != undefined && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _mistlname != undefined && _misdcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _mistlname != undefined && _misdcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _mistlname != undefined && _misqcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'Received' && _mistlname != undefined && _misqcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_mistlname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_mistlname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _misdcname != undefined && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _misdcname != undefined && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname != undefined && _misdcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname != undefined && _misdcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + _misdcname + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'DC' && _mistlname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname == undefined && _misqcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname == undefined && _misqcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname != undefined && _misqcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname != undefined && _misqcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + _misqcname + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QC' && _mistlname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname == undefined && _misqaname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _misqaname + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname == undefined && _misqaname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + _misqaname + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname != undefined && _misqcname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _misqaname + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname != undefined && _misqcname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + _misqaname + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'QA' && _mistlname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'Shipment' && _mistlname == undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Shipment' && _mistlname == undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistype + "'";
        }
        else if (_step == 'Shipment' && _mistlname != undefined && _state == 'ALL') {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + "%" + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }
        else if (_step == 'Shipment' && _mistlname != undefined) {
            qr = "Exec SD_SP_MIS_maps_export1 '" + _empid + "','" + _empname + "','" + _receiveddatefrom + "','" + _receiveddateto + "','" + _step + "','" + _service + "','" + _state + "','" + "%" + "','" + "%" + "','" + "%" + "','" + _mistlname + "','" + _mistype + "'";
        }

        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");            
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getFileStatusReport", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);
        let _fromdate = req.body.recdfrom;
        let _todate = req.body.recdto;
        let qr;
        msg = "Please Select Dates"

        if (_fromdate == '' && _todate == '') {
            msg;

        }
        else {
            qr = `Exec SD_SP_FileStatus_view '${_fromdate}','${_todate}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select Dates"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
exports.missync = app.post("/misSync", async (req, res, cb) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigmis);
        console.log(req.body.step);
        let _row = req.body.misdataRow;
        let _step = req.body.step;
        let _user = req.body.user;
        let _timetaken = req.body.timehrs;
        let _shiptime = req.body.shiptime;
        var lengthofrow = _row.length;
        exports.lengthofrow = lengthofrow;
        //let countofrow = _row.length;                        
        console.log("rowlength=" + lengthofrow);
        console.log("length=" + _row.length);       

            //console.log("month="+_row[i].month);
            if (_row.length > 0) {
                if (_step == "YTS") {
                    console.log("YTS Started");                    
                    processflow._YTS(_row);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }                  
                }
                else if (_step == "Inventory") {
                    console.log("Inventory Started");                    
                    processflow._YTS(_row);
                    processflow._Inventory(_row, _timetaken, _user, _row.length);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }  
                
                }
                else if (_step == "Data Entry" || _step == "Review") {
                    console.log("Data Entry Started");                    
                    processflow._YTS(_row);
                    console.log("rowdcname="+_row.DC_name);
                    processflow._Inventory(_row, _row.DC_Time, _row.DC_name, _row.length);
                    processflow._DataEntry(_row);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }       

                }
                else if (_step == "QC" || _step == "QC/QA") {
                    console.log("QC step started");
                    processflow._YTS(_row);                    
                    processflow._Inventory(_row, _row.DC_Time, _row.DC_name, _row.length);
                    processflow._DataEntry(_row);
                    processflow._QC(_row);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }     
                }
                else if (_step == "QA") {                    
                    processflow._YTS(_row);                    
                    processflow._Inventory(_row, _row.DC_Time, _row.DC_name, _row.length);
                    processflow._DataEntry(_row);
                    processflow._QC(_row);
                    console.log("QA step started");
                    processflow._QA(_row);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }  
                    }
                else if (_step == "Shipment") {
                    processflow._YTS(_row);                    
                    processflow._Inventory(_row, _row.DC_Time, _row.DC_name, _row.length);
                    processflow._DataEntry(_row);
                    processflow._QC(_row);                    
                    processflow._QA(_row);
                    console.log("Shipment step started");
                    processflow._Shipment(_row,_shiptime,_user,_row.length);
                    if (res.recordset != '') {
                        return res.status(200).send({
                            'msg': _step + '-' + _row.length + ' records -' + "completed"
                         });                        
                        
                    } else {
                        return res.status(500).send({
                        'msg': _step + '-' + "Please Check"
                    });  
                 }  
                    
                }

            }
        

    } catch (err) {
         cb(err);
    }
});
app.post("/getAgencyori", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        let qr = "select Distinct agency_ori from [CarFax_Staging].[dbo].[Accident] order by agency_ori ASC";
        //console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);
            res.status(200).json(result);
        })

    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/ascWiseStatusReport", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);
        let _agency = req.body.agencyori;
        let _name = req.body.name;
        let qr;
        msg = "Please Select agencyORI & ASCName"

        if (_agency == undefined && _name == undefined) {
            msg;

        }
        else {
            qr = `Exec SD_SP_Asc_Overall_Status '${_agency}','${_name}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select agencyORI & ASCName"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/ascWiseDailyStatusReport", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);
        let _todatereceived = req.body.recdtodate;
        let _nameofuser = req.body.nameselected;
        let qr;
        msg = "Please Select Todate & ASCName"

        if (_todatereceived == '' && _nameofuser == undefined) {
            msg;

        }
        else {
            qr = `Exec SD_SP_AscWise_Daily_status '${_todatereceived}','${_nameofuser}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select Todate & ASCName"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getCurrentAllotments", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);
        let _state = req.body.state;
        let _agency = req.body.agency;
        let _type = req.body.type;
        let _commerce = req.body.commerce;
        let qr;
        let msg = "";

        if (_state == undefined && _agency == undefined && _type == undefined) {
            msg;

        }
        else if (_state == 'ALL') {
            qr = `Exec SD_SP_Current_Allotments_new '%','${_agency}','True','${_type}','${_commerce}'`;
        }
        else {
            qr = `Exec SD_SP_Current_Allotments_new '${_state}','${_agency}','True','${_type}','${_commerce}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select State,MetroType & AgencyORI"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getOverview", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);

        let _agencyori = req.body.agencyori;
        let _typemetro = req.body.typemetro;
        let _commerce = req.body.commerce;
        let qr;
        let msg = "";

        if (_agencyori == undefined && _typemetro == undefined && _commerce == undefined) {
            msg;
        }
        else {
            qr = `Exec SD_SP_Overview_Final_web '${_agencyori}','${_typemetro}','${_commerce}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select MetroType & AgencyORI"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getCompletedCount", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);

        let _recdfromdate = req.body.recdfrom;
        let _recdtodate = req.body.recdto;
        let _state = req.body.state;
        let _agencyori = req.body.agencyori;
        let _typemetro = req.body.typemetro;
        let _commerce = req.body.commerce;
        let qr;
        let msg = "";

        if (_agencyori == undefined && _typemetro == undefined && _recdfromdate == '' && _recdtodate == '') {
            msg;
        }
        else if (_state == 'ALL') {
            qr = `Exec SD_SP_Completed_Count_new '${_recdfromdate}','${_recdtodate}','%','${_agencyori}','True','${_typemetro}','${_commerce}'`;
        }
        else {
            qr = `Exec SD_SP_Completed_Count_new '${_recdfromdate}','${_recdtodate}','${_state}','${_agencyori}','True','${_typemetro}','${_commerce}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select Dates,MetroType & AgencyORI"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getAgencyWise", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);

        let _recdfromdate = req.body.recdfrom;
        let _recdtodate = req.body.recdto;
        let _agencyori = req.body.agencyori;
        let _typemetro = req.body.typemetro;
        let qr;
        let msg = "";

        if (_agencyori == undefined && _typemetro == undefined && _recdfromdate == '' && _recdtodate == '') {
            msg;
        }
        else {
            qr = `Exec SD_SP_County_Wise_Status '${_recdfromdate}','${_recdtodate}','${_agencyori}','${_typemetro}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select Dates,MetroType & AgencyORI"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getRejectedFiles", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);

        console.log(req.body);

        let _type = req.body.metro;
        let _opselected = req.body.opselect;
        let _recdfromdate = req.body.recdfrom;
        let _recdtodate = req.body.recdto;
        let _agencyori = req.body.agencyori;
        let _state = req.body.state;
        let _commerce = req.body.commerce;
        let qr;
        let msg = "";

        if (_agencyori == undefined && _opselected == undefined && _recdfromdate == '' && _recdtodate == '') {
            msg;
        }
        else if (_state == 'ALL' && _opselected == 'Rejected Count' && _agencyori == 'ALL') {
            qr = `Exec SD_SP_Rejected_data_new '${_opselected}', '${_recdfromdate}','${_recdtodate}','%','%','${_type}','${_commerce}'`;
        }
        else if (_state == 'ALL' && _opselected == 'Pending Rejections' && _agencyori == 'ALL') {
            qr = `Exec SD_SP_Rejected_data_new '${_opselected}', '${_recdfromdate}','${_recdtodate}','%','%','${_type}','${_commerce}'`;
        }
        else if (_opselected == 'Rejected Count') {
            qr = `Exec SD_SP_Rejected_data_new '${_opselected}', '${_recdfromdate}','${_recdtodate}','${_state}','${_agencyori}','${_type}','${_commerce}'`;
        }
        else if (_opselected == 'Pending Rejections') {
            qr = `Exec SD_SP_Rejected_data_new '${_opselected}', '${_recdfromdate}','${_recdtodate}','${_state}','${_agencyori}','${_type}','${_commerce}'`;
        }
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Select Dates,Options & AgencyORI"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getSates", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC') {
            qr = "Select State from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by State ";
        }
        else if (_step == 'DC') {
            
            qr = "Select State from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by State";
        }
        else if (_step == 'QA') {
            qr = "select State from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by State";
        }
        else
            qr = "select State from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"' group by State";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getAgencyoriwork", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let qr3;
        let msg = "";

         if (_step == 'DC' && _state == undefined) {
            
            qr3 = "Select agency_ori from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by agency_ori";
        }
        else if (_step == 'QC' && _state == undefined) {
            qr3 = "Select agency_ori from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by agency_ori ";
        }        
        else if (_step == 'QA' && _state == undefined) {
            qr3 = "select agency_ori from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by agency_ori";
        }
        else if (_step == 'DC' && _state != undefined) {
            
            qr3 = "Select agency_ori from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state LIKE '"+_state+"' group by agency_ori";
        }
        else if (_step == 'QC' && _state != undefined) {
            qr3 = "Select agency_ori from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state LIKE '"+_state+"' group by agency_ori ";
        }
        else if (_step == 'QA' && _state != undefined) {
            qr3 = "select agency_ori from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' and state LIKE '"+_state+"' group by agency_ori";
        }        
        
        pool.request().query(qr3).then(function (result, err) {
            console.log(`Query  ---> ${qr3}`);
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }   
            res.status(200).json(result);        
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getRecedDate", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC' && _state == undefined && _agency == undefined) {
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by Received_Date order by Received_Date desc ";
        }
        else if (_step == 'DC'&& _state == undefined && _agency == undefined ) {
            
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'QA' && _state == undefined && _agency == undefined) {
            qr = "select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by Received_Date order by Received_Date desc ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by Received_Date order by Received_Date desc ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'DC' && _state != undefined && _agency != undefined) {
            
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by Received_Date order by Received_Date desc";
        }
        else if (_step == 'QC' && _state != undefined && _agency != undefined) {
            qr = "Select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by Received_Date order by Received_Date desc ";
        }
        else if (_step == 'QA' && _state != undefined && _agency != undefined) {
            qr = "select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"' and agency_ori = '"+_agency+"' group by Received_Date order by Received_Date desc";
        }
        else
            qr = "select CONVERT(varchar,Received_Date,23) as ReceivedDate from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"'  group by Received_Date order by Received_Date desc";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getdcNamework", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC' && _state == undefined && _agency == undefined) {
            qr = "Select DC_Name from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by DC_Name ";
        }
        else if (_step == 'DC'&& _state == undefined && _agency == undefined ) {
            
            qr = "Select DC_Name from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by DC_Name";
        }
        else if (_step == 'QA' && _state == undefined && _agency == undefined) {
            qr = "select DC_Name from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by DC_Name";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select DC_Name from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Name";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select DC_Name from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Name ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select DC_Name Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by DC_Name";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select DC_Name from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Name";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select DC_Name from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Name ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select DC_Name from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by DC_Name";
        }
        else if (_step == 'DC' && _state != undefined && _agency != undefined) {
            
            qr = "Select DC_Name from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Name";
        }
        else if (_step == 'QC' && _state != undefined && _agency != undefined) {
            qr = "Select DC_Name from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Name";
        }
        else if (_step == 'QA' && _state != undefined && _agency != undefined) {
            qr = "select DC_Name from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Name";
        }
        else
            qr = "select DC_Name from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"'  group by DC_Name";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getdcCompdatework", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC' && _state == undefined && _agency == undefined) {
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by DC_Comp_Date ORDER BY DC_Comp_Date ";
        }
        else if (_step == 'DC'&& _state == undefined && _agency == undefined ) {
            
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'QA' && _state == undefined && _agency == undefined) {
            qr = "select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined && _agency != undefined) {
            
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined && _agency != undefined) {
            qr = "Select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else if (_step == 'QA' && _state != undefined && _agency != undefined) {
            qr = "select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"' and agency_ori = '"+_agency+"' group by DC_Comp_Date ORDER BY DC_Comp_Date";
        }
        else
            qr = "select CONVERT(varchar,DC_Comp_Date,23)DCComp_Date from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"'  group by DC_Comp_Date ORDER BY DC_Comp_Date";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getQcNamework", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC' && _state == undefined && _agency == undefined) {
            qr = "Select QC_by from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by QC_by ";
        }
        else if (_step == 'DC'&& _state == undefined && _agency == undefined ) {
            
            qr = "Select QC_by from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by QC_by";
        }
        else if (_step == 'QA' && _state == undefined && _agency == undefined) {
            qr = "select QC_by from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by QC_by";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select QC_by from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_by";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select QC_by from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_by ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select QC_by Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by QC_by";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select QC_by from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_by";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select QC_by from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_by ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select QC_by from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by QC_by";
        }
        else if (_step == 'DC' && _state != undefined && _agency != undefined) {
            
            qr = "Select QC_by from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_by";
        }
        else if (_step == 'QC' && _state != undefined && _agency != undefined) {
            qr = "Select QC_by from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_by";
        }
        else if (_step == 'QA' && _state != undefined && _agency != undefined) {
            qr = "select QC_by from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_by";
        }
        else
            qr = "select QC_by from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"'  group by QC_by";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getQcCompdatework", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);

        console.log(req.body);
        let _step = req.body.step;
        let _commerce = req.body.commerce;
        let _type = req.body.type;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let qr;
        let msg = "";

        if (_step == '' && _commerce == '' && _type == '') {
            msg;
        }
        else if (_step == 'QC' && _state == undefined && _agency == undefined) {
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date  from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by QC_Comp_Date ORDER BY QC_Comp_Date ";
        }
        else if (_step == 'DC'&& _state == undefined && _agency == undefined ) {
            
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'QA' && _state == undefined && _agency == undefined) {
            qr = "select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"' group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined ) {
            
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined ) {
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date ";
        }
        else if (_step == 'QA' && _state != undefined ) {
            qr = "select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'DC' && _state != undefined && _agency != undefined) {
            
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where  (DC_Name is null or DC_Name = '') AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'QC' && _state != undefined && _agency != undefined) {
            qr = "Select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QC_By is null or QC_By = '') AND DC_Status = 'COMP' AND Commerce_Type = '" + _commerce + "' and Metro_Type = '"+_type+"' and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else if (_step == 'QA' && _state != undefined && _agency != undefined) {
            qr = "select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where (QA_by is null or QA_by='') and Commerce_Type='" + _commerce + "'  and QC_status='COMP' and Metro_Type = '"+_type+"'  and state = '"+_state+"' and agency_ori = '"+_agency+"' group by QC_Comp_Date ORDER BY QC_Comp_Date";
        }
        else
            qr = "select CONVERT(varchar,QC_Comp_Date,23)QCComp_Date from Accident where QA_status='COMP' and Commerce_Type='" + _commerce + "'  and Shipment is null and Metro_Type = '"+_type+"'  group by QC_Comp_Date ORDER BY QC_Comp_Date";
        
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
            //console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please Check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getShipmentData", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfigstaging);
        console.log(req.body);
        let _commerce = req.body.commerce;
        let _state = req.body.state;
        let _agency = req.body.agency;
        let _dcname = req.body.dcname;
        let _qcname = req.body.qcname;
        let _dccompdate = req.body.dccompdate;
        let _qccompdate = req.body.qccompdate;
        let _receiveddate = req.body.receiveddate;
        let _type = req.body.type;

        let strCond = '';
                if (_commerce != "Select" && _commerce != "")
                {
                    strCond = "and Commerce_Type='" + _commerce + "'";

                }
            
                qry = "Select * from Accident where QA_Status='COMP' and (Shipment is null) " + strCond + "and Metro_Type= '"+_type+"' " ;

                pool.request().query(qry).then(function (result, err) {
                    console.log('Qry=',qry);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please Check"
                        })
                    }
                    res.status(200).json(result);
                })
            

    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/shipmentUpdate", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _row = req.body.row;
        let _shipmentdate = req.body.shipmentdate;
        let _user = req.body.user;
        
        for(let i=0;i<_row.length;i++){

        let fileorg = _row[i].File_org_name;

        qry = "Update Accident set Shipment_By='"+_user+"',Shipment='" + _shipmentdate + "' where File_org_name = '"+fileorg+"'" ;

                pool.request().query(qry).then(function (result, err) {
                    console.log('Qry=',qry);                    
                    //console.log(result);            
                    if (result.rowsAffected < 0) {
                        return res.json({
                            'msg': "Please Check"
                        })
                    }
                    else  {
                        return res.json({
                            'msg': "Shipment Updated"
                        })
                    }
                    
                })
            }         
            

    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/assignMe", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _type = req.body.metro;
        let _commerce = req.body.commerce;
        let _req=req.body.required;
        let _userId=req.body.userid;
        let _step=req.body.stepName;
        let msg = "";
        let qr;
        let where = '';
        let type = '';
        let commerce = '';
        if (_type == "Metro") {
            if (type == "")
                type = "(Metro_Type =''" + _type + "'')";
            else
                type = type + "And (Metro_Type = ''" + _type + "'')";
        }
        if (_type == "Non-METRO") {
            if (type == "")
                type = "(Metro_Type = ''" + _type + "'')";
            else
                type = type + "And (Metro_Type = ''" + _type + "'')";
        }
        if (_commerce == "Ecommerce") {
            if (commerce == '')
                commerce = "(Commerce_type = ''" + _commerce + "'')";
            else
                commerce = commerce + "And (Commerce_type = ''" + _commerce + "'')";
        }
        if (_commerce == "Non-Ecommerce") {
            if (commerce == '')
                commerce = "(Commerce_type = ''" + _commerce + "'')";
            else
                commerce = commerce + "And (Commerce_type = ''" + _commerce + "'')";
        }
       
        if (_step == "DC") {
            if (where == "")
                where = "(DC_Name='''' or DC_Name is null)";
            else
                where = where + " And (DC_Name='''' or DC_Name is null)";
        }
        if (_step == "QC") {
            if (where == "")
                where = "(QC_By='''' or QC_By is null)";
            else
                where = where + " And (QC_By='''' or QC_By is null)";
        }
        if (_step == "QA") {
            if (where == "")
                where = "(QA_By='''' or QA_By is null)";
            else
                where = where + " And (QA_By='''' or QA_By is null)";
        }
     
        
let  qr1 = "select Limit  from  tbl_selfallot_limit";
pool.request().query(qr1).then(function (result, err) {
    console.log(`Query  ---> ${qr1}`);
if(result.recordset[0].Limit <= 20 ){
    qr = `EXEC SD_SP_Bulkallotment '${_step}','${_req}','${where}','${_userId}'`;
    console.log(`Query  ---> ${qr}`);
    pool.request().query(qr).then(function (result, err) {
        if (result.rowsAffected < 0) {
            return res.json({
                'msg': "Please Check"
            })
        }
        else{
            return res.json({
                'msg': "Self allotment Successfully Updated"
            })
        }
    });
}
else{
    return res.json({
    'msg':"Please give me valid Limit"
    });
}
});
 
    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getUserAccountbility", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _from = req.body.from;
        let _to = req.body.to;
        let _userId = req.body.userId;
        let qr;
       
        qr = `Exec SD_SP_UserAccountability_Daywise_Web '${_from}','${_to}','${_userId}'`;
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
           // console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/getTimebyUser", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _type = req.body.type;
        let _from = req.body.from;
        let _to = req.body.to;
        let _userId = req.body.userId;
        let _search = req.body.search;
        let qr;
       
        qr = `Exec GetTimeByUser '${_type}','${_from}','${_to}','${_userId}','${_search}'`;
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
           // console.log(result);            
            if (result.recordset == undefined) {
                return res.json({
                    'msg': "Please check"
                })
            }
            res.status(200).json(result);
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/UpdateAllByUser", async (req, res) => {
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _ids = req.body.ids;
        let _time = req.body.time;
        let _step = req.body.step;
        let _error= 0;   // ouput parameter
        let qr;
       
        qr = `Exec UpdateTimeByUser '${_ids}','${_time}','${_step}','${_error }'`;
        console.log(`Query  ---> ${qr}`);
        pool.request().query(qr).then(function (result, err) {
            //console.log("*** Data successfully returned *** ");
        console.log(result);  
        if (result.rowsAffected > 0) {
            return res.json({
                'msg': "Updated Successfully"
            })
        }
        res.status(200).json(result);          
        
        })


    } catch (err) {
        if (err) console.log(err);
    }
});
app.post("/ddlSteps", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _commerce = req.body.commerce;
        let _revFrom = req.body.revFrom;
        let _revTo = req.body.revTo;
        let _metroType = req.body.metroType;
       
        qr =   `Exec ddlStates '${_revFrom}','${_revTo}','${_commerce}','${_metroType }'`;
        
        pool.request().query(qr).then(function (result, err) {
                    console.log('Qry=',qr);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please check"
                        })
                    }
                    res.status(200).json(result);
                })
    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/ddlAgencyOri", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _commerce = req.body.commerce;
        let _state = req.body.state;
        let _revFrom = req.body.revFrom;
        let _revTo = req.body.revTo;
        let _metroType = req.body.metroType;
       
        qr =   `Exec ddlAgencyOri '${_revFrom}','${_revTo}','${_commerce}','${_state}','${_metroType }'`;
        
        pool.request().query(qr).then(function (result, err) {
                    console.log('Qry=',qr);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please check"
                        })
                    }
                    res.status(200).json(result);
                })
    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/getassociates", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        qr =   `Exec associates`;
        pool.request().query(qr).then(function (result, err) {
                    console.log('Qry=',qr);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please check"
                        })
                    }
                    res.status(200).json(result);
                })
    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/getSearchData", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _commerce = req.body.commerce;
        let _state = req.body.state;
        let _revFrom = req.body.revFrom;
        let _revTo = req.body.revTo;
        let _delFrom = req.body.delFrom;
        let _delTo = req.body.delTo;
        let _agency = req.body.agency;
        let _reportType = req.body.reportType;
        let _alreadyDeliver = req.body.alreadyDeliver;
        let _qcBy = req.body.qcBy;
        let _qaBy = req.body.qaBy;
        let _metroType = req.body.metroType;
        qr =   `Exec GetSearchViewAndDelivery '${_revFrom}','${_revTo}','${_delFrom}','${_delTo}','${_commerce}','${_state}','${_agency}','${_reportType}','${_alreadyDeliver}','${_qcBy}','${_qaBy}','${_metroType }'`;
        pool.request().query(qr).then(function (result, err) {
                    console.log('Qry=',qr);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please check"
                        })
                    }
                    res.status(200).json(result);
                })
    } catch (err) {
        if (err) console.log(err);
    }

})
app.post("/GetviewAndDeliveryForAll", async (req, res) =>{
    try {
        let pool = await mssql.GetCreateIfNotExistPool(config.sqlConfig);
        console.log(req.body);
        let _ids = req.body.ids;
        qr =   `Exec getViewAndDelivry_Passengers '${_ids}'`;
        pool.request().query(qr).then(function (result, err) {
                    console.log('Qry=',qr);                    
                    //console.log(result);            
                    if (result.recordset == undefined) {
                        return res.json({
                            'msg': "Please check"
                        })
                    }
                    res.status(200).json(result);
                })
    } catch (err) {
        if (err) console.log(err);
    }

})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log('Order API is runnning at ' + port);
module.exports = app;