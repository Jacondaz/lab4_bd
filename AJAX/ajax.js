var fs = require("fs");
var http = require("http");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./Students.db");
var handle_GET = function (request, response) 
{
 	switch (request.url) 
	{
 		case "/": fs.readFile("./ajax.html", function (err, content) 
		{
 			if (!err) 
			{
 				response.writeHead(200,{"Content-Type": "text/html; charset=utf-8" });
 				response.end(content, "utf-8") 
			}
 			else 
			{ 
				response.writeHead(500,{"Content-Type": "text/plain; charset=utf-8" });
 				response.end(err.message, "utf-8"); console.log(err);
 			} });
 			break;
 			default:
 			response.writeHead(404, {"Content-Type": "text/html; charset=utf-8" });
 			response.end("<!DOCTYPE html>\n" + "<html>\n" + " <head>\n" + " <meta charset='utf-8'>\n" + " </head>\n" + " <body>\n" + "404, NOT FOUND: " + request.url + " \n</body>\n" + "</html>" );
 			} 
		}
 	var handle_POST = function (request, response) 
	{
 		if (request.url != "/get_table") 
		{ 
			response.writeHead(500, {"Content-Type": "text/plain; charset=utf-8" });
 			response.end();
 		}
 	var data = '';
 	request.on('data', function (chunk) { data += chunk; });
 	request.on('end', function () {
 		var filters = JSON.parse(data);
 		var db_data = {};
 		stmt = db.prepare("SELECT * FROM Students WHERE " + "instr(name, ?)>0 AND " + "instr(secondname, ?)>0 AND " + "instr(fav_colour, ?)>0 AND " + "age>=? AND age<=?;");
 		stmt.all([filters.name, filters.secondname, filters.fav_colour, filters.age_from, filters.age_to], function (err, rows) {
 			if (err) { console.log(err);
 			response.writeHead(404,{"Content-Type": "text/plain; charset=utf-8" });
 			response.end(); 
		}
 		else { 
			response.writeHead(200, {"Content-Type": "application/json; charset=utf-8" });
 			db_data.table = rows;
 			response.end(JSON.stringify(db_data));
 			stmt.finalize(); 
		} 
	});
 });
}
var server_callback = function (request, response) {
 	console.log("request to: " + request.url + " method: " + request.method)
 	if (request.method == "GET") {
 		handle_GET(request, response);
 	}
 	else { 
        handle_POST(request, response);
 	} 
}
db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='Students';", function (err, rows) {
 	if (err || rows.length == 0) {
 		db.run("CREATE TABLE Students (name TEXT, secondname TEXT, age INTEGER, fav_colour TEXT)",
		function(err){
 			if(err) 
{
 				console.log(err);
 			} 
			else
 			{

 				var stmt1 = db.prepare("INSERT INTO Students VALUES (?, ?, ?, ?)");
 				stmt1.run("Nikita", "Karetnikov", 21, "red");
 				stmt1.run("Sasha", "Alexandrov", 23, "black");
 				stmt1.run("Stepan", "Fedorov", 20, "white");
 				stmt1.run("Alexey", "Denisov", 15, "blue");
 				stmt1.run("Darya", "Ladugina", 16, "pink");
 				stmt1.run("Egor", "Babushkin", 29, "green");
 				stmt1.run("Dima", "Rizhov", 31, "black");
 				stmt1.run("Dmitriy", "Stepanox", 12, "red");
 				stmt1.run("Sasha", "Vadimov", 21, "white");
 				stmt1.run("Evklid", "Math", 17, "black");
 				stmt1.run("Igor", "Putsev", 14, "green");
 				stmt1.run("Yury", "Timofeev", 17, "white");
 				stmt1.run("Nastya", "Bugrova", 18, "red");
 				stmt1.run("Yulya", "Logteva", 25, "green");
 				stmt1.run("Katya", "Kornilova", 30, "black");
 				stmt1.run("Veronika", "Kroitor", 11, "white");
 				stmt1.run("Arnold", "Harveev", 39, "red");
				stmt1.run("Shmidt", "Uilyam", 21, "green");
 				stmt1.run("Farsk", "Ivanov", 22, "black");
 				stmt1.run("Punsh", "Kruglin", 20, "blue");
 				stmt1.finalize();
 				db.close();
 			}
 		});
 		console.log("created db: Students.db");
 	}
 http.createServer(server_callback).listen(3000);
 console.log("Listen at http://localhost:3000/");
 });