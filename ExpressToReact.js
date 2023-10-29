//step1-load the driver//this will load the library
var mssql=require('mysql');
var bparser=require('body-parser');
bparserInit=bparser.urlencoded({extended:false});
var cors=require('cors');
var exp=require('express');
var app=exp();//initialize express
app.use(cors());
app.use(exp.json())

var statusMessage;
var mssqlconnection= mssql.createConnection({    
        host:'localhost',
        database:'world',
        user:'root',
        password:'root',
        port:3306
})
function checkConnection(error){
    if(error==undefined){
        console.log("connected to database");
    }
    else{  
        console.log("error code"+error.errno)
        console.log(error.message);
    }
 
}
function feedback(error){
    if(error!=undefined){
        console.log(error.errno);
        console.log(error.message);
    }else
    console.log("open the browser amd vistit url http://localhost:9901/getAll");
}
app.listen(9901,feedback);
 
var queryresult=undefined;
function processResult(error,results){
   
        queryresult=results;
        console.log(results);
 
}
 
function displayAllUsers(request,respond){
    mssqlconnection.connect(checkConnection)
    mssqlconnection.query("select * from users",processResult)
    respond.send(queryresult);
}
 
app.get("/getAll",displayAllUsers);

 
 
function getUserById(request,response){
    var userid=request.query.id;
    mssqlconnection.connect(checkConnection)
    //parameterized SQL query
    mssqlconnection.query("select * from users where userid=?",[userid],processResult)
    response.send(queryresult);
 
}
app.get("/getById",getUserById);  

var statusMessage="";

function checkinsertstatus(error){
    statusMessage= (error==undefined)?"<b>inserted succcessfully</b>":"<b>not inserted"+error.message+"</b>";
}

function checkUpdateStatus(error){
    (error == undefined)? statusMessage='<b>Update Successful...</b>' :
    statusMessage='<b>Update failure ' + error.message + '</b>';
}

function checkDeleteStatus(error){
    (error == undefined)? statusMessage='<b>Delete Successful...</b>' :
    statusMessage='<b>Delete failure ' + error.message + '</b>';
}

function AddUser(request,response){
    var userid=request.body.insertid;
    var password=request.body.pass;
    var emailid=request.body.emailid;
    console.log(userid+"\t\t "+password+"\t\t "+emailid);
    //mssqlconnection.connect(checkConnection)
    //parameterized SQL query
    mssqlconnection.query("insert into users (userid,password,emailid) values(?,?,?)",[userid,password,emailid],checkinsertstatus);
    response.send(statusMessage);
}
 
app.post("/insert",bparserInit,AddUser);

function updateUser(request, response){
    var userid = request.body.userid;
    var password = request.body.password;
    var emailid = request.body.emailid;
    mssqlconnection.query('Update users SET userid = ?, password = ?, emailid = ? where userid = ?', [userid, password, emailid, userid], checkUpdateStatus);
    response.send(JSON.stringify(statusMessage));
}
app.put('/update', bparserInit, updateUser); 

function deleteUser(request, response){
   
    var userid = request.body.userid;
    console.log(userid);
    mssqlconnection.query('Delete from users where userid = ?', [userid], checkDeleteStatus);
    response.send(JSON.stringify(statusMessage));
}
app.post('/delete', bparserInit, deleteUser);

8 