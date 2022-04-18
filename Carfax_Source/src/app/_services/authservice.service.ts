import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/login', {
      username: credentials.username,
      password: credentials.password
    });
  }
  changePassword(values: any, id: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/changepassword', {
      password: values.password,
      old: values.oldpassword,
      userid: id,
      phone: values.phone,
      email: values.email
    });
  }
  dataEntry(form: any, report: any, selected: any, passenger: any, status: any, user: any,reportselect:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/dataentry', {
      agencyori: form.agencyori,
      receivedDate: form.receivedDate,
      source: form.source,
      rfi: form.rfi,
      fileorgname: form.fileorgname,
      controlno: form.controlno,
      crashdate: form.crashdate,
      reportno: form.reportno,
      reporttype: report,
      city: form.city,
      county: form.county,
      state: form.state,
      dcremarks: form.dcremarks,
      qcremarks: form.qcremarks,
      qaremarks: form.qaremarks,
      timespent: form.timespent,
      dctime:form.dctime,
      qctime:form.qctime,
      qatime:form.qatime,
      parties: selected,
      passengers: passenger,
      status: status,
      user: user,
      reportselect:reportselect
    });
  }
  getHyperData(value: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/hyperdata', {
      filename: value
    })
  }
  getfileorgName(user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/hyperfilename', {
      fileuser: user
    })
  }
  getParties(file: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getparties', {
      filename: file
    })
  }
  getVechicles(vechicle: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getvechicles', {
      filename: vechicle
    })
  }
  getPassengers(passengerfile: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getpassengers', {
      passengerfileName: passengerfile
    })
  }
  savePDF(formData: any) {
    return this.http.post<any>('http://172.16.5.234:5000/pdf', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  fetchPDF(filename: any, recdate: any, type: any, month: any): any {
    //const path = 'assets/FL/'+filename;
    //const path = 'http://172.16.5.234:8887/FL/'+filename;
    if (month == '01') {
      const path = 'http://172.17.30.56:80/carfaxinputs/January_2022/' + type + '/' + recdate + '/' + filename;
      return path;
    }
    else if (month == '02') {
      const path = 'http://172.17.30.56:80/carfaxinputs/February_2022/' + type + '/' + recdate + '/' + filename;
      return path;
    }
    else if (month == '03') {
      const path = 'http://172.17.30.56:80/carfaxinputs/March_2022/' + type + '/' + recdate + '/' + filename;
      return path;
    }
    else if (month == '04') {
      const path = 'http://172.17.30.56:80/carfaxinputs/April_2022/' + type + '/' + recdate + '/' + filename;
      return path;
    }
    else if (month == '05') {
      const path = 'http://172.17.30.56:80/carfaxinputs/May_2022/' + type + '/' + recdate + '/' + filename;
      return path;
    }

  }
  hyperdataEntry(form: any, fileorg: any, status: any, user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/hyperEntryData', {
      hyperagencyori: form.agencyori,
      hyperreceivedDate: form.receivedDate,
      hypersource: form.source,
      hyperrfi: form.rfi,
      hyperfileorgname: fileorg,
      hypercontrolno: form.controlno,
      hypercrashdate: form.crashdate,
      hyperreportno: form.reportno,
      hyperreporttype: form.reporttype,
      hypercity: form.city,
      hypercounty: form.county,
      hyperstate: form.state,
      hyperpdfname: form.pdfname,
      hyperdcremarks: form.dcremarks,
      hyperqcremarks: form.qcremarks,
      hyperqaremarks: form.qaremarks,
      hypertimespent: form.timespent,
      hyperdctime:form.dctime,
      hyperqctime:form.qctime,
      hyperqatime:form.qatime,
      hyperStatus: status,
      hyperuser: user
    })
  }
  tableDataSaveParties(parties: any, fileorg: any, user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/tableDataParties', {
      tableparties: parties,
      tablefileorgname: fileorg,
      tableuser: user
    })
  }
  tableDataSaveVechicles(vechicles: any, fileorg: any, user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/tableDataVechicles', {
      tablevechicles: vechicles,
      tablefileorgname: fileorg,
      tableuser: user
    })
  }
  tableDataSavePassengers(passengers: any, fileorg: any, user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/tableDataPassengers', {
      tablepassengers: passengers,
      tablefileorgname: fileorg,
      tableuser: user
    })
  }
  getName(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getname', {
      reportProgress: true,
      observe: 'events'
    })
  }
  getMetro(step:any,commerce:any,state:any,agencyori:any,recddate:any,type:any,dcname:any,dccompdate:any,qcname:any,qccompdate:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getMetroFiles', {
      step:step,
      commerce:commerce,
      state:state,
      agencyori:agencyori,
      receiveddata:recddate,
      type:type,
      dcname:dcname,
      dccompdate:dccompdate,
      qcname:qcname,
      qccompdate:qccompdate
    })
  }
  getNonMetro(step:any,commerce:any,state:any,agencyori:any,recddate:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getNonMetroFiles', {
      step:step,
      commerce:commerce,
      state:state,
      agencyori:agencyori,
      receiveddata:recddate
    })
  }
  allotmentMetro(metrotype: any, metro: any, type: any, user: any, dc: any,qc:any,qa:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/allotment', {
      typeofmetro: metrotype,
      metropdfname: metro,
      metroType: type,
      metrouser: user,
      dcname: dc,
      qcname:qc,
      qaname:qa
    })
  }
  multiAllot(userarray: any, user: any, dc: any,qc:any,qa:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/multiAllot', {      
      metropdfname: userarray,      
      metrouser: user,
      dcname: dc,
      qcname:qc,
      qaname:qa
    })
  }
  getProductionFiles(user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getProductionFiles', {
      produser: user
    })
  }
  Upload(formData: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/datauploadfile', formData, {
      reportProgress: true,
      observe: 'events',
    })
  }
  getAllTl(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/gettlnames', {
      reportProgress: true,
      observe: 'events'
    })
  }
  getRecdDates(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getRecdDates', {
      reportProgress: true,
      observe: 'events'
    })
  }
  getUsers(user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getUsernames', {
      username: user
    })
  }
  getFilesCount(date: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getFilesCount', {
      recDate: date

    })
  }
  getDeliveryRecDate(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getDeliveryRecDate', {
    })
  }
  bulkAllot(row: any, metrotype: any, step: any, form: any, shift: any,commerce:any,recddate:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/bulkAllotment', {
      userrow: row,
      type: metrotype,
      step: step,
      count: form.count,
      recfromDate: form.recfromdate,
      rectoDate: form.rectodate,
      shift: shift,
      commerce:commerce,
      recddate:recddate
    })
  }
  getdeliveryFilesCount(type: any, form: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getdeliveryFilesCount', {
      type: type,
      recdatefrom: form.recdfrom,
      recdateto: form.recdto
    })
  }
  convertXML(file: any, user: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/xmlConvert', {
      file: file,
      user: user
    })
  }
  getServiceState(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getService', {
      reportProgress: true,
      observe: 'events'
    })
  }  
  getMISData(userid: any, username: any, form: any, step: any, service: any, state: any, dcname: any, qcname: any, qaname: any, tlname: any, type: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getMISData', {
      misuserid: userid,
      misusername: username,
      receiveddatefrom: form.recdfromdate,
      receiveddateto: form.recdtodate,
      step: step,
      service: service,
      state: state,
      misdcname: dcname,
      misqcname: qcname,
      misqaname: qaname,
      mistlname: tlname,
      mistype: type
    })
  }
  misSync(selectedRow: any, step: any,user:any,form:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/misSync', {
      misdataRow: selectedRow,
      step: step,
      user:user,
      timehrs:form.timehrs,
      shiptime:form.shiptime
    })
    
  }
  getFileStatusReport(form: any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getFileStatusReport', {
      recdfrom: form.recdfromdate,
      recdto: form.recdtodate
    })
  }
  getAgency(): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/getAgencyori', {
      reportProgress: true,
      observe: 'events'
    })
  }
  ascWiseStatus(agency:any,name:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/ascWiseStatusReport', {
      agencyori: agency,
      name: name
    })
  }
  ascWiseDailyStatus(form:any,name:any): Observable<any> {
    return this.http.post('http://172.16.5.234:5000/ascWiseDailyStatusReport', {
      recdtodate : form.recdtodate,
      nameselected: name
    })
  }
  getCurrentAllotments(state:any,agency:any,type:any,commerce:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getCurrentAllotments',{
      state:state,
      agency:agency,
      type:type,
      commerce:commerce
    })
  }
  getOverview(agency:any,type:any,commerce:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getOverview',{     
      agencyori:agency,
      typemetro:type,
      commerce:commerce
    })
  }
  getCompletedCount(form:any,state:any,agency:any,type:any,commerce:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getCompletedCount',{ 
      recdfrom:form.recdfromdate,
      recdto:form.recdtodate,
      state:state,    
      agencyori:agency,
      typemetro:type,
      commerce:commerce
    })
  }
  getAgencyWise(form:any,agency:any,type:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getAgencyWise',{ 
      recdfrom:form.recdfromdate,
      recdto:form.recdtodate,       
      agencyori:agency,
      typemetro:type
    })
  }
  getRejectedFiles(type:any,optionselect:any,form:any,state:any,agency:any,commerce:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getRejectedFiles',{ 
      metro:type,
      opselect:optionselect,
      recdfrom:form.recdfromdate,
      recdto:form.recdtodate,
      state:state,       
      agencyori:agency,
      commerce:commerce
    })
  }
  getSates(step:any,commerce:any,type:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getSates',{             
      step:step,
      commerce:commerce,
      type:type
    })
  }
  getAgencyori(step:any,commerce:any,type:any,state:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getAgencyoriwork',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state
    })
  }
  getRecedDate(step:any,commerce:any,type:any,state:any,agency:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getRecedDate',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency
    })
  }
  getdcNamework(step:any,commerce:any,type:any,state:any,agency:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getdcNamework',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency
    })
  }
  getdcCompdatework(step:any,commerce:any,type:any,state:any,agency:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getdcCompdatework',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency
    })
  }
  getQcNamework(step:any,commerce:any,type:any,state:any,agency:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getQcNamework',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency
    })
  }
  getQcCompdatework(step:any,commerce:any,type:any,state:any,agency:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getQcCompdatework',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency
    })
  }
  getShipmentData(step:any,commerce:any,type:any,state:any,agency:any,receiveddate:any,dcname:any,dccompdate:any,qcname:any,qccompdate:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/getShipmentData',{             
      step:step,
      commerce:commerce,
      type:type,
      state:state,
      agency:agency,
      dcname:dcname,
      qcname:qcname,
      receiveddate:receiveddate,
      dccompdate:dccompdate,
      qccompdate:qccompdate
    })
  }
  shipmentUpdate(row:any,form:any,user:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/shipmentUpdate',{             
      row:row,
      shipmentdate:form.shipmentdate,
      user:user
    })
  }
  assignMe(form:any,userid:any):Observable<any>{
    return this.http.post('http://172.16.5.234:5000/assignMe',{ 
    commerce:form.commersType,
    metro:form.metroType,
    required:form.required,
    stepName:form.stepName,
    userid:userid
        })
  }
  
getUserAccountbility(from: string,to:string, userid: string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/getUserAccountbility', {
    from: from,
    to:to,
    userId: userid,
  })
}
getTimeByUser(type: string, from: string,to:string, userid: string, search: string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/getTimebyUser', {
    type: type,from: from,to:to,userId: userid,search: search
  })
}
UpdateAllByUser( ids: string, time: string, step: string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/UpdateAllByUser', {
    ids: ids,time: time,step: step
  })
}

ddlStates(revFrom:string,revTo:string,commerce:string,metroType:string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/ddlSteps', {
    commerce: commerce,revFrom: revFrom,revTo: revTo,metroType: metroType,
  })
}
ddlAgencyOri(revFrom:string,revTo:string,commerce:string,state:string,metroType:string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/ddlAgencyOri', {
    commerce: commerce,state:state,revFrom: revFrom,revTo: revTo,metroType: metroType,
  })
}
getSearchData(revFrom:string,revTo:string,delFrom:string,delTo:string, commerce:string,state:string,agency:string,reportType:string,alreadyDeliver:string,qcBy:string,qaBy:string, metroType:string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/getSearchData', {
    commerce: commerce,state:state,revFrom: revFrom,revTo: revTo,delFrom:delFrom,delTo:delTo,
    agency:agency,reportType:reportType,alreadyDeliver:alreadyDeliver,qcBy:qcBy,qaBy:qaBy,metroType: metroType,
  })
}
getAssociates(): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/getassociates', {     
  })
}
getViwAndDeliveryAll(ids:string): Observable<any> {
  return this.http.post('http://172.16.5.234:5000/GetviewAndDeliveryForAll', { 
    ids:ids
  })
}
 
}
