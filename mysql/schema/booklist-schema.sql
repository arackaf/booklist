DROP TABLE books;

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(25),
    title VARCHAR(250) NOT NULL,
    isbn VARCHAR(15),
    pages INT,
    mobileImage VARCHAR(250),
    mobileImagePreview JSON,
    smallImage VARCHAR(250),
    smallImagePreview JSON,
    mediumImage VARCHAR(250),
    mediumImagePreview JSON,
    publicationDate VARCHAR(30),
    publisher VARCHAR(50),
    editorialReviews JSON
)