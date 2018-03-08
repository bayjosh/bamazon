CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price INT,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productOne", "deptOne", 1, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productTwo", "deptTwo", 2, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productThree", "deptOne", 3, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productFour", "deptTwo", 4, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productFive", "deptOne", 5, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productSix", "deptTwo", 6, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productSeven", "deptOne", 7, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productEight", "deptTwo", 8, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productNine", "deptOne", 9, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("productTen", "deptTwo", 10, 10);