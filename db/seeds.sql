INSERT INTO department (department_name)
VALUES ("Business"),
       ("HR"),
       ("Marketing"),
       ("Engineer");

INSERT INTO roles (title,salary, department_id)
VALUES ("Software engineer", 85000, 4),
       ("Social media", 45000,3 ),
       ("Recruiter", 55000,2 ),
       ("Sales", 100000,1 );
      

INSERT INTO employees (first_name,last_name, role_id, manager_id)
VALUES ("Sean","Grant",4, NULL ),
       ("David","Park",1, 1 ),
       ("Brennan","Johnson",3, 1 ),
       ("Jeff","Smith",2, 1 );
