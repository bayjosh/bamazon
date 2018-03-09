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
    start();
});

function start() {
    inquirer.prompt([
        {
            name: "managerSelect",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            message: "Hey Mr. Manager, what would you like to do? (Use arrows to select)",
            pageSize: 10,
        },
    ])
        .then(function (answer) {

            if (answer.managerSelect === "View Products for Sale") {
                viewProducts();
            } else if (answer.managerSelect === "View Low Inventory") {
                viewLowInventory();
            } else if (answer.managerSelect === "Add to Inventory") {
                addInventory();
            } else {
                addProduct();
            }
        });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        console.log("");
        start();

    })

}

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <5", function (err, res) {
        if (err) throw err;

        if (res[0] === undefined) {
            console.log("You're good on quantities for now! Nothing lower than 5.\n".green)
            start();
        } else {
            console.log("");
            console.table(res);
            console.log("");
            for (var i = 0; i < res.length; i++) {
                console.log("You need to restock ".red + res[i].product_name + "!".red)
            }
            start();
        }
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        var choiceArray = [];
        inquirer.prompt([
            {
                name: "restockSelect",
                type: "list",
                choices: function () {
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name + " | Stock Quantity: " + results[i].stock_quantity);
                    }
                    return choiceArray;

                },
                message: "Which product would you like to restock? (Use arrows to select)",
                pageSize: 20,
            },
        ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (choiceArray.indexOf(answer.restockSelect) === i) {
                        chosenItem = results[i];
                    }
                }
                inquirer.prompt([
                    {
                        name: "restockNum",
                        type: "input",
                        message: "How many of those babies would you like to restock?",
                        validate: function (value) {
                            if (isNaN(value) === false && value <= 1000 && value > 0) {
                                return true;
                            } else if (isNaN(value) === false && value > 1000 && value > 0) {
                                console.log("\n C'mon now, that's too many".red);
                                return false;
                            } else {
                                console.log("\nIt's gotta be a number, darlin'!".red)
                                return false;
                            }
                        }

                    }
                ]).then(function (answer) {
                    connection.query("UPDATE products SET stock_quantity = " + (parseInt(chosenItem.stock_quantity) + parseInt(answer.restockNum)) + " WHERE item_id =" + chosenItem.item_id, function (err, res) {
                        if (err) throw err;
                    })

                    console.log("\nRestock success! Your items are now restocked. Good job, Manager!\n".green)

                    inquirer.prompt([
                        {
                            name: "anotherRestock",
                            type: "confirm",
                            message: "Want to restock something else, big guy?",
                        }
                    ]).then(function (answer) {

                        if (answer.anotherRestock === true) {
                            console.log("");
                            addInventory();
                            console.log("");
                        } else {
                            start();
                        }
                    })
                })
            })
    })

}

function addProduct() {

    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What would you like add, mate?"
        },
        {
            name: "dept",
            type: "input",
            message: "What department is it in, mate?"
        },
        {
            name: "price",
            type: "input",
            message: "How much is it, mate?"
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many are you adding, mate?"
        }
    ])
        .then(function (answer) {
            connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "', '" + answer.dept + "', " + answer.price + ", " + answer.stock_quantity + ")", function (err, results) {
                if (err) throw err;
                console.log("");
                console.log("Success! You added a new product!".green);
                console.log("");
                start();
            })
        });
};









