CREATE TABLE IF NOT EXISTS users_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(200) NOT NULL,
    role ENUM("SUPER_ADMIN", "ADMIN", "USER") NOT NULL,
    email VARCHAR(319) NOT NULL,
    password VARCHAR(250) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    deleted_by INT,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS feed_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500),
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    updated_by INT,
    deleted_by INT,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS users_feed (
    user_id INT,
    feed_id INT,
    feed_editable BOOLEAN NOT NULL DEFAULT false,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    updated_by INT,
    deleted_by INT,
    is_deleted BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE
    users_details
ADD
    FOREIGN KEY (created_by) REFERENCES users_details(id);

ALTER TABLE
    users_details
ADD
    FOREIGN KEY (updated_by) REFERENCES users_details(id);

ALTER TABLE
    users_details
ADD
    FOREIGN KEY (deleted_by) REFERENCES users_details(id);

ALTER TABLE
    feed_details
ADD
    FOREIGN KEY (created_by) REFERENCES users_details(id);

ALTER TABLE
    feed_details
ADD
    FOREIGN KEY (updated_by) REFERENCES users_details(id);

ALTER TABLE
    feed_details
ADD
    FOREIGN KEY (deleted_by) REFERENCES users_details(id);

ALTER TABLE
    users_feed
ADD
    FOREIGN KEY (created_by) REFERENCES users_details(id);

ALTER TABLE
    users_feed
ADD
    FOREIGN KEY (updated_by) REFERENCES users_details(id);

ALTER TABLE
    users_feed
ADD
    FOREIGN KEY (deleted_by) REFERENCES users_details(id);

ALTER TABLE
    users_feed
ADD
    FOREIGN KEY (user_id) REFERENCES users_details(id);

ALTER TABLE
    users_feed
ADD
    FOREIGN KEY (feed_id) REFERENCES feed_details(id);

ALTER TABLE
    users_feed
ADD
    CONSTRAINT unique_users_feed UNIQUE (user_id, feed_id);