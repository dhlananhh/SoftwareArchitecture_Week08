-- Ví dụ kết nối bằng client và chạy lệnh SQL:
CREATE DATABASE mydb;

USE mydb;
CREATE TABLE test_table (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50));

USE mydb;
INSERT INTO test_table (name) VALUES ('data 1'), ('data 2');

USE mydb;
SELECT * FROM test_table;