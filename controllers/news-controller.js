const { prisma } = require("../prisma/prisma-client");
const path = require("path");
const fs = require("fs");

const allowedTypesImage = ['image/jpeg', "image/png", "image/webp"];

const NewsController = {
    addNews: async (req, res) => {
        const { newsName, newsDescription, newsCategory } = req.body;

        if (!newsName || !newsDescription) {
            return res.status(400).json({
                error: "Заполните обязательные поля"
            });
        }

        try {
            const existNews = await prisma.news.findFirst({
                where: {
                    newsName
                }
            });

            if (existNews) {
                return res.status(400).json({
                    error: "Такая новость уже существует"
                });
            }

            if (!req.files || !req.files.newsImage) {
                return res.status(400).json({
                    error: "Загрузите изображение для новости"
                })
            }

            let newsImageName;
            const newsImage = req.files.newsImage;

            if (!allowedTypesImage.includes(newsImage.mimetype)) {
                return res.status(400).json({
                    error: "Загружать можно только jpeg, png, webp изображения!"
                });
            }

            newsImageName = Date.now() + "_" + newsImage.name;
            newsImage.mv(path.join(__dirname, "/../uploads/news-images/", newsImageName))

            const newNews = await prisma.news.create({
                data: {
                    newsName,
                    newsDescription,
                    newsImage: newsImageName,
                    categoryNews: newsCategory
                }
            });

            return res.status(200).json(newNews);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    deleteNews: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id новости для удаления"
            });
        }

        try {
            const existNews = await prisma.news.findFirst({
                where: {
                    id
                }
            });

            if (!existNews) {
                return res.status(400).json({
                    error: "Новость не найдена"
                });
            }

            fs.unlinkSync(path.join(__dirname, "/../uploads/news-images/", existNews.newsImage));

            const deleteNews = await prisma.news.delete({
                where: {
                    id
                }
            });

            return res.status(200).json(deleteNews);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    getAllNews: async (req, res) => {
        const categoryNews = req.query.newsCategory || "all";

        try {

            if (categoryNews === "all") {
                const news = await prisma.news.findMany({
                    orderBy: {
                        createdAt: "desc"
                    }
                });
                return res.status(200).json(news);
            }

            const news = await prisma.news.findMany({
                where: {
                    categoryNews
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            return res.status(200).json(news);

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }


    },
    getNewsById: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id новости"
            })
        }

        try {
            const news = await prisma.news.findFirst({
                where: {
                    id
                }
            });

            if (!news) {
                return res.status(400).json({
                    error: "Новость не найдена"
                });
            }

            return res.status(200).json(news);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    updateNews: async (req, res) => {
        const { id } = req.params;
        const { newsName, newsDescription, newsCategory } = req.body;

        try {
            const existNews = await prisma.news.findFirst({
                where: {
                    id
                }
            });

            if (!existNews) {
                return res.status(200).json({
                    error: "Новость не найдена"
                });
            }

            let newsImageName;
            if (req.files && req.files.newsImage) {
                const newsImage = req.files.newsImage;

                if (!allowedTypesImage.includes(newsImage.mimetype)) {
                    return req.status(400).json({
                        error: "Загружать можно только jpeg, png, webp изображения!"
                    })
                }

                fs.unlinkSync(path.join(__dirname, "/../uploads/news-images/", existNews.newsImage));

                newsImageName = Date.now() + "_" + newsImage.name;
                newsImage.mv(path.join(__dirname, "/../uploads/news-images/", newsImageName))
            }

            const updateNews = await prisma.news.update({
                where: {
                    id
                },
                data: {
                    newsName: newsName || undefined,
                    newsDescription: newsDescription || undefined,
                    newsImage: req.files && req.files.newsImage ? newsImageName : undefined,
                    categoryNews: newsCategory || undefined
                }
            });

            return res.status(200).json(updateNews)

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    }
}

module.exports = NewsController;