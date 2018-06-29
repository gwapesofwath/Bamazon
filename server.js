


var mysql = require("mysql");
var inquirer = require("inquirer");

var idSelected;
var quantitySelected;
var updatedQuantity;

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "bamazon"
  });

  // connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    displayItems();
  });


  //function to display items available for sale
function displayItems() {
    connection.query("SELECT * FROM products", 
    function(err, res){
        if (err) throw err;
        else {
            console.log('\n' + "Welcome to Bamazon, the best place to shop on your terminal. Please browse the" + '\n' + "available products." + '\n');

            //variable to store the table headers
            var tH = "PRODUCT ID " + "PRICE " + "PRODUCT NAME";

            //variable to store the data
            

            console.log(tH);

            for (var i = 0; i < res.length; i++) {
                console.log(res[i].id + "          $" + res[i].price + "     " + res[i].product_name + '\n');
            }
        }
        askUser();
    })
}

  //function to prompt the user 
function askUser(products) {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Select the ID of the product you'd like to purchase",
        choices: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9"
        ]
    }, {
        name: "units",
        type: "input",
        message: "How many units would you like to purchase?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }])
        .then(function (answer) {
            var idSelected = answer.action;
            var quantitySelected = answer.units;
            // console.log(idSelected);
            // console.log(quantitySelected);
            connection.query("SELECT * FROM products WHERE id = " + idSelected, function (err, res) {
                if (quantitySelected > res[0].stock_quantity) {
                    console.log("Nah nah. We don't have that many in stock. Choose " + res[0].stock_quantity + " or less.");
                    inquirer.prompt([{
                        name: "units",
                        type: "input",
                        message: "How many units would you like to purchase?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    }]).then(function (answer) {
                        quantitySelected = answer.units;
                        console.log('\n' + "Thanks for your purchase.")
                        var updatedQuantity = quantitySelected - res[0].stock_quantity;
                        var price = res[0].price;
                        updateData(idSelected, quantitySelected, updatedQuantity, price);
                    });
                } else {
                    console.log('\n' + "Thanks for your purchase.");
                    var updatedQuantity = quantitySelected - res[0].stock_quantity;
                    var price = res[0].price;
                    updateData(idSelected, quantitySelected, updatedQuantity, price);
                }
            })

        })
}

function updateData(idSelected, quantitySelected, updatedQuantity, price) {
    connection.query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: updatedQuantity
    }, {
        id: idSelected
    }], function(err, res) {
        if (err) throw err;
        var customerTotal = quantitySelected * price;
        console.log('\n' + "The total for your purchase is $" + customerTotal + ".");
    })
}

  