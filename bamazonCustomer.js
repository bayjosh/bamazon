var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
var colors = require('colors');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    afterConnection();
});

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.log("");
        console.log("WELCOME TO BAMAZON!".yellow)
        console.log("");
        console.table(res);
        console.log("");
        productSelect();

    });
}

function productSelect() {
    connection.query("SELECT product_name, item_id, price, stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        inquirer.prompt([
            {
                name: "productSelect",
                type: "list",
                choices: function () {
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name + " | $" + results[i].price);
                    }
                    return choiceArray;

                },
                message: "Which product would you like to buy? (Use arrows to select)",
                pageSize: 20,
            },
        ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (choiceArray.indexOf(answer.productSelect) + 1 === results[i].item_id) {
                        chosenItem = results[i];
                    }
                }
                inquirer.prompt([
                    {
                        name: "productUnits",
                        type: "input",
                        message: "How many of those babies would you like to buy, hun?",
                        validate: function (value) {
                            if (isNaN(value) === false && value <= chosenItem.stock_quantity) {
                                return true;
                            } else if (isNaN(value) === false && value > chosenItem.stock_quantity) {
                                console.log("\nI can't give ya that many, babe! We only have ".red + chosenItem.stock_quantity + " left in stock".red);
                                return false;
                            } else {
                                console.log("\nIt's gotta be a number, darlin'!".red)
                                return false;
                            }
                        }

                    }
                ]).then(function (answer) {
                    connection.query("UPDATE products SET stock_quantity = " + (parseInt(chosenItem.stock_quantity) - parseInt(answer.productUnits)) + " WHERE item_id =" + chosenItem.item_id, function (err, res) {
                        if (err) throw err;
                    })

                    console.log("\nPurchase success! Your total purchase is ".green + "$" + (answer.productUnits * chosenItem.price) + "\n")

                    inquirer.prompt([
                        {
                            name: "anotherPurchase",
                            type: "confirm",
                            message: "Want to buy something else, babe?",
                        }
                    ]).then(function (answer) {

                        if (answer.anotherPurchase === true) {
                            console.log("");
                            productSelect();
                            console.log("");
                        } else {
                            console.log("\nThanks for shoppin with us!\n".yellow)
                            connection.end();
                        }
                    })
                })
                
            })


    })
}

