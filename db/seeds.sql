INSERT INTO department (name)
VALUES ("Sales"),
       ("IT"),
       ("Customer Service"),
       ("Human Resources"),
       ("Product Development");

INSERT INTO role (department_id, title, salary)
VALUES (1, "VP Sales", 150000),
       (1, "Sales Manager", 90000),
       (1, "Sales Representitive", 75000),
       (2, "IT support Manager", 90000),
       (2, "IT support specialist", 75000),
       (3, "Administrative Manager", 80000),
       (3, "Customer Support Specialist", 65000),
       (4, "HR Director", 110000),
       (4, "HR Specialist", 80000),
       (5, "Product Development Director", 220000),
       (5, "Engineer", 150000),
       (5, "Front-end Web Developer", 120000);


INSERT INTO employee (role_id, first_name, last_name,manager_id)
VALUES (1, "Hasan", "Cook", null),
       (1, "Hila", "Ethan",  1),
       (1, "Olivia", "Fresh",  2),
       (1, "Francesco", "Lee", 2),
       (2, "Bob", "Haslleman",  null),
       (2, "Rebecca", "Black",  5),
       (2, "Russell", "Oslen", 5),
       (3,  "Michelle", "Nabinger",  null),
       (3, "Ryan", "Damon", 8),
       (3, "Hailey","Provo",  8),
       (4, "Karen", "Ohld", null),
       (4, "Raj", "Siemond",  10),
       (4,  "Susan", "Santiago",  11),
       (5,  "Carina", "Ehsan",  null),
       (5, "Sylvia", "Ting",  14),
       (5,  "Jay", "Nagara", 14);
       
       
       
