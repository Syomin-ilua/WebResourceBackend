const { prisma } = require("../prisma/prisma-client");
const fs = require("fs");
const path = require("path");

const allowedTypesImage = ['image/jpeg', "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

const BookConroller = {
    addBook: async (req, res) => {
        const { nameBook, descriptionBook, categoryBook } = req.body;

        if (!nameBook || !descriptionBook || !categoryBook) {
            return res.status(400).json({
                error: "Заполните обязательные поля!"
            })
        }

        try {
            const existBook = await prisma.book.findFirst({
                where: {
                    nameBook
                }
            });

            if (existBook) {
                return res.status(400).json({
                    error: "Такая книга уже есть!"
                })
            }

            if (!req.files) {
                return res.status(400).json({
                    error: "Загрузите книгу и изображение!"
                })
            }

            let bookPictureName;
            let bookFileName;

            const bookPicture = req.files.bookPicture;
            const bookFile = req.files.bookFile;

            if (!allowedTypesImage.includes(bookPicture.mimetype)) {
                return res.status(400).json({
                    error: "Разрешено загружать изображения с типом png, pdf, webp"
                });
            }

            if (!allowedTypesFile.includes(bookFile.mimetype)) {
                return res.status(400).json({
                    error: "Разрешено загружать эл. книги только с типом pdf"
                });
            }

            bookPictureName = Date.now() + "_" + bookPicture.name;
            bookPicture.mv(path.join(__dirname, "/../uploads/books/images/", bookPictureName));

            bookFileName = Date.now() + "_" + bookFile.name;
            bookFile.mv(path.join(__dirname, "/../uploads/books/files/", bookFileName));

            const newBook = await prisma.book.create({
                data: {
                    nameBook,
                    descriptionBook,
                    nameBookLower: nameBook.toLowerCase(),
                    categoryBook,
                    imageBook: bookPictureName,
                    fileBook: bookFileName
                }
            });

            return res.status(200).json({
                message: "Книга успешно добавлена"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            })
        }

    },
    deleteBook: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id книги для удаления"
            })
        }

        try {

            const existBook = await prisma.book.findUnique({
                where: { id }
            });

            if (!existBook) {
                return res.status(500).json({
                    error: "Такая книга не найдена!"
                });
            }

            fs.unlinkSync(path.join(__dirname, "/../uploads/books/images/", existBook.imageBook));
            fs.unlinkSync(path.join(__dirname, "/../uploads/books/files/", existBook.fileBook));

            const deleteBook = await prisma.book.delete({
                where: {
                    id
                }
            });

            return res.status(200).json({
                message: "Книга успешно удалёна!"
            });

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    getAllBook: async (req, res) => {
        const search = (req.query.search || "").toLowerCase();
        const categoryBook = (req.query.categoryBook || "all");

        try {
            const or = search ? {
                OR: [
                    { nameBookLower: { contains: search } }
                ],
            } : {};

            if (categoryBook === "all") {
                const books = await prisma.book.findMany({
                    where: {
                        ...or
                    },
                });

                return res.status(200).json(books);
            }

            const books = await prisma.book.findMany({
                where: {
                    ...or,
                    categoryBook: { contains: categoryBook }
                },
            });

            return res.status(200).json(books);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            })
        }
    },
    getBook: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id книги!"
            })
        }

        try {
            const book = await prisma.book.findFirst({
                where: {
                    id
                }
            });

            if (!book) {
                return res.status(400).json({
                    error: "Книга не найдена!"
                })
            }

            return res.status(200).json(book);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    updateBook: async (req, res) => {
        const { id } = req.params;
        const { nameBook, descriptionBook, categoryBook } = req.body;

        if (!id) {
            return res.status(403).json({
                error: "Не указан id книги для обновления!"
            });
        }

        try {

            const book = await prisma.book.findFirst({
                where: { id }
            });

            if (nameBook) {
                const existBook = await prisma.book.findFirst({
                    where: { nameBook }
                });

                if (existBook) {
                    return res.status(400).json({
                        error: "Книга с таким названием уже существует!"
                    })
                }
            }

            let bookPictureName;
            let bookFileName;
            if (req.files) {
                if (req.files.bookPicture) {
                    const bookPicture = req.files.bookPicture;

                    if (!allowedTypesImage.includes(bookPicture.mimetype)) {
                        return res.status(400).json({
                            error: "Загружать можно только jpeg, png, webp файлы!"
                        });
                    }

                    fs.unlinkSync(path.join(__dirname, "/../uploads/books/images/", book.imageBook));

                    bookPictureName = Date.now() + "_" + bookPicture.name;
                    bookPicture.mv(path.join(__dirname, "/../uploads/books/images/", bookPictureName))
                }

                if (req.files.bookFile) {
                    const bookFile = req.files.bookFile;

                    if (!allowedTypesFile.includes(bookFile.mimetype)) {
                        return res.status(400).json({
                            error: "Загружать можно эл. книги с типом pdf!"
                        });
                    }

                    fs.unlinkSync(path.join(__dirname, "/../uploads/books/files/", book.fileBook));

                    bookFileName = Date.now() + "_" + bookFile.name;
                    bookFile.mv(path.join(__dirname, "/../uploads/books/files/", bookFileName))
                }
            }

            const updateBook = await prisma.book.update({
                where: { id },
                data: {
                    nameBook: nameBook || undefined,
                    nameBookLower: nameBook ? nameBook.toLowerCase() : undefined,
                    descriptionBook: descriptionBook || undefined,
                    categoryBook: categoryBook || undefined,
                    imageBook: (req.files && req.files.bookPicture) ? bookPictureName : undefined,
                    fileBook: (req.files && req.files.bookFile) ? bookFileName : undefined,
                }
            });

            return res.status(200).json({
                message: "Книга успешно изменена"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    }
}

module.exports = BookConroller;