const { prisma } = require("../prisma/prisma-client");

const ProfsouzController = {
    createProfsouz: async (req, res) => {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                error: "Заполните обязательные поля"
            });
        }

        try {

            const union = await prisma.union.create({
                data: {
                    name,
                    description
                }
            });

            return res.status(200).json({
                message: "Профсоюз успешно создан"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    addUserProfsouz: async (req, res) => {
        try {
            const existUserUnion = await prisma.membership.findFirst({
                where: {
                    userId: req.user.userId,
                    unionId: 1
                }
            });

            if (existUserUnion) {
                return res.status(400).json({
                    message: "Вы уже состоите в профсоюзе"
                });
            }

            const membership = await prisma.membership.create({
                data: {
                    userId: req.user.userId,
                    unionId: 1
                }
            });

            return res.status(200).json({
                message: "Вы успешно вступили в профсоюз"
            })

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    deleteUserProfsouz: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id пользователя"
            });
        }

        try {

            const deleteMembership = await prisma.membership.delete({
                where: {
                    userId_unionId: {
                        userId: id,
                        unionId: 1,
                    }
                }
            });

            return res.status(200).json({
                message: "Успешный выход из профсоюза"
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    getAllUsersProfsouz: async (req, res) => {
        try {
            const memberships = await prisma.membership.findMany({
                where: {
                    unionId: 1
                },
                include: {
                    user: true,
                    union: true
                }
            });

            return res.status(200).json(memberships);

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    }
}

module.exports = ProfsouzController;