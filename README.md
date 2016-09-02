# HOMApplication

HOM/1079/16 - Junior Developer – Assessment

Ref – 1501637

About the application.

The application was built using the Node.js Tools for Visual Studio 2015 IDE due to my familiarity with the software from previous experience and the toolsets it provides.
The application uses Node.js and Express to provide dynamic pages driven by templates to display job applicants and their details. Information for the jobs and applicants 
is stored using MongoDB chosen for its scalability and high performance when handling large data sets. JavaScript and JQuery has been used for frontend validation on forms 
and Jasmine has been used alongside Request for testing of functions in the Node.Js environment. 

Installation

Node.js

	Node.js can be downloaded from
	        https://nodejs.org/en/download/current/
	Download and install the latest executable.

MongoDB

	MongoDB can be downloaded from
		http://www.mongodb.org/downloads
	Download and install the latest executable, create the following folders on the root of your C:\ drive.
		\data
		\data\db
	Navigate to the installation directory of MongoDB, the default Windows installation path is
		C:\Program Files\MongoDB\Server\<Version Number>\bin
	From there launch a command prompt and execute 
		mongod.exe
	This is the server executable, the database will now be running, the client for the database can be launched by opening another command prompt from the same folder and executing
		mongo.exe
	This is the client for the database, commands can be issued from this window to the database. Create a database by typing the command
		Use <Database Name>

Install Project from GitHub

	Install the application directly from GitHub, do this using the Node.js executable and installing via Node Package Manager using the command
		npm install LucasCairns/HOMApplication –g
	The package will download and install on your machine, you can find the installation directory of the application by using the command.
		npm root –g
	Navigate to this directory using the command
		cd <Address>
	When at the directory use the following command to initialise the server
		npm start
	Once the server has started navigate to the following to view the application.
		http://localhost:8080

Configuration

	The application can be configured by navigating to the root directory and editing the config.json file.
		{
		  "port": 8080,
		  "databaseUrl": "mongodb://localhost:27017/HOMApplication",
		  "databaseJobCollection": "jobs",
		  "databaseApplicantCollection": "applicants",
		  "testEnvironment": false
		}
	The properties include, port number, database server URL, database collections and a flag that can be set to inject test data into the database and due to how MongoDB works create the collections at the same time. Note when changing the database variables that MondoDB is case sensitive. The ‘testEnvironment’ flag reverts back to false after the data has been injected, the data can be removed from the database using the following commands in the MongoDB client to remove the collections.
	db.use <DatabaseName>
	db.<Collection Name>.drop()

