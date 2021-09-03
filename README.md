# Groupmania-social

welcome to the projet 7 
in which we will create a social network for our company called Groupomania 

you ll need to clone the :
backend: https://github.com/konishiwalok/Groupmania-social
and then the 
frontend : https://github.com/konishiwalok/Groupomania-frontend

and make them run at the same time ...
for this projet you ll need to have NODE.JS ,MYSQL ,SEQUELIZE 

INSTRUCTIONS 😊


🖐️- install the backend

you have to clone my projet from github : https://github.com/konishiwalok/Groupmania-social

then in the backend foldier you have to open a terminal and write :  " npm install " to install all the dependencies you ll need , and then when is done you have to write "npm run dev" to make run the server et the port 3000.

🖐️ DO NOT FORGET TO CREATE AN DATABASE

=> in the terminal backend you ll need to write : mysql -u root - p 
when you re inside you have to create 3 database :
mysql => create database groupomania_developement;
mysql => create database groupomania_test;
mysql => create database groupomania_production;

go back to the backend terminal and you ll migrate the tables with sequelize :

sequelize db:create
sequelize db:migrate

🖐️ CREATE AN FICHER .env 


DB_HOST= 'localhost'
DB_USERNAME= 'root'
DB_PASS= 'root'
DB_TOKEN= 'SF45DBGdfbvsgbsdgh345Sdbgvfgbdfb3453fbdgh'

you ll need to have  MAMP/ LAMP /  XAAMP  CONNCETED at the moment you ll run the backend and frontend

thats all you need to do for the backend 👋👋👋👋