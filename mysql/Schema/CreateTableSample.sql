DROP TABLE books;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    isbn VARCHAR(15),
    pages INT,
    mobileImage VARCHAR(100),
    mobileImagePreview JSON,
    smallImage VARCHAR(100),
    smallImagePreview JSON,
    mediumImage VARCHAR(100),
    mediumImagePreview JSON,
    publicationDate VARCHAR(30),
    publisher VARCHAR(50),
    userId VARCHAR(25)
)