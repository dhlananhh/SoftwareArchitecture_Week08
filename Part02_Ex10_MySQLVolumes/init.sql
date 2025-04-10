-- Ví dụ kết nối bằng client và chạy lệnh SQL:
CREATE TABLE test_table (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50));
INSERT INTO test_table (name) VALUES ('data 1'), ('data 2');
SELECT * FROM test_table;