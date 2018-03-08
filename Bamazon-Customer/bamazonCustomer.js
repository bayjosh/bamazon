var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon_DB"
  });

  connection.connect(function(err) {
    if (err) throw err;

    afterConnection();
});

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        console.log("");
        connection.end();
        
      });
  }

