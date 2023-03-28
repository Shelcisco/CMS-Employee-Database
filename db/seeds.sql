INSERT INTO department (deparmtnet,department_id)
VALUES ("Sales", 01),
       ("IT", 02),
       ("Customer Service", 03),
       ("Human Resources", 04),
       ("Product Development", 05);

INSERT INTO roles (department_id, title, salary, role_id)
VALUES (01, "VP Sales", 150000, 001),
       (01, "Sales Manager", 90000, 002),
       (01, "Sales Representitive", 75000, 003),
       (02, "IT support Manager", 90000, 004),
       (02, "IT support specialist", 75000, 005),
       (03, "Administrative Manager", 80000, 006),
       (03, "Customer Support Specialist", 65000, 007),
       (04, "HR Director", 110000, 008),
       (04, "HR Specialist", 80000, 009),
       (05, "Product Development Director", 220000, 0010),
       (05, "Engineer", 150000, 0011),
       (05, "Front-end Web Developer", 120000, 0012);


INSERT INTO employees (department_id, role_id, first_name, last_name, employee_id, manager_id)
VALUES (01, 001, "Hasan", "Cook", 1, null),
       (01, 002, "Hila", "Ethan", 2, 1),
       (01, 003, "Olivia", "Fresh", 3, 2),
       (01, 003, "Francesco", "Lee", 4, 2),
       (02, 004, "Bob", "Haslleman", 5, null),
       (02, 005, "Rebecca", "Black", 6, 5),
       (02, 005, "Russell", "Oslen", 7, 5),
       (03, 006, "Michelle", "Nabinger", 8, null),
       (03, 007, "Ryan", "Damon", 9, 8),
       (03, 007, "Hailey","Provo", 10, 8),
       (04, 008, "Karen", "Ohld", 11, null),
       (04, 009, "Raj", "Siemond", 12, 11),
       (04, 009, "Susan", "Santiago", 13, 11),
       (05, 0010, "Carina", "Ehsan", 14, null),
       (05, 0011, "Sylvia", "Ting", 15, 14),
       (05, 0011, "Jay", "Nagara", 16, 14);
       
       
       
