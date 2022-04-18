const express = require('express');
const servercarfax = require('./carfaxserver');
const sql = require('mssql');
let mssql = require('./src/mssql-connection-pooling.js');
var os = require("os");
var hostname = os.hostname();

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
let sqlConfigstaging = {
    user: 'hyper',
    password: 'hyper@123',
    server: '172.27.74.23',
    database: 'CarFax_Staging',
    trustedConnection: true,
    options: { encrypt: false }
};
const _YTS = async function (_row) {
    let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
    let msg = '';
    let error = '';
    for (let i = 0; i < _row.length; i++) {
        var request = new sql.Request();
        request.input('EmpID', _row[i].EmpID);
        request.input('Region', _row[i].Area);
        request.input('ProjName', _row[i].Area);
        request.input('Datec', _row[i].Datec);
        request.input('Process', _row[i].Process);
        request.input('Area', _row[i].Area);
        request.input('Batch', _row[i].Batch);
        request.input('Typeofmap', _row[i].Typeofmap);
        request.input('Map', _row[i].Map);
        request.input('Foldername', _row[i].Foldername);
        request.input('priority', _row[i].Priority);
        request.input('Recevdfrom', _row[i].Recevdfrom);
        request.input('Recevdby', _row[i].Recevdby);
        request.input('instDate', _row[i].instdate);
        request.input('totalKMS', _row[i].TotalKMS);
        request.input('allotedTo', _row[i].Allotedto);
        request.input('scale', _row[i].Scale);
        request.input('PropShipmentDate', _row[i].Propshipdate);
        request.input('GL', _row[i].GL);
        request.input('Taskmanager', _row[i].Taskmanager);
        request.input('planned_month', _row[i].month);
        var qr1 = `Exec Inserting_Into_Maps_Pasteerrors_Sp '${_row[i].EmpID}','${_row[i].Datec}';`
        console.log(`Query  ---> ${qr1}`);
        pool.request().query(qr1).then(function (result, err) {
            console.log(result);
            //console.log(res);        
            var mon = new Date();
            var mm = mon.toLocaleString('default', { month: 'long' })
            var yyyy = mon.getFullYear();
            var gettomonth = mm + '-' + yyyy;
            console.log("Month" + gettomonth);
            let qr = `Insert into tbl_tmp_maps (EmpID,Datec,Process,Area,Batch,Typeofmap,Map,Foldername,priority,Recevdfrom,instDate,totalKMS,allotedTo,scale,PropShipmentDate,GL,Taskmanager) values('${_row[i].EmpID}','${_row[i].Datec}','${_row[i].Process}','${_row[i].Area}','${_row[i].Batch}','${_row[i].Typeofmap}','${_row[i].Map}','${_row[i].Foldername}','${_row[i].Priority}','${_row[i].Recevdfrom}','${_row[i].instdate}','${_row[i].TotalKMS}','${_row[i].Allotedto}','${_row[i].Scale}','${_row[i].Propshipdate}','${_row[i].GL}','${_row[i].Taskmanager}'); `
            pool.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`);
                //console.log("*** Data successfully returned *** ");
                console.log(result);
                if(result.rowsAffected[0] < 0 || result.rowsAffected[0] == undefined){
                    return err;
                }
                else{                
                let qrr = `Exec Maps_OS_Insert_Sp '${_row[i].EmpID}','${_row[i].Datec}','1'`;
                pool.request().query(qrr).then(function (result,err){
                    console.log(`Query ----> ${qrr}`);
                    if(result.rowsAffected[0] < 0 || result.rowsAffected[0] == undefined){
                        return err;
                    }
                    else{                    
                    let qr1 = `Exec Inserting_Into_Maps_Sp_new '${_row[i].EmpID}','${_row[i].Datec}','${gettomonth}','1';`
                    pool.request().query(qr1).then(function (result,err){
                        console.log(`Query ----> ${qrr}`); 
                        if(result.rowsAffected[0] < 0 || result.rowsAffected[0] == undefined){
                            return err;
                        }
                        else{                        
                        let qr2 = `Exec Deleting_tmp_maps '${_row[i].EmpID}','${_row[i].Datec}','1';`
                        pool.request().query(qr2).then(function (result, err) {
                            console.log(`Query  ---> ${qr2}`);                            
                            console.log("YTS Completed");
                            //console.log("hostname="+hostname);                            
                        })
                    } 
                    })
                }
                })
                }            
            }) 
                              
        })
    }
}
const _Inventory = async function (_row, timetaken, user, noofrows) {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
        let pool1 = await mssql.GetCreateIfNotExistPool(sqlConfigstaging);
        let msg = '';
        let error = '';
        var mon = new Date();
        var mm = mon.toLocaleString('default', { month: 'long' })
        var yyyy = mon.getFullYear();
        var _Month = mm + '-' + yyyy;
        console.log("Month=" + _Month);
        var _step_no = "1";
        var _step_name = "Inventory";
        var _Shift = "WFH";
        var _status = "Completed";
        var txtphase = "GoLive";
        var Checkversion = '';
        console.log("timetaken=" + timetaken);
        //console.log(user);
        let _time = parseFloat(timetaken / noofrows).toFixed(2);
        console.log("_time= " + _time);
        for (let i = 0; i < _row.length; i++) {
            let _ID = _row[i].UID;
            console.log("_ID=" + _ID);
            let _DC_name = user;
            let empid = _row[i].UserID;
            let txtws = _row[i].Process;
            let _area = _row[i].Area;
            let _Batch = _row[i].Batch;
            let _Map_type = _row[i].Typeofmap;
            let _map = _row[i].Map;
            let _KMS = _row[i].TotalKMS;
            let _count = 0;
            let qr = "Select * from Accident where UID = '" + _ID + "'";
            pool1.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`)
                if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                    return err;
                }
                else{ 
                let Date1 = result.recordset[0].DC_Comp_Date;
                //console.log("date1="+Date1);
                let finalDate = Date1.toISOString().slice(0, 10).replace('T', ' ');
                //console.log("finalDate="+finalDate);
                console.log("_DC_name==" + _DC_name);
                let str3 = "Select * from [CarFax_Staging].[dbo].[Login] where Username = '" + _DC_name + "'";
                pool1.request().query(str3).then(function (result, err) {
                    console.log(`Query  ---> ${str3}`)
                    if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                        return err;
                    }
                    else{ 
                    //console.log(result);
                    let dcname = result.recordset[0].UserID;
                    console.log("dcname=" + dcname);
                    let str2 = `Select * from [CID_MIS_Naren].[dbo].[tbl_employees] where existsc = 1 and empID = '${dcname}';`
                    pool.request().query(str2).then(function version(result, err) {
                        console.log(`Query  ---> ${str2}`);
                        //console.log(result);
                        if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                            return err;
                        }
                        else{
                            let txtwsm = result.recordset[0].taskManager;
                            let txttl = result.recordset[0].glid;
                            //console.log("*** Data successfully returned *** ");
                            // if (recordset.length > 0) {
                            let qr = `Exec SD_SP_getChelistversion '${txtws}','${_area}','${_Batch}';`
                            pool.request().query(qr).then(function (result, err) {
                                console.log(`Query  ---> ${qr}`);
                                console.log(result);
                                if(result.recordset[0].Presentversion == undefined || result.recordset[0].Presentversion == '') {
                                    return err;
                                }
                                else{
                                Checkversion = result.recordset[0].Presentversion;
                                let qr2 = `Exec SD_SP_CurrentStep_Details '${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}','%';`
                                pool.request().query(qr2).then(function (result, err) {
                                    console.log(`Query  ---> ${qr2}`);
                                    //console.log(result);
                                    if(result.recordset[0][""] == '' || result.recordset[0][""] == undefined){
                                        return err;
                                    }
                                    else{
                                    CurrentStep = result.recordset[0][""];
                                    //console.log(Checkversion);
                                    console.log(CurrentStep);
                                    if (CurrentStep == 'Yet to Start') {
                                        let qr = `Select Max(Start_time) as E3Date from E3_timesheets;`
                                        pool.request().query(qr).then(function (res, err) {
                                            console.log(`Query  ---> ${qr}`);
                                            //console.log(res);
                                            if(res.recordset[0].E3Date == 0 || res.recordset[0].E3Date == undefined){
                                                return err;
                                            }
                                            else{
                                            let e3date = res.recordset[0].E3Date;
                                            let e3finaldate = e3date.toISOString().slice(0, 19).replace('T', ' ');
                                            console.log("e3date=" + e3finaldate);
                                            //console.log("finalDate="+finalDate);
                                            if (finalDate > e3finaldate) {
                                                if (Checkversion != '') {
                                                    //console.log("dcname = "+dcname);
                                                    qrr = `Exec SaveChecklist_Info_Sp '${finalDate}','${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}', '${_step_name}','${Checkversion}','${dcname}','Completed','1';`
                                                    pool.request().query(qrr).then(function (res, err) {
                                                        console.log(`Query  ---> ${qrr}`);
                                                        //console.log(res);
                                                        if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                                                            return err;
                                                        }
                                                        else{
                                                            let next = `Exec NextStepDetails_Sp '${txtws}','${_area}','${_Batch}','${_step_no}','${_step_name}','${_status}','';`;
                                                            pool.request().query(next).then(function (result, err) {
                                                                console.log(`Query  ---> ${next}`);
                                                                if(result.recordset[0][''] < 0 || result.recordset[0][''] == undefined){
                                                                    return err;
                                                                }
                                                                else{
                                                                let nextstep = result.recordset[0][''];
                                                                let under = `Select under_costof from tbl_stepname where process='${txtws}' and area='${_area}' and batch='${_Batch}' and step_name='${_step_name}';`
                                                                pool.request().query(under).then(function (result, err) {
                                                                    if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                                                                        return err;
                                                                    }
                                                                    else{
                                                                      let underCost = result.recordset[0].under_costof;                                                                    
                                                                    let qre = `Exec CIDMIS_SavingDailylog_Info_New_Sp '${finalDate}','${_Month}','${_Shift}','${txtwsm}','${txttl}','${dcname}','${txtws}','${_area}','${_Batch}','${_map}','${_Map_type}','${_step_name}','${_step_no}','${underCost}','${_status}','${_time}','${_KMS}','''','${txtphase}','${nextstep}','''','''','''','''','1';`
                                                                    pool.request().query(qre).then(function (result, err) {
                                                                        console.log(`Query  ---> ${qre}`);
                                                                        console.log(result);                                                                        
                                                                        //console.log("id="+_ID);
                                                                        //console.log("finalDate="+finalDate);
                                                                        let request = "Exec MIS_Sync_SavingDailylog1 '" + dcname + "','" + txtws + "','" + _area + "','" + _Batch + "','" + _map + "','" + _Map_type + "','" + _step_name + "','','" + finalDate + "','" + _ID + "','1'";
                                                                        pool1.request().query(request).then(function (result, err) {
                                                                            console.log(`Query  ---> ${request}`);
                                                                            console.log(result);
                                                                            console.log("Inventory Completed");                                                                            
                                                                            if(result.rowsAffected[0] < 0 ||result.rowsAffected[0] == undefined){
                                                                                return err;
                                                                            }
                                                                            else{
                                                                                return msg;
                                                                                }
                                                                                
                                                                        })
                                                                    

                                                                    })
                                                                }

                                                                })
                                                            }

                                                            })

                                                        }


                                                    })
                                                }
                                            }
                                        }
                                        })
                                    }
                                }

                                })
                            }
                            })
                        }

                    })
                }
                })
                }
            })
        }
    } catch (err) {
        console.log(err);
    }
}

const _DataEntry = async function (row) {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
        let pool1 = await mssql.GetCreateIfNotExistPool(sqlConfigstaging);
        let msg = '';
        let error = '';
        var mon = new Date();
        var mm = mon.toLocaleString('default', { month: 'long' })
        var yyyy = mon.getFullYear();
        var _Month = mm + '-' + yyyy;
        console.log("Month=" + _Month);
        var _step_no = '';
        var _step_name = '';
        let _Shift = "WFH";
        let _status = "Completed";
        let txtphase = "GoLive";
        let Checkversion = '';
        for (let i = 0; i < row.length; i++) {
            let timetaken = row[i].DC_Time;
            let _time = parseFloat(timetaken / 60).toFixed(2);
            let _ID = row[i].UID;
            let txtws = row[i].Process;
            let _area = row[i].Area;
            let _Batch = row[i].Batch;
            let _Map_type = row[i].Typeofmap;
            let _map = row[i].Map;
            let _KMS = row[i].TotalKMS;

            let qr = "Select * from Accident where UID = '" + _ID + "'";
            pool1.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`);
                //console.log(result);
                if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                    return err;
                }
                else{
                let _DC_name = result.recordset[0].DC_Name;
                let date = result.recordset[0].DC_Comp_Date;
                console.log("_DC_name=" + _DC_name);
                let qr1 = `Select * from Login where Username = '${_DC_name}'`;
                pool1.request().query(qr1).then(function (result, err) {
                    console.log(`Query  ---> ${qr1}`);
                    //console.log(result);
                    if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                        return err;
                    }
                    else{
                    let empid = result.recordset[0].UserID;
                    let txtdate = date.toISOString().slice(0, 10).replace('T', ' ');
                    console.log(empid);
                    console.log(txtdate);
                    let qr2 = `Select * from [CID_MIS_Naren].[dbo].[tbl_employees] where existsc = 1 and empID = '${empid}'`;
                    pool.request().query(qr2).then(function (result, err) {
                        console.log(`Query  ---> ${qr2}`);
                        //console.log(result);
                        if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                            return err;
                        }
                        else{
                        let txtwsm = result.recordset[0].taskManager;
                        let txttl = result.recordset[0].glid;
                        console.log(txtwsm);
                        console.log(txttl);
                        let qr = `Exec SD_SP_getChelistversion '${txtws}','${_area}','${_Batch}';`
                        pool.request().query(qr).then(function (result, err) {
                            console.log(`Query  ---> ${qr}`);
                            //console.log(result);
                            if(result.recordset[0].Presentversion < 0 || result.recordset[0].Presentversion == undefined){
                                return err;
                            }
                            else{
                            Checkversion = result.recordset[0].Presentversion;
                            let qr2 = `Select currentStep from tbl_maps Where processID = '${txtws}' and area = '${_area}' and batch = '${_Batch}' and mapType = '${_Map_type}' and map = '${_map}';`
                            pool.request().query(qr2).then(function (result, err) {
                                console.log(`Query  ---> ${qr2}`);
                                //console.log(result);
                                if(result.recordset[0].currentStep == '' || result.recordset[0].currentStep == undefined){
                                    return err;
                                }
                                else{
                                CurrentStep = result.recordset[0].currentStep;
                                console.log(Checkversion);
                                console.log(CurrentStep);
                                _step_no = (_area == "Asset") ? "1" : "2";
                                let next = `Exec NextStepDetails_Sp '${txtws}','${_area}','${_Batch}','${_step_no}','${CurrentStep}','${_status}','';`;
                                pool.request().query(next).then(function (result, err) {
                                    console.log(`Query  ---> ${next}`);
                                    if(result.recordset[0][''] < 0 || result.recordset[0][''] == undefined){
                                        return err;
                                    }
                                    else{
                                    let nextstep = result.recordset[0][''];
                                    let under = `Select under_costof from tbl_stepname where process='${txtws}' and area='${_area}' and batch='${_Batch}' and step_name='${CurrentStep}';`
                                    pool.request().query(under).then(function (result, err) {
                                        if(result.recordset[0].under_costof < 0 || result.recordset[0].under_costof == undefined){
                                            return err;
                                        }
                                        else{
                                        let underCost = result.recordset[0].under_costof;
                                        if (CurrentStep == "Data Entry" || CurrentStep == "Review") {
                                            let qr = `Select Max(Start_time) as E3Date from E3_timesheets;`
                                            pool.request().query(qr).then(function (res, err) {
                                                console.log(`Query  ---> ${qr}`);
                                                //console.log(res);
                                                if(res.recordset[0].E3Date < 0 || res.recordset[0].E3Date == undefined){
                                                    return err;
                                                }
                                                else{
                                                let e3date = res.recordset[0].E3Date;
                                                let e3finaldate = e3date.toISOString().slice(0, 19).replace('T', ' ');
                                                if (txtdate > e3finaldate) {
                                                    if (Checkversion != "") {
                                                        qrr = `Exec SaveChecklist_Info_Sp '${txtdate}','${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}', '${CurrentStep}','${Checkversion}','${empid}','Completed','1';`
                                                        pool.request().query(qrr).then(function (res, err) {
                                                            console.log(`Query  ---> ${qrr}`);
                                                            //console.log(res);                                                            
                                                            let qre = `Exec CIDMIS_SavingDailylog_Info_New_Sp '${txtdate}','${_Month}','${_Shift}','${txtwsm}','${txttl}','${empid}','${txtws}','${_area}','${_Batch}','${_map}','${_Map_type}','${CurrentStep}','${_step_no}','${underCost}','${_status}','${_time}','${_KMS}','''','${txtphase}','${nextstep}','''','''','''','''','1';`
                                                            pool.request().query(qre).then(function (result, err) {
                                                                console.log(`Query  ---> ${qre}`);
                                                                //console.log("id="+_ID);
                                                                //console.log("finalDate="+finalDate);
                                                                let request = "Exec MIS_Sync_SavingDailylog1 '" + empid + "','" + txtws + "','" + _area + "','" + _Batch + "','" + _map + "','" + _Map_type + "','" + CurrentStep + "','','" + txtdate + "','" + _ID + "','1'";
                                                                pool1.request().query(request).then(function (result, err) {
                                                                    console.log(`Query  ---> ${request}`);
                                                                    console.log(result);
                                                                    console.log("DataEntry Completed");
                                                                    if (result.rowsAffected != '') {
                                                                        return msg;
                                                                    } else {
                                                                        return error;
                                                                    }
                                                                })

                                                            })

                                                        })
                                                    }
                                                }
                                            }
                                            })

                                        }
                                    }
                                    })
                                }
                                })
                            }
                            })
                        }
                        })
                    }
                    })
                }
                })
            }
            })

        }

    } catch (err) {
        console.log(err);
    }
}

const _QC = async function (row) {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
        let pool1 = await mssql.GetCreateIfNotExistPool(sqlConfigstaging);
        let msg = '';
        let error = '';
        var mon = new Date();
        var mm = mon.toLocaleString('default', { month: 'long' })
        var yyyy = mon.getFullYear();
        var _Month = mm + '-' + yyyy;
        console.log("Month=" + _Month);
        var _step_no = '';
        let _Shift = "WFH";
        let _status = "Completed";
        let txtphase = "GoLive";
        let FeedOperID = '';
        let Checkversion = '';
        for (let i = 0; i < row.length; i++) {
            let timetaken = row[i].QC_Time;
            let _time = parseFloat(timetaken / 60).toFixed(2);
            let _ID = row[i].UID;
            let txtws = row[i].Process;
            let _area = row[i].Area;
            let _Batch = row[i].Batch;
            let _Map_type = row[i].Typeofmap;
            let _map = row[i].Map;
            let _KMS = row[i].TotalKMS;

            let qr = "Select * from Accident where UID = '" + _ID + "'";
            pool1.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`);
                //console.log(result);
                if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                    return err;
                }
                else{
                let _QC_name = result.recordset[0].QC_By;
                let date = result.recordset[0].QC_Comp_Date;
                console.log("_QC_name=" + _QC_name);
                let qr1 = `Select * from Login where Username = '${_QC_name}'`;
                pool1.request().query(qr1).then(function (result, err) {
                    console.log(`Query  ---> ${qr1}`);
                    //console.log(result);
                    if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                        return err;
                    }
                    else{
                    let empid = result.recordset[0].UserID;
                    let txtdate = date.toISOString().slice(0, 10).replace('T', ' ');
                    console.log(empid);
                    console.log(txtdate);
                    let qr2 = `Select * from [CID_MIS_Naren].[dbo].[tbl_employees] where existsc = 1 and empID = '${empid}'`;
                    pool.request().query(qr2).then(function (result, err) {
                        console.log(`Query  ---> ${qr2}`);
                        //console.log(result);
                        if(result.recordset[0] < 0 || result.recordset[0] == undefined){
                            return err;
                        }
                        else{
                        let txtwsm = result.recordset[0].taskManager;
                        let txttl = result.recordset[0].glid;
                        let FeedbackNO = "1";
                        console.log(txtwsm);
                        console.log(txttl);
                        let qr = `Exec SD_SP_getChelistversion '${txtws}','${_area}','${_Batch}';`
                        pool.request().query(qr).then(function (result, err) {
                            console.log(`Query  ---> ${qr}`);
                            //console.log(result);
                            if(result.recordset[0].Presentversion < 0 || result.recordset[0].Presentversion == undefined){
                                return err;
                            }
                            else{
                            Checkversion = result.recordset[0].Presentversion;
                            let qr2 = `Select currentStep from tbl_maps Where processID = '${txtws}' and area = '${_area}' and batch = '${_Batch}' and mapType = '${_Map_type}' and map = '${_map}';`
                            pool.request().query(qr2).then(function (result, err) {
                                console.log(`Query  ---> ${qr2}`);
                                //console.log(result);
                                if(result.recordset[0].currentStep < 0 || result.recordset[0].currentStep == undefined){
                                    return err;
                                }
                                else{
                                CurrentStep = result.recordset[0].currentStep;
                                console.log(CurrentStep);                                
                                        if (CurrentStep == "QC" || CurrentStep == "QC/QA")
                                         {
                                            let qr = `Exec SD_SP_CurrentStep_Num '${txtws}','${_area}','NA','${CurrentStep}',''`;
                                            pool.request().query(qr).then(function (res, err) {
                                                console.log(`Query  ---> ${qr}`);
                                                let currentStepNum = res.recordset[0][''];
                                                console.log("currentStepNum="+currentStepNum);
                                            let next = `Exec NextStepDetails_Sp '${txtws}','${_area}','${_Batch}','${currentStepNum}','${CurrentStep}','${_status}','';`;
                                pool.request().query(next).then(function (result, err) {
                                    console.log(`Query  ---> ${next}`);
                                    if(result.recordset[0][''] < 0 || result.recordset[0][''] == undefined){
                                        return err;
                                    }
                                    else{
                                    let nextstep = result.recordset[0][''];
                                    let under = `Select under_costof from tbl_stepname where process='${txtws}' and area='${_area}' and batch='${_Batch}' and step_name='${CurrentStep}';`
                                    pool.request().query(under).then(function (result, err) {
                                        let underCost = result.recordset[0].under_costof;
                                            let qr = `Select Max(Start_time) as E3Date from E3_timesheets;`
                                            pool.request().query(qr).then(function (res, err) {
                                                console.log(`Query  ---> ${qr}`);
                                                //console.log(res);
                                                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                    return err;
                                                }
                                                else{
                                                let e3date = res.recordset[0].E3Date;
                                                let e3finaldate = e3date.toISOString().slice(0, 19).replace('T', ' ');
                                                if (txtdate > e3finaldate) {
                                                    let qr = `Exec SD_SP_CurrentStep_Num '${txtws}','${_area}','${_Batch}','${CurrentStep}',''`;
                                                    pool.request().query(qr).then(function (res, err) {
                                                        console.log(`Query  ---> ${qr}`);
                                                        if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                            return err;
                                                        }
                                                        else{
                                                        let currentStepNum = res.recordset[0][''];
                                                        let qr23 = `EXEC FeedbackStepname_Sp '${txtws}','${_area}','${_Batch}','${CurrentStep}'`;
                                                        pool.request().query(qr23).then(function (res, err) {
                                                            console.log(`Query  ---> ${qr23}`);
                                                            if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                                return err;
                                                            }
                                                            else{
                                                            let previousStepName = res.recordset[0].step_name;
                                                            let feed = `Exec FeedOperID_Sp '${txtws}','${_area}','${_Batch}','${previousStepName}','${_map}','${_Map_type}';`
                                                            pool.request().query(feed).then(function (res, err) {
                                                                console.log(`Query  ---> ${feed}`);
                                                                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                                    return err;
                                                                }
                                                                else{
                                                                let FeedOperID = res.recordset[0].EMPNUM;
                                                                qrr = `Exec SaveChecklist_Info_Sp '${txtdate}','${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}', '${CurrentStep}','${Checkversion}','${empid}','Completed','1';`
                                                                pool.request().query(qrr).then(function (res, err) {
                                                                    console.log(`Query  ---> ${qrr}`);
                                                                    //console.log(res);
                                                                    let session = hostname +'-'+ mon;
                                                                    let qcdb = `Exec SD_Sp_QCDBSaveInfo '${session}','','${txtdate}','${CurrentStep}','${FeedbackNO}','${txtws}','${_area}','${_Batch}','${_map}','${empid}','${FeedOperID}','${previousStepName}','${txttl}','${txtwsm}','1','1','0','100','1','Accepted','','0','0','${_Map_type}','1';`
                                                                    pool.request().query(qcdb).then(function (result, err) {
                                                                        console.log(`Query  ---> ${qcdb}`);
                                                                        let qre = `Exec CIDMIS_SavingDailylog_Info_New_Sp '${txtdate}','${_Month}','${_Shift}','${txtwsm}','${txttl}','${empid}','${txtws}','${_area}','${_Batch}','${_map}','${_Map_type}','${CurrentStep}','${currentStepNum}','${underCost}','${_status}','${_time}','${_KMS}','''','${txtphase}','${nextstep}','''','''','''','''','1';`
                                                                        pool.request().query(qre).then(function (result, err) {
                                                                            console.log(`Query  ---> ${qre}`);
                                                                            //console.log("id="+_ID);
                                                                            //console.log("finalDate="+finalDate);
                                                                            let request = "Exec MIS_Sync_SavingDailylog1 '" + empid + "','" + txtws + "','" + _area + "','" + _Batch + "','" + _map + "','" + _Map_type + "','" + CurrentStep + "','','" + txtdate + "','" + _ID + "','1'";
                                                                            pool1.request().query(request).then(function (result, err) {
                                                                                console.log(`Query  ---> ${request}`);
                                                                                console.log(result);
                                                                                console.log("QC Step Completed");
                                                                                if (result.rowsAffected != '') {
                                                                                    return msg;
                                                                                } else {
                                                                                    return error;
                                                                                }
                                                                            })

                                                                        })

                                                                    })
                                                                })
                                                            }
                                                            })
                                                        }
                                                        })
                                                    }
                                                    })
                                                }
                                            }

                                            })
                                        })
                                    }
                                    })
                                
                                })

                                } 
                            }                                 
                            })
                        }
                        })
                    }
                    })
                }
                })
            }
            })

        }

    } catch (err) {
        console.log(err);
    }
}

const _QA = async function (row) {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
        let pool1 = await mssql.GetCreateIfNotExistPool(sqlConfigstaging);
        let msg = '';
        let error = '';
        var mon = new Date();
        var mm = mon.toLocaleString('default', { month: 'long' })
        var yyyy = mon.getFullYear();
        var _Month = mm + '-' + yyyy;
        console.log("Month=" + _Month);
        var _step_no = '';
        let _Shift = "WFH";
        let _status = "Completed";
        let txtphase = "GoLive";
        let Checkversion = '';
        for (let i = 0; i < row.length; i++) {
            let timetaken = row[i].QA_Time;
            let _time = parseFloat(timetaken / 60).toFixed(2);
            let _ID = row[i].UID;
            let txtws = row[i].Process;
            let _area = row[i].Area;
            let _Batch = row[i].Batch;
            let _Map_type = row[i].Typeofmap;
            let _map = row[i].Map;
            let _KMS = row[i].TotalKMS;

            let qr = "Select * from Accident where UID = '" + _ID + "'";
            pool1.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`);
                //console.log(result);
                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                    return err;
                }
                else{
                let _QA_name = result.recordset[0].QA_By;
                let date = result.recordset[0].QA_Comp_Date;
                console.log("_QA_name=" + _QA_name);
                console.log(date);
                let qr1 = `Select * from Login where Username = '${_QA_name}'`;
                pool1.request().query(qr1).then(function (result, err) {
                    console.log(`Query  ---> ${qr1}`);
                    if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                        return err;
                    }
                    else{
                    //console.log(result);
                    let empid = result.recordset[0].UserID;
                    let txtdate = date.toISOString().slice(0, 10).replace('T', ' ');
                    console.log(empid);
                    console.log(txtdate);
                    let qr2 = `Select * from [CID_MIS_Naren].[dbo].[tbl_employees] where existsc = 1 and empID = '${empid}'`;
                    pool.request().query(qr2).then(function (result, err) {
                        console.log(`Query  ---> ${qr2}`);
                        //console.log(result);
                        if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                            return err;
                        }
                        else{
                        let txtwsm = result.recordset[0].taskManager;
                        let txttl = result.recordset[0].glid;
                        let FeedbackNO = "1";
                        console.log(txtwsm);
                        console.log(txttl);
                        let qr = `Exec SD_SP_getChelistversion '${txtws}','${_area}','${_Batch}';`
                        pool.request().query(qr).then(function (result, err) {
                            console.log(`Query  ---> ${qr}`);
                            //console.log(result);
                            if(result.recordset[0].Presentversion< 0 || result.recordset[0].Presentversion == undefined){
                                return err;
                            }
                            else{
                            Checkversion = result.recordset[0].Presentversion;
                            let qr2 = `Select currentStep from tbl_maps Where processID = '${txtws}' and area = '${_area}' and batch = '${_Batch}' and mapType = '${_Map_type}' and map = '${_map}';`
                            pool.request().query(qr2).then(function (result, err) {
                                console.log(`Query  ---> ${qr2}`);
                                //console.log(result);
                                if(result.recordset[0].currentStep< 0 || result.recordset[0].currentStep == undefined){
                                    return err;
                                }
                                else{
                                CurrentStep = result.recordset[0].currentStep;
                                console.log(CurrentStep);
                                let next = `Exec NextStepDetails_Sp '${txtws}','${_area}','${_Batch}','${_step_no}','${CurrentStep}','${_status}','';`
                                pool.request().query(next).then(function (result, err) {
                                    console.log(`Query  ---> ${next}`);
                                    if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                        return err;
                                    }
                                    else{
                                    let nextstep = result.recordset[0][''];
                                    //console.log("NextStep="+nextstep);
                                    let under = `Select under_costof from tbl_stepname where process='${txtws}' and area='${_area}' and batch='${_Batch}' and step_name='${CurrentStep}';`
                                    pool.request().query(under).then(function (result, err) {
                                        let underCost = result.recordset[0].under_costof;
                                        if (CurrentStep == "QA") {
                                            if (Checkversion != ""){                                
                                            let qr = `Select Max(Start_time) as E3Date from E3_timesheets;`
                                            pool.request().query(qr).then(function (res, err) {
                                                console.log(`Query  ---> ${qr}`);
                                                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                    return err;
                                                }
                                                else{
                                                //console.log(res);
                                                let e3date = res.recordset[0].E3Date;
                                                let e3finaldate = e3date.toISOString().slice(0, 19).replace('T', ' ');
                                                if (txtdate > e3finaldate) {
                                                    let qr = `Exec SD_SP_CurrentStep_Num '${txtws}','${_area}','NA','${CurrentStep}',''`;
                                                    pool.request().query(qr).then(function (res, err) {
                                                        console.log(`Query  ---> ${qr}`);
                                                        let currentStepNum = res.recordset[0][''];
                                                        let qr23 = `EXEC FeedbackStepname_Sp '${txtws}','${_area}','NA','${CurrentStep}'`;
                                                        pool.request().query(qr23).then(function (res, err) {
                                                            console.log(`Query  ---> ${qr23}`);
                                                            let previousStepName = res.recordset[0].step_name;                                                            
                                                                let FeedOperID = empid;
                                                                qrr = `Exec SaveChecklist_Info_Sp '${txtdate}','${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}', '${CurrentStep}','${Checkversion}','${empid}','Completed','1';`
                                                                pool.request().query(qrr).then(function (res, err) {
                                                                    console.log(`Query  ---> ${qrr}`);
                                                                    console.log(res);
                                                                    let session = hostname+'-'+mon;
                                                                    let qcdb = `Exec SD_Sp_QCDBSaveInfo '${session}','','${txtdate}','${CurrentStep}','${FeedbackNO}','${txtws}','${_area}','${_Batch}','${_map}','${empid}','${FeedOperID}','${previousStepName}','${txttl}','${txtwsm}','1','1','0','100','1','Accepted','','0','0','${_Map_type}','1';`
                                                                    pool.request().query(qcdb).then(function (result, err) {
                                                                        console.log(`Query  ---> ${qcdb}`);
                                                                        let qre = `Exec CIDMIS_SavingDailylog_Info_New_Sp '${txtdate}','${_Month}','${_Shift}','${txtwsm}','${txttl}','${empid}','${txtws}','${_area}','${_Batch}','${_map}','${_Map_type}','${CurrentStep}','${currentStepNum}','${underCost}','${_status}','${_time}','${_KMS}','''','${txtphase}','${nextstep}','''','''','''','''','1';`
                                                                        pool.request().query(qre).then(function (result, err) {
                                                                            console.log(`Query  ---> ${qre}`);
                                                                            //console.log("id="+_ID);
                                                                            //console.log("finalDate="+finalDate);
                                                                            let request = "Exec MIS_Sync_SavingDailylog1 '" + empid + "','" + txtws + "','" + _area + "','" + _Batch + "','" + _map + "','" + _Map_type + "','" + CurrentStep + "','','" + txtdate + "','" + _ID + "','1'";
                                                                            pool1.request().query(request).then(function (result, err) {
                                                                                console.log(`Query  ---> ${request}`);
                                                                                console.log(result);
                                                                                console.log("QA Step Completed");
                                                                                if (result.rowsAffected != '') {
                                                                                    return msg;
                                                                                } else {
                                                                                    return error;
                                                                                }
                                                                            })

                                                                        })

                                                                    })
                                                                })
                                                            })
                                                        })
                                                    
                                                }
                                            }

                                            })

                                        }
                                        }
                                    })
                                } 
                                })
                            }
                            })
                        }
                        })
                    }
                    })
                }
                })
            }
            })

        }

    } catch (err) {
        console.log(err);
    }
}
const _Shipment = async function (row,shipmenttime,shipmentuser,noofrows) {

    try {
        let pool = await mssql.GetCreateIfNotExistPool(sqlConfigmis);
        let pool1 = await mssql.GetCreateIfNotExistPool(sqlConfigstaging);
        let msg = '';
        let error = '';
        var mon = new Date();
        var mm = mon.toLocaleString('default', { month: 'long' })
        var yyyy = mon.getFullYear();
        var _Month = mm + '-' + yyyy;
        console.log("Month=" + _Month);
        var _step_no = '';
        let _Shift = "WFH";
        let _status = "Completed";
        let txtphase = "GoLive";
        let Checkversion = '';
        for (let i = 0; i < row.length; i++) {            
            let _time = parseFloat(shipmenttime / noofrows).toFixed(2);
            let _ID = row[i].UID;
            let txtws = row[i].Process;
            let _area = row[i].Area;
            let _Batch = row[i].Batch;
            let _Map_type = row[i].Typeofmap;
            let _map = row[i].Map;
            let _KMS = row[i].TotalKMS;
            if(shipmenttime != '')
            {
            let qr = "Select * from Accident where UID = '" + _ID + "'";
            pool1.request().query(qr).then(function (result, err) {
                console.log(`Query  ---> ${qr}`);
                //console.log(result);
                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                    return err;
                }
                else{
                let empid_Shipment = shipmentuser;
                let date = result.recordset[0].Shipment;
                console.log("empid_Shipment=" + empid_Shipment);
                console.log(date);
                let qr1 = `Select * from Login where Username = '${empid_Shipment}'`;
                pool1.request().query(qr1).then(function (result, err) {
                    console.log(`Query  ---> ${qr1}`);
                    //console.log(result);
                    if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                        return err;
                    }
                    else{
                    let empid = result.recordset[0].UserID;
                    let txtdate = date.toISOString().slice(0, 10).replace('T', ' ');
                    console.log(empid);
                    console.log("txtdate ="+txtdate);
                    let qr2 = `Select * from [CID_MIS_Naren].[dbo].[tbl_employees] where existsc = 1 and empID = '${empid}'`;
                    pool.request().query(qr2).then(function (result, err) {
                        console.log(`Query  ---> ${qr2}`);
                        //console.log(result);
                        if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                            return err;
                        }
                        else{
                        let txtwsm = result.recordset[0].taskManager;
                        let txttl = result.recordset[0].glid;
                        let FeedbackNO = "1";
                        console.log(txtwsm);
                        console.log(txttl);
                        let qr = `Exec SD_SP_getChelistversion '${txtws}','${_area}','${_Batch}';`
                        pool.request().query(qr).then(function (result, err) {
                            console.log(`Query  ---> ${qr}`);
                            //console.log(result);
                            if(result.recordset[0].Presentversion< 0 || result.recordset[0].Presentversion == undefined){
                                return err;
                            }
                            else{
                            Checkversion = result.recordset[0].Presentversion;
                            let qr2 = `Select currentStep from tbl_maps Where processID = '${txtws}' and area = '${_area}' and batch = '${_Batch}' and mapType = '${_Map_type}' and map = '${_map}';`
                            pool.request().query(qr2).then(function (result, err) {
                                console.log(`Query  ---> ${qr2}`);
                                //console.log(result);
                                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                    return err;
                                }
                                else{
                                CurrentStep = result.recordset[0].currentStep;
                                console.log(CurrentStep);
                                let next = `Exec NextStepDetails_Sp '${txtws}','${_area}','${_Batch}','${_step_no}','${CurrentStep}','${_status}','';`
                                pool.request().query(next).then(function (result, err) {
                                    console.log(`Query  ---> ${next}`);
                                    if(result.recordset[0]['']< 0 || result.recordset[0][''] == undefined){
                                        return err;
                                    }
                                    else{
                                    let nextstep = result.recordset[0][''];
                                    console.log("NextStep===="+nextstep);
                                    let under = `Select under_costof from tbl_stepname where process='${txtws}' and area='${_area}' and batch='${_Batch}' and step_name='${CurrentStep}';`
                                    pool.request().query(under).then(function (result, err) {
                                        let underCost = result.recordset[0].under_costof;
                                        console.log("Hi");
                                        if (CurrentStep == "Shipment") {
                                            if (Checkversion != ""){                                
                                            let qr = `Select Max(Start_time) as E3Date from E3_timesheets;`
                                            pool.request().query(qr).then(function (res, err) {
                                                console.log(`Query  ---> ${qr}`);
                                                //console.log(res);
                                                if(result.recordset[0]< 0 || result.recordset[0] == undefined){
                                                    return err;
                                                }
                                                else{
                                                let e3date = res.recordset[0].E3Date;
                                                let e3finaldate = e3date.toISOString().slice(0, 19).replace('T', ' ');
                                                if (txtdate > e3finaldate) {
                                                    let qr = `Exec SD_SP_CurrentStep_Num '${txtws}','${_area}','NA','${CurrentStep}',''`;
                                                    pool.request().query(qr).then(function (res, err) {
                                                        console.log(`Query  ---> ${qr}`);
                                                        let currentStepNum = res.recordset[0][''];                                                        
                                                            let previousStepName = CurrentStep;                                                            
                                                                let FeedOperID = empid;
                                                                qrr = `Exec SaveChecklist_Info_Sp '${txtdate}','${txtws}','${_area}','${_Batch}','${_Map_type}','${_map}', '${CurrentStep}','${Checkversion}','${empid}','Completed','1';`
                                                                pool.request().query(qrr).then(function (res, err) {
                                                                    console.log(`Query  ---> ${qrr}`);
                                                                    console.log(res);
                                                                    let qcdb = `Exec SD_Sp_QCDBSaveInfo '${_ID}','','${txtdate}','${CurrentStep}','${FeedbackNO}','${txtws}','${_area}','${_Batch}','${_map}','${empid}','${FeedOperID}','${previousStepName}','${txttl}','${txtwsm}','1','1','0','100','1','Accepted','','0','0','${_Map_type}','1';`
                                                                    pool.request().query(qcdb).then(function (result, err) {
                                                                        console.log(`Query  ---> ${qcdb}`);
                                                                        let qre = `Exec CIDMIS_SavingDailylog_Info_New_Sp '${txtdate}','${_Month}','${_Shift}','${txtwsm}','${txttl}','${empid}','${txtws}','${_area}','${_Batch}','${_map}','${_Map_type}','${CurrentStep}','${currentStepNum}','${underCost}','${_status}','${_time}','${_KMS}','''','${txtphase}','${nextstep}','''','''','''','''','1';`
                                                                        pool.request().query(qre).then(function (result, err) {
                                                                            console.log(`Query  ---> ${qre}`);
                                                                            //console.log("id="+_ID);
                                                                            //console.log("finalDate="+finalDate);
                                                                            let request = "Exec MIS_Sync_SavingDailylog1 '" + empid + "','" + txtws + "','" + _area + "','" + _Batch + "','" + _map + "','" + _Map_type + "','" + CurrentStep + "','','" + txtdate + "','" + _ID + "','1'";
                                                                            pool1.request().query(request).then(function (result, err) {
                                                                                console.log(`Query  ---> ${request}`);
                                                                                console.log(result);
                                                                                console.log("Shipment Step Completed");
                                                                               
                                                                            })

                                                                        })

                                                                    })
                                                                })
                                                            })
                                                        
                                                    
                                                }
                                            }

                                            })

                                        }
                                        }
                                    })
                                } 
                                })
                            }
                            })
                        }
                        })
                    }
                    })
                }
                })
            }
            })
        }
    }

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    _YTS, _Inventory, _DataEntry, _QC,_QA,_Shipment
}