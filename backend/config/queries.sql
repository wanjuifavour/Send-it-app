CREATE DATABASE SendIt_DB_TEST;

USE SendIt_DB_TEST;

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
	phone VARCHAR(13) NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    isAdmin BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

ALTER TABLE Users
ADD phone VARCHAR(13) NULL;

CREATE TABLE Parcels (
    id INT IDENTITY(1,1) PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    senderLocation VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    isDeleted BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (senderId) REFERENCES Users(id),
    FOREIGN KEY (receiverId) REFERENCES Users(id)
);

ALTER TABLE Parcels
ADD CONSTRAINT CHK_ParcelStatus 
CHECK (status IN ('Pending', 'In Transit', 'Delivered'));
GO

ALTER TABLE Parcels
ALTER COLUMN receiverId INT NULL;
GO

ALTER TABLE Parcels
ADD 
    receiverName NVARCHAR(255) NULL,
    receiverEmail NVARCHAR(255) NULL,
    stripePaymentId NVARCHAR(255) NULL,
    amount DECIMAL(10,2) NULL;
GO

ALTER TABLE Parcels
ADD
	receiverPhone varchar(13) null
GO

ALTER TABLE Parcels
Drop column
distance;

CREATE TABLE Locations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Parcels_SenderId ON Parcels(senderId);
CREATE INDEX IX_Parcels_ReceiverId ON Parcels(receiverId);
CREATE INDEX IX_Parcels_Status ON Parcels(status);
CREATE INDEX IX_Locations_Name ON Locations(name);
GO

CREATE PROCEDURE sp_CreateUser
    @username NVARCHAR(50),
    @email NVARCHAR(100),
    @password NVARCHAR(100),
    @isAdmin BIT = 0
AS
BEGIN
    INSERT INTO Users (username, email, password, isAdmin)
    VALUES (@username, @email, @password, @isAdmin);
    SELECT SCOPE_IDENTITY() AS id;
END
GO

CREATE PROCEDURE sp_GetUserByEmail
    @email NVARCHAR(100)
AS
BEGIN
    SELECT * FROM Users WHERE email = @email;
END
GO

CREATE PROCEDURE sp_UpsertParcel
    @id INT = NULL,
    @senderId INT,
    @receiverId INT,
    @senderLocation NVARCHAR(255),
    @destination NVARCHAR(255),
    @weight DECIMAL(5,2),
    @status NVARCHAR(50) = 'Pending'
AS
BEGIN
    IF @id IS NULL
    BEGIN
        -- Insert new parcel
        INSERT INTO Parcels (senderId, receiverId, senderLocation, destination, weight, status)
        VALUES (@senderId, @receiverId, @senderLocation, @destination, @weight, @status);
        SELECT SCOPE_IDENTITY() AS id;
    END
    ELSE
    BEGIN
        -- Update existing parcel
        UPDATE Parcels
        SET senderId = @senderId,
            receiverId = @receiverId,
            senderLocation = @senderLocation,
            destination = @destination,
            weight = @weight,
            status = @status,
            updatedAt = GETDATE()
        WHERE id = @id;
        SELECT @id AS id;
    END
END
GO

CREATE PROCEDURE sp_UpdateParcelStatus
    @id INT,
    @status NVARCHAR(50)
AS
BEGIN
    UPDATE Parcels
    SET status = @status, updatedAt = GETDATE()
    WHERE id = @id;
    
    SELECT p.id, s.email AS senderEmail, r.email AS receiverEmail
    FROM Parcels p
    JOIN Users s ON p.senderId = s.id
    JOIN Users r ON p.receiverId = r.id
    WHERE p.id = @id;
END
GO

CREATE OR ALTER PROCEDURE sp_GetParcelsByUser
    @userId INT,
    @page INT,
    @pageSize INT,
    @status VARCHAR(50) = NULL  -- New parameter
AS
BEGIN
    -- Sent parcels
    SELECT p.*, 
            s.username AS senderName, 
            r.username AS receiverName,
            'sent' AS parcelType
    FROM Parcels p
    JOIN Users s ON p.senderId = s.id
    JOIN Users r ON p.receiverId = r.id
    WHERE p.senderId = @userId 
        AND p.isDeleted = 0
        AND (@status IS NULL OR p.status = @status)  -- Status filter
    ORDER BY p.id
    OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    -- Received parcels
    SELECT p.*, 
            s.username AS senderName, 
            r.username AS receiverName,
            'received' AS parcelType
    FROM Parcels p
    JOIN Users s ON p.senderId = s.id
    JOIN Users r ON p.receiverId = r.id
    WHERE p.receiverId = @userId 
        AND p.isDeleted = 0
        AND (@status IS NULL OR p.status = @status)  -- Status filter
    ORDER BY p.id
    OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    -- Total counts (with status filter)
    SELECT 
        COUNT(CASE WHEN senderId = @userId AND (@status IS NULL OR status = @status) THEN 1 END) AS sentCount,
        COUNT(CASE WHEN receiverId = @userId AND (@status IS NULL OR status = @status) THEN 1 END) AS receivedCount
    FROM Parcels
    WHERE (senderId = @userId OR receiverId = @userId) 
        AND isDeleted = 0;
END
GO

CREATE PROCEDURE sp_SoftDeleteParcel
    @id INT
AS
BEGIN
    UPDATE Parcels
    SET isDeleted = 1, updatedAt = GETDATE()
    WHERE id = @id;
END
GO

CREATE PROCEDURE sp_AdminCreateParcel
    @userId INT,
    @senderId INT,
    @receiverId INT,
    @senderLocation NVARCHAR(255),
    @destination NVARCHAR(255),
    @weight DECIMAL(5,2)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE id = @userId AND isAdmin = 1)
    BEGIN
        INSERT INTO Parcels (senderId, receiverId, senderLocation, destination, weight, status)
        VALUES (@senderId, @receiverId, @senderLocation, @destination, @weight, 'Pending');
        SELECT SCOPE_IDENTITY() AS id;
    END
    ELSE
    BEGIN
        RAISERROR ('User is not an admin', 16, 1);
    END
END
GO

CREATE PROCEDURE sp_GetAllLocationNames
AS
BEGIN
    SELECT name 
    FROM Locations 
    WHERE isActive = 1
    ORDER BY name;
END
GO

CREATE PROCEDURE sp_GetLocationCoordinates
    @locationName VARCHAR(255)
AS
BEGIN
    SELECT latitude, longitude
    FROM Locations
    WHERE name = @locationName 
    AND isActive = 1;
END
GO

CREATE PROCEDURE sp_GetAllUsers
    @page INT = 1,
    @pageSize INT = 100
AS
BEGIN
    -- Get total count of users
    SELECT COUNT(*) as totalUsers 
    FROM Users;

    -- Get paginated user list
    SELECT 
        id,
        username,
        email,
        isAdmin,
        createdAt,
        updatedAt
    FROM Users
    ORDER BY id
        OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END
GO

CREATE PROCEDURE sp_GetAllParcels
    @page INT = 1,
    @pageSize INT = 100,
    @status VARCHAR(50) = NULL
AS
BEGIN
    -- Get total count
    SELECT COUNT(*) as totalParcels 
    FROM Parcels 
    WHERE (@status IS NULL OR status = @status)
        AND isDeleted = 0;
    
    -- Get paginated parcel list with sender and receiver details
    SELECT 
        p.*,
        sender.username AS senderName,
        sender.email AS senderEmail,
        receiver.username AS receiverName,
        receiver.email AS receiverEmail
    FROM Parcels p
    JOIN Users sender ON p.senderId = sender.id
    JOIN Users receiver ON p.receiverId = receiver.id
    WHERE (@status IS NULL OR p.status = @status)
        AND p.isDeleted = 0
    ORDER BY p.createdAt DESC
    OFFSET (@page - 1) * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END
GO

CREATE or ALTER PROCEDURE sp_CreateUserParcel
    @senderId INT,
    @receiverName NVARCHAR(255),
    @receiverEmail NVARCHAR(255),
	@receiverPhone varchar(13),
    @senderLocation NVARCHAR(255),
    @destination NVARCHAR(255),
    @weight DECIMAL(5,2),
	@stripePaymentId NVARCHAR(255),
	@amount DECIMAL(10,2) NULL
AS
BEGIN
    INSERT INTO Parcels (
        senderId,
        receiverName,
        receiverEmail,
		receiverPhone,
        senderLocation,
        destination,
		stripePaymentId,
		amount,
        weight
    )
    VALUES (
        @senderId,
        @receiverName,
        @receiverEmail,
		@receiverPhone,
        @senderLocation, 
        @destination,
		@stripePaymentId,
		@amount,
        @weight
    );
    
    SELECT SCOPE_IDENTITY() AS id;
END
GO

INSERT INTO Locations (name, latitude, longitude)
VALUES 
    ('Nairobi', -1.286389, 36.817223),
    ('Eldoret', 0.514277, 35.269779),
    ('Nakuru', -0.303099, 36.080025),
	('Mombasa', -4.043740, 39.658871),
	('Kisumu', -0.091702, 34.767956),
	('Nyeri', -0.42013, 36.94759),
	('Machakos',  -1.517, 37.267),
	('Malindi', -3.219186, 40.116890),
	('Kitale', 1.019089, 35.002304),
	('Kisii', -0.680482, 34.777061);
GO