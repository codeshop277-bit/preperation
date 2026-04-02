# 📘 SQL Interview Questions – Complete Guide (50 Questions)

A comprehensive collection of 50 SQL questions covering all major patterns: DDL, DML, DQL, Joins, Aggregates, Subqueries, CTEs, Window Functions, Stored Procedures, and more.

---

## 🗂️ Table of Contents

1. [DDL – Table Creation & Schema Design](#1-ddl--table-creation--schema-design) (Q1–Q7)
2. [DML – Insert, Update, Delete](#2-dml--insert-update-delete) (Q8–Q13)
3. [DQL – SELECT & Filtering](#3-dql--select--filtering) (Q14–Q18)
4. [Joins](#4-joins) (Q19–Q25)
5. [Aggregate Functions & Grouping](#5-aggregate-functions--grouping) (Q26–Q31)
6. [Subqueries & CTEs](#6-subqueries--ctes) (Q32–Q37)
7. [Window Functions](#7-window-functions) (Q38–Q42)
8. [Stored Procedures](#8-stored-procedures) (Q43–Q47)
9. [Advanced & Mixed Patterns](#9-advanced--mixed-patterns) (Q48–Q50)

---

## Base Schema (used across questions)

```sql
-- Departments table
CREATE TABLE departments (
    dept_id   INT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL
);

-- Employees table
CREATE TABLE employees (
    emp_id     INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name  VARCHAR(50),
    dept_id    INT,
    salary     DECIMAL(10, 2),
    hire_date  DATE,
    manager_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

-- Orders table
CREATE TABLE orders (
    order_id    INT PRIMARY KEY,
    emp_id      INT,
    order_date  DATE,
    amount      DECIMAL(10, 2),
    status      VARCHAR(20),
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id)
);

-- Products table
CREATE TABLE products (
    product_id   INT PRIMARY KEY,
    product_name VARCHAR(100),
    category     VARCHAR(50),
    price        DECIMAL(10, 2),
    stock        INT
);
```

---

## 1. DDL – Table Creation & Schema Design

### Q1. Create a table with constraints

Create a `students` table with: a primary key, a non-null name, a unique email, an age check (must be ≥ 18), and a default enrollment date of today.

```sql
CREATE TABLE students (
    student_id    INT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    age           INT CHECK (age >= 18),
    enrolled_date DATE DEFAULT CURRENT_DATE
);
```

---

### Q2. Add a column to an existing table

Add a `phone_number` column (VARCHAR 15, nullable) to the `employees` table.

```sql
ALTER TABLE employees
ADD COLUMN phone_number VARCHAR(15);
```

---

### Q3. Add a Foreign Key constraint

Add a `product_id` column to the `orders` table and create a foreign key referencing `products`.

```sql
ALTER TABLE orders
ADD COLUMN product_id INT;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_product
    FOREIGN KEY (product_id) REFERENCES products(product_id);
```

---

### Q4. Create an index

Create an index on the `employees` table for faster lookups by `dept_id` and `salary`.

```sql
CREATE INDEX idx_emp_dept_salary
ON employees (dept_id, salary);
```

---

### Q5. Rename a column

Rename `first_name` to `fname` in the `employees` table.

```sql
-- Standard SQL / PostgreSQL
ALTER TABLE employees RENAME COLUMN first_name TO fname;

-- MySQL
ALTER TABLE employees CHANGE first_name fname VARCHAR(50);
```

---

### Q6. Drop a table safely

Drop the `students` table only if it exists.

```sql
DROP TABLE IF EXISTS students;
```

---

### Q7. Create a table from another table's structure and data

Create a backup of the `employees` table including only employees hired before 2020.

```sql
CREATE TABLE employees_backup AS
SELECT *
FROM employees
WHERE hire_date < '2020-01-01';
```

---

## 2. DML – Insert, Update, Delete

### Q8. Insert multiple rows

Insert three departments into the `departments` table in a single statement.

```sql
INSERT INTO departments (dept_id, dept_name)
VALUES
    (1, 'Engineering'),
    (2, 'Marketing'),
    (3, 'Human Resources');
```

---

### Q9. Insert with SELECT (copy data)

Insert into `employees_backup` all employees from `employees` who earn more than 80,000.

```sql
INSERT INTO employees_backup
SELECT *
FROM employees
WHERE salary > 80000;
```

---

### Q10. Update with a condition

Give all employees in the Engineering department a 10% salary raise.

```sql
UPDATE employees
SET salary = salary * 1.10
WHERE dept_id = (
    SELECT dept_id FROM departments WHERE dept_name = 'Engineering'
);
```

---

### Q11. Update using a JOIN

Update the `orders` table to set status = 'Reviewed' for all orders placed by employees in the 'Marketing' department.


```sql
UPDATE orders o
JOIN employees e ON o.emp_id = e.emp_id
JOIN departments d ON e.dept_id = d.dept_id
SET o.status = 'Reviewed'
WHERE d.dept_name = 'Marketing';
```

---

### Q12. Delete with a condition

Delete all orders where the amount is less than 50 and the status is 'Pending'.

```sql
DELETE FROM orders
WHERE amount < 50
  AND status = 'Pending';
```

---

### Q13. Upsert (Insert or Update)

Insert a new product; if the `product_id` already exists, update its price and stock.

```sql
-- MySQL
INSERT INTO products (product_id, product_name, category, price, stock)
VALUES (101, 'Widget A', 'Electronics', 29.99, 200)
ON DUPLICATE KEY UPDATE
    price = VALUES(price),
    stock = VALUES(stock);

-- PostgreSQL
INSERT INTO products (product_id, product_name, category, price, stock)
VALUES (101, 'Widget A', 'Electronics', 29.99, 200)
ON CONFLICT (product_id) DO UPDATE
SET price = EXCLUDED.price,
    stock = EXCLUDED.stock;
```

---

## 3. DQL – SELECT & Filtering

### Q14. Filter with multiple conditions and LIKE

Find all employees whose last name starts with 'S', earn more than 60,000, and were hired after 2018.

```sql
SELECT emp_id, first_name, last_name, salary, hire_date
FROM employees
WHERE last_name LIKE 'S%'
  AND salary > 60000
  AND hire_date > '2018-12-31'
ORDER BY salary DESC;
```

---

### Q15. Pagination with LIMIT and OFFSET

Retrieve the 3rd page of employees, showing 10 employees per page, ordered by hire date.

```sql
SELECT emp_id, first_name, last_name, hire_date
FROM employees
ORDER BY hire_date
LIMIT 10 OFFSET 20;  -- Page 3: skip first 20 rows
```

---

### Q16. Handle NULLs with COALESCE and IS NULL

List all employees who have no manager assigned, and display 'No Manager' instead of NULL.

```sql
SELECT emp_id,
       first_name,
       last_name,
       COALESCE(CAST(manager_id AS VARCHAR), 'No Manager') AS manager
FROM employees
WHERE manager_id IS NULL;
```

---

### Q17. CASE WHEN for conditional output

Classify employees by salary into bands: 'Low' (< 50k), 'Mid' (50k–100k), 'High' (> 100k).

```sql
SELECT emp_id,
       first_name,
       last_name,
       salary,
       CASE
           WHEN salary < 50000              THEN 'Low'
           WHEN salary BETWEEN 50000 AND 100000 THEN 'Mid'
           ELSE                                  'High'
       END AS salary_band
FROM employees
ORDER BY salary;
```

---

### Q18. String and Date functions

Show each employee's full name, the year they were hired, and how many years they have been with the company.

```sql
SELECT CONCAT(first_name, ' ', last_name)          AS full_name,
       YEAR(hire_date)                              AS hire_year,
       TIMESTAMPDIFF(YEAR, hire_date, CURDATE())    AS years_of_service
FROM employees
ORDER BY years_of_service DESC;
```

---

## 4. Joins

### Q19. INNER JOIN

List each employee along with their department name (only employees who belong to a department).

```sql
SELECT e.emp_id,
       e.first_name,
       e.last_name,
       d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;
```

---

### Q20. LEFT JOIN (find unmatched rows)

Find all employees who have never placed an order.

```sql
SELECT e.emp_id, e.first_name, e.last_name
FROM employees e
LEFT JOIN orders o ON e.emp_id = o.emp_id
WHERE o.order_id IS NULL;
```

---

### Q21. RIGHT JOIN

List all departments, including those that currently have no employees.

```sql
SELECT d.dept_name,
       COUNT(e.emp_id) AS employee_count
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id
GROUP BY d.dept_name;
```

---

### Q22. FULL OUTER JOIN

Show all employees and all departments, even when there is no match on either side.

```sql
-- PostgreSQL / SQL Server
SELECT e.first_name, e.last_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- MySQL (simulate with UNION)
SELECT e.first_name, e.last_name, d.dept_name
FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id
UNION
SELECT e.first_name, e.last_name, d.dept_name
FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id;
```

---

### Q23. SELF JOIN

Find all employees along with their manager's name (manager is also an employee).

```sql
SELECT e.emp_id,
       CONCAT(e.first_name, ' ', e.last_name)  AS employee,
       CONCAT(m.first_name, ' ', m.last_name)  AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

---

### Q24. CROSS JOIN

Generate all possible combinations of products and departments (e.g., for a sales matrix).

```sql
SELECT p.product_name, d.dept_name
FROM products p
CROSS JOIN departments d
ORDER BY p.product_name, d.dept_name;
```

---

### Q25. Multi-table JOIN

Show each order with the employee's full name, department name, and the product name ordered.

```sql
SELECT o.order_id,
       CONCAT(e.first_name, ' ', e.last_name) AS employee,
       d.dept_name,
       p.product_name,
       o.amount,
       o.order_date
FROM orders o
JOIN employees  e ON o.emp_id     = e.emp_id
JOIN departments d ON e.dept_id   = d.dept_id
JOIN products   p ON o.product_id = p.product_id
ORDER BY o.order_date DESC;
```

---

## 5. Aggregate Functions & Grouping

### Q26. COUNT, SUM, AVG, MIN, MAX

Summarize the `orders` table: total orders, total revenue, average order amount, smallest and largest order.

```sql
SELECT COUNT(*)      AS total_orders,
       SUM(amount)   AS total_revenue,
       AVG(amount)   AS avg_order,
       MIN(amount)   AS smallest_order,
       MAX(amount)   AS largest_order
FROM orders;
```

---

### Q27. GROUP BY with aggregate

Show the total salary expense per department.

```sql
SELECT d.dept_name,
       COUNT(e.emp_id)  AS headcount,
       SUM(e.salary)    AS total_salary,
       AVG(e.salary)    AS avg_salary
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
GROUP BY d.dept_name
ORDER BY total_salary DESC;
```

---

### Q28. HAVING clause

Find departments where the average salary exceeds 75,000.

```sql
SELECT d.dept_name,
       AVG(e.salary) AS avg_salary
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
GROUP BY d.dept_name
HAVING AVG(e.salary) > 75000
ORDER BY avg_salary DESC;
```

---

### Q29. GROUP BY with ROLLUP

Show total order amounts by employee and an overall grand total using ROLLUP.

```sql
SELECT e.first_name,
       e.last_name,
       SUM(o.amount) AS total_amount
FROM orders o
JOIN employees e ON o.emp_id = e.emp_id
GROUP BY e.first_name, e.last_name WITH ROLLUP;
```

---

### Q30. COUNT DISTINCT

Find the number of unique employees who have placed at least one order per month.

```sql
SELECT DATE_FORMAT(order_date, '%Y-%m') AS month,
       COUNT(DISTINCT emp_id)           AS active_employees
FROM orders
GROUP BY month
ORDER BY month;
```

---

### Q31. Filter aggregates with HAVING and WHERE together

Find products in the 'Electronics' category where total units sold (from orders) exceed 100.

```sql
SELECT p.product_name,
       SUM(o.amount) AS total_revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
WHERE p.category = 'Electronics'
GROUP BY p.product_name
HAVING SUM(o.amount) > 100
ORDER BY total_revenue DESC;
```

---

## 6. Subqueries & CTEs

### Q32. Subquery in WHERE

Find all employees who earn more than the average salary across the entire company.

```sql
SELECT emp_id, first_name, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

---

### Q33. Correlated subquery

Find each employee's salary and how it compares to their own department's average salary.

```sql
SELECT emp_id,
       first_name,
       last_name,
       salary,
       (SELECT AVG(salary)
        FROM employees e2
        WHERE e2.dept_id = e1.dept_id) AS dept_avg
FROM employees e1
ORDER BY dept_id, salary DESC;
```

---

### Q34. Subquery in FROM (Derived Table)

Find the department with the highest total salary expense.

```sql
SELECT dept_name, total_salary
FROM (
    SELECT d.dept_name,
           SUM(e.salary) AS total_salary
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id
    GROUP BY d.dept_name
) AS dept_totals
ORDER BY total_salary DESC
LIMIT 1;
```

---

### Q35. EXISTS subquery

Find all employees who have placed at least one order with an amount greater than 500.

```sql
SELECT emp_id, first_name, last_name
FROM employees e
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.emp_id = e.emp_id
      AND o.amount > 500
);
```

---

### Q36. Simple CTE

Using a CTE, find the top 3 highest-paid employees per department.

```sql
WITH ranked_employees AS (
    SELECT emp_id,
           first_name,
           last_name,
           dept_id,
           salary,
           RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT re.emp_id, re.first_name, re.last_name, d.dept_name, re.salary
FROM ranked_employees re
JOIN departments d ON re.dept_id = d.dept_id
WHERE re.rnk <= 3
ORDER BY d.dept_name, re.salary DESC;
```

---

### Q37. Recursive CTE

Use a recursive CTE to traverse the employee–manager hierarchy starting from the CEO (manager_id IS NULL).

```sql
WITH RECURSIVE org_chart AS (
    -- Base case: top-level employees (no manager)
    SELECT emp_id,
           CONCAT(first_name, ' ', last_name) AS name,
           manager_id,
           0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: employees reporting to someone already in the result
    SELECT e.emp_id,
           CONCAT(e.first_name, ' ', e.last_name),
           e.manager_id,
           oc.level + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.emp_id
)
SELECT level,
       REPEAT('  ', level) || name AS employee_hierarchy
FROM org_chart
ORDER BY level, name;
```

---

## 7. Window Functions

### Q38. ROW_NUMBER – de-duplicate rows

Some employees have duplicate records. Use ROW_NUMBER to keep only the most recently hired record per email.

```sql
WITH deduped AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY email
               ORDER BY hire_date DESC
           ) AS rn
    FROM employees
)
SELECT emp_id, first_name, last_name, hire_date
FROM deduped
WHERE rn = 1;
```

---

### Q39. RANK vs DENSE_RANK

Show employees ranked by salary within each department using both RANK and DENSE_RANK to illustrate the difference.

```sql
SELECT emp_id,
       first_name,
       dept_id,
       salary,
       RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rank_pos,
       DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dense_rank_pos
FROM employees
ORDER BY dept_id, salary DESC;
```

---

### Q40. Running total with SUM OVER

Calculate a running total of order amounts per employee, ordered by order date.

```sql
SELECT o.order_id,
       e.first_name,
       o.order_date,
       o.amount,
       SUM(o.amount) OVER (
           PARTITION BY o.emp_id
           ORDER BY o.order_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM orders o
JOIN employees e ON o.emp_id = e.emp_id
ORDER BY o.emp_id, o.order_date;
```

---

### Q41. LAG and LEAD – compare rows

For each order, show the previous order amount and the next order amount for the same employee.

```sql
SELECT order_id,
       emp_id,
       order_date,
       amount,
       LAG(amount)  OVER (PARTITION BY emp_id ORDER BY order_date) AS prev_order_amount,
       LEAD(amount) OVER (PARTITION BY emp_id ORDER BY order_date) AS next_order_amount
FROM orders
ORDER BY emp_id, order_date;
```

---

### Q42. NTILE – divide rows into buckets

Divide all employees into 4 salary quartiles within each department.

```sql
SELECT emp_id,
       first_name,
       dept_id,
       salary,
       NTILE(4) OVER (
           PARTITION BY dept_id
           ORDER BY salary DESC
       ) AS salary_quartile
FROM employees
ORDER BY dept_id, salary DESC;
```

---

## 8. Stored Procedures

### Q43. Basic stored procedure with IN parameters

Create a procedure to get all orders for a given employee within a date range.

```sql
DELIMITER $$

CREATE PROCEDURE GetEmployeeOrders(
    IN p_emp_id    INT,
    IN p_start     DATE,
    IN p_end       DATE
)
BEGIN
    SELECT o.order_id,
           o.order_date,
           o.amount,
           o.status
    FROM orders o
    WHERE o.emp_id     = p_emp_id
      AND o.order_date BETWEEN p_start AND p_end
    ORDER BY o.order_date;
END$$

DELIMITER ;

-- Usage
CALL GetEmployeeOrders(5, '2023-01-01', '2023-12-31');
```

---

### Q44. Stored procedure with OUT parameter

Create a procedure that returns the total revenue generated by a specific department.

```sql
DELIMITER $$

CREATE PROCEDURE GetDeptRevenue(
    IN  p_dept_name VARCHAR(100),
    OUT p_total     DECIMAL(15, 2)
)
BEGIN
    SELECT SUM(o.amount)
    INTO   p_total
    FROM orders o
    JOIN employees e  ON o.emp_id  = e.emp_id
    JOIN departments d ON e.dept_id = d.dept_id
    WHERE d.dept_name = p_dept_name;
END$$

DELIMITER ;

-- Usage
CALL GetDeptRevenue('Engineering', @revenue);
SELECT @revenue AS engineering_revenue;
```

---

### Q45. Stored procedure with error handling

Create a procedure that transfers an employee to a new department, with rollback on error.

```sql
DELIMITER $$

CREATE PROCEDURE TransferEmployee(
    IN p_emp_id     INT,
    IN p_new_dept   INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Transfer failed – transaction rolled back.' AS result;
    END;

    START TRANSACTION;

    UPDATE employees
    SET dept_id = p_new_dept
    WHERE emp_id = p_emp_id;

    -- Log the transfer (assuming an audit table exists)
    INSERT INTO audit_log (action, emp_id, new_dept_id, changed_at)
    VALUES ('DEPT_TRANSFER', p_emp_id, p_new_dept, NOW());

    COMMIT;
    SELECT 'Transfer successful.' AS result;
END$$

DELIMITER ;

-- Usage
CALL TransferEmployee(12, 3);
```

---

### Q46. Stored procedure with a cursor

Create a procedure that loops through all departments and prints a summary of each department's headcount and total salary using a cursor.

```sql
DELIMITER $$

CREATE PROCEDURE DepartmentSummaryReport()
BEGIN
    DECLARE done          INT DEFAULT FALSE;
    DECLARE v_dept_name   VARCHAR(100);
    DECLARE v_headcount   INT;
    DECLARE v_total_sal   DECIMAL(15, 2);

    DECLARE dept_cursor CURSOR FOR
        SELECT d.dept_name,
               COUNT(e.emp_id),
               SUM(e.salary)
        FROM departments d
        LEFT JOIN employees e ON d.dept_id = e.dept_id
        GROUP BY d.dept_name;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    CREATE TEMPORARY TABLE IF NOT EXISTS dept_summary (
        dept_name   VARCHAR(100),
        headcount   INT,
        total_salary DECIMAL(15, 2)
    );

    OPEN dept_cursor;

    read_loop: LOOP
        FETCH dept_cursor INTO v_dept_name, v_headcount, v_total_sal;
        IF done THEN LEAVE read_loop; END IF;

        INSERT INTO dept_summary VALUES (v_dept_name, v_headcount, v_total_sal);
    END LOOP;

    CLOSE dept_cursor;

    SELECT * FROM dept_summary ORDER BY total_salary DESC;
    DROP TEMPORARY TABLE dept_summary;
END$$

DELIMITER ;

-- Usage
CALL DepartmentSummaryReport();
```

---

### Q47. Stored procedure with dynamic SQL

Create a procedure that accepts a table name and column name as parameters and returns the distinct values from that column (using dynamic/prepared SQL).

```sql
DELIMITER $$

CREATE PROCEDURE GetDistinctValues(
    IN p_table  VARCHAR(64),
    IN p_column VARCHAR(64)
)
BEGIN
    SET @sql = CONCAT(
        'SELECT DISTINCT ', p_column,
        ' FROM ', p_table,
        ' ORDER BY ', p_column
    );

    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

-- Usage
CALL GetDistinctValues('employees', 'dept_id');
```

---

## 9. Advanced & Mixed Patterns

### Q48. UNION vs UNION ALL

Combine a list of all employee names and all customer names, first with duplicates removed (UNION), then with duplicates kept (UNION ALL).

```sql
-- UNION: removes duplicates
SELECT first_name, last_name, 'Employee' AS source FROM employees
UNION
SELECT first_name, last_name, 'Customer' AS source FROM customers;

-- UNION ALL: keeps duplicates (faster)
SELECT first_name, last_name, 'Employee' AS source FROM employees
UNION ALL
SELECT first_name, last_name, 'Customer' AS source FROM customers;
```

---

### Q49. Pivot data with CASE WHEN

Show total order amounts per quarter for the year 2023 as columns (Q1, Q2, Q3, Q4) in a single row per employee.

```sql
SELECT emp_id,
       SUM(CASE WHEN MONTH(order_date) BETWEEN 1  AND 3  THEN amount ELSE 0 END) AS Q1,
       SUM(CASE WHEN MONTH(order_date) BETWEEN 4  AND 6  THEN amount ELSE 0 END) AS Q2,
       SUM(CASE WHEN MONTH(order_date) BETWEEN 7  AND 9  THEN amount ELSE 0 END) AS Q3,
       SUM(CASE WHEN MONTH(order_date) BETWEEN 10 AND 12 THEN amount ELSE 0 END) AS Q4
FROM orders
WHERE YEAR(order_date) = 2023
GROUP BY emp_id
ORDER BY emp_id;
```

---

### Q50. End-to-end analytics query

Find, for each department, the top-earning employee, the department's total salary spend, and what percentage of total company payroll that department represents — all in a single query.

```sql
WITH dept_stats AS (
    SELECT d.dept_name,
           SUM(e.salary)  AS dept_total,
           MAX(e.salary)  AS max_salary
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id
    GROUP BY d.dept_name
),
company_total AS (
    SELECT SUM(salary) AS grand_total FROM employees
),
top_earner AS (
    SELECT d.dept_name,
           CONCAT(e.first_name, ' ', e.last_name) AS top_employee,
           e.salary,
           RANK() OVER (PARTITION BY d.dept_name ORDER BY e.salary DESC) AS rnk
    FROM employees e
    JOIN departments d ON e.dept_id = d.dept_id
)
SELECT ds.dept_name,
       te.top_employee,
       ds.max_salary      AS top_salary,
       ds.dept_total      AS total_salary_spend,
       ROUND(
           ds.dept_total / ct.grand_total * 100, 2
       )                  AS pct_of_company_payroll
FROM dept_stats ds
JOIN company_total ct  ON 1 = 1
JOIN top_earner    te  ON ds.dept_name = te.dept_name AND te.rnk = 1
ORDER BY ds.dept_total DESC;
```

---

## 📋 Quick Reference Summary

| #     | Topic                        | Key Concepts                                      |
|-------|------------------------------|---------------------------------------------------|
| 1–7   | DDL                          | CREATE, ALTER, DROP, INDEX, CONSTRAINTS           |
| 8–13  | DML                          | INSERT, UPDATE, DELETE, UPSERT, JOIN-based UPDATE |
| 14–18 | DQL & Filtering              | WHERE, LIKE, COALESCE, CASE, Date/String funcs    |
| 19–25 | Joins                        | INNER, LEFT, RIGHT, FULL, SELF, CROSS, Multi-join |
| 26–31 | Aggregates & Grouping        | COUNT, SUM, AVG, GROUP BY, HAVING, ROLLUP         |
| 32–37 | Subqueries & CTEs            | Correlated, EXISTS, Derived tables, Recursive CTE |
| 38–42 | Window Functions             | ROW_NUMBER, RANK, SUM OVER, LAG/LEAD, NTILE       |
| 43–47 | Stored Procedures            | IN/OUT params, Error handling, Cursors, Dynamic SQL|
| 48–50 | Advanced Patterns            | UNION, PIVOT, Multi-CTE analytics                 |
