-- Crear base de datos
CREATE DATABASE IF NOT EXISTS abcc_db;
USE abcc_db;

-- Tabla de Artículos
CREATE TABLE IF NOT EXISTS Articulos (
    Sku INT(6) PRIMARY KEY, 
    Articulo VARCHAR(15) NOT NULL,
    Marca VARCHAR(15) NOT NULL,
    Modelo VARCHAR(20) NOT NULL,
    Departamento INT(1) NOT NULL,
    Clase INT(2) NOT NULL,
    Familia INT(3) NOT NULL,
    FechaAlta DATE NOT NULL,
    Stock INT(9) NOT NULL,
    Cantidad INT(9) NOT NULL,
    Descontinuado INT(1) DEFAULT 0,
    FechaBaja DATE DEFAULT '1900-01-01',
    CONSTRAINT chk_stock CHECK (Cantidad <= Stock)
);

-- Tabla de Departamentos
CREATE TABLE IF NOT EXISTS Departamentos (
    DepartamentoID INT(1) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

-- Tabla de Clases
CREATE TABLE IF NOT EXISTS Clases (
    ClaseID INT(2) PRIMARY KEY,
    DepartamentoID INT(1),
    Nombre VARCHAR(50) NOT NULL,
    FOREIGN KEY (DepartamentoID) REFERENCES Departamentos(DepartamentoID)
);

-- Tabla de Familias
CREATE TABLE IF NOT EXISTS Familias (
    FamiliaID INT(3) PRIMARY KEY,
    ClaseID INT(2),
    Nombre VARCHAR(50) NOT NULL,
    FOREIGN KEY (ClaseID) REFERENCES Clases(ClaseID)
);

-- Procedimiento para Alta de Artículo
DELIMITER //
CREATE PROCEDURE AltaArticulo(
    IN p_Sku INT,
    IN p_Articulo VARCHAR(15),
    IN p_Marca VARCHAR(15),
    IN p_Modelo VARCHAR(20),
    IN p_Departamento INT,
    IN p_Clase INT,
    IN p_Familia INT,
    IN p_Cantidad INT,
    IN p_Stock INT
)
BEGIN
    DECLARE v_fecha DATE;
    SET v_fecha = CURDATE();
    
    INSERT INTO Articulos (Sku, Articulo, Marca, Modelo, Departamento, Clase, Familia, FechaAlta, Stock, Cantidad)
    VALUES (p_Sku, p_Articulo, p_Marca, p_Modelo, p_Departamento, p_Clase, p_Familia, v_fecha, p_Stock, p_Cantidad);
END //
DELIMITER ;

-- Procedimiento para Baja de Artículo
DELIMITER //
CREATE PROCEDURE BajaArticulo(
    IN p_Sku INT
)
BEGIN
    UPDATE Articulos 
    SET FechaBaja = CURDATE(), Descontinuado = 1
    WHERE Sku = p_Sku;
END //
DELIMITER ;

-- Procedimiento para Cambio de Artículo
DELIMITER //
CREATE PROCEDURE CambiarArticulo(
    IN p_Sku INT,
    IN p_Articulo VARCHAR(15),
    IN p_Marca VARCHAR(15),
    IN p_Modelo VARCHAR(20),
    IN p_Departamento INT,
    IN p_Clase INT,
    IN p_Familia INT,
    IN p_Cantidad INT,
    IN p_Stock INT,
    IN p_Descontinuado INT
)
BEGIN
    UPDATE Articulos 
    SET Articulo = p_Articulo, Marca = p_Marca, Modelo = p_Modelo, Departamento = p_Departamento,
        Clase = p_Clase, Familia = p_Familia, Stock = p_Stock, Cantidad = p_Cantidad, 
        Descontinuado = p_Descontinuado
    WHERE Sku = p_Sku;
    
    IF p_Descontinuado = 1 THEN
        UPDATE Articulos SET FechaBaja = CURDATE() WHERE Sku = p_Sku;
    END IF;
END //
DELIMITER ;

-- Procedimiento para Consultar un Artículo
DELIMITER //
CREATE PROCEDURE ConsultarArticulo(
    IN p_Sku INT
)
BEGIN
    SELECT * FROM Articulos WHERE Sku = p_Sku;
END //
DELIMITER ;

-- Insertar algunos valores en Departamentos, Clases y Familias
INSERT INTO Departamentos (DepartamentoID, Nombre) VALUES 
(1, 'Electrónica'), (2, 'Ropa'), (3, 'Hogar');

INSERT INTO Clases (ClaseID, DepartamentoID, Nombre) VALUES 
(11, 1, 'Televisores'), (12, 1, 'Smartphones'), 
(21, 2, 'Camisas'), (22, 2, 'Pantalones'), 
(31, 3, 'Muebles'), (32, 3, 'Electrodomésticos');

INSERT INTO Familias (FamiliaID, ClaseID, Nombre) VALUES 
(111, 11, 'LED TV'), (112, 11, 'OLED TV'), 
(121, 12, 'Android'), (122, 12, 'iOS'), 
(211, 21, 'Manga Corta'), (212, 21, 'Manga Larga'), 
(221, 22, 'Jeans'), (222, 22, 'Chinos'), 
(311, 31, 'Sofás'), (312, 31, 'Mesas'), 
(321, 32, 'Lavarropas'), (322, 32, 'Microondas');


