const { prisma } = require("../prisma/prisma-client");

const LibraryController = {
    joinLibrary: async (req, res) => {
        try {
            const existUserLibrary = await prisma.libraryCard.findFirst({
                where: {
                    userId: req.user.userId
                }
            });

            if (existUserLibrary) {
                return res.status(400).json({
                    error: "Вы уже состоите в библиотеке"
                });
            }

            const newUserLibrary = await prisma.libraryCard.create({
                data: {
                    userId: req.user.userId
                }
            });

            return res.status(200).json({
                message: "Вы успешно зарегистрированы в библиотеке"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произлшла ошибка на сервере"
            });
        }
    },
    deleteUserInLibrary: async (req, res) => {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                error: "Не был передан id пользователя!"
            });
        }

        try {
            const deleteUserLibrary = await prisma.libraryCard.delete({
                where: {
                    userId: id
                }
            });

            return res.status(200).json({
                message: "Успешное удаление пользователя из библиотеки"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произлшла ошибка на сервере"
            });
        }
    },
    getAllLibrary: async (req, res) => {
        try {

            const usersInLibrary = await prisma.libraryCard.findMany({
                include: {
                    user: true
                }
            });

            return res.status(200).json(usersInLibrary);
        
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произлшла ошибка на сервере"
            });
        }
    }
}

module.exports = LibraryController;