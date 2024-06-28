const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");

const allowedTypesImage = ['image/jpeg', "image/png", "image/webp"];

const UserController = {
    register: async (req, res) => {
        const { surname, userName, patronymic, position, tel, email, password, role } = req.body;

        if (!surname || !userName || !patronymic || !tel || !email || !password || !role) {
            return res.status(400).json({
                error: "Укажите обязательные данные!"
            });
        }

        try {
            const existUser = await prisma.user.findFirst({
                where: { email }
            });

            if (existUser) {
                return res.status(400).json({
                    error: "Пользователь с такой эл. почтой уже существует!"
                });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const png = jdenticon.toPng(userName, 200);
            const avatarName = `${userName}_${Date.now()}.png`;
            const avatarPath = path.join(__dirname, "/../uploads/user-avatars/", avatarName);
            fs.writeFileSync(avatarPath, png);

            const user = await prisma.user.create({
                data: {
                    surname,
                    userName,
                    patronymic,
                    email,
                    tel,
                    position,
                    role,
                    password: hashPassword,
                    avatarURL: avatarName,
                }
            });

            return res.status(200).json(user);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Заполните обязательные поля"
            });
        }

        try {
            const existUser = await prisma.user.findFirst({
                where: { email }
            });

            if (!existUser) {
                return res.status(400).json({
                    error: "Неверный логин или пароль!"
                })
            }

            const validPassword = await bcrypt.compare(password, existUser.password);

            if (!validPassword) {
                return res.status(400).json({
                    error: "Неверный логин или пароль!"
                })
            }

            const token = jwt.sign(({ userId: existUser.id, role: existUser.role }), process.env.SECRET_KEY);

            return res.status(200).json({ token });

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    editUser: async (req, res) => {
        const { id } = req.params;
        const { surname, userName, patronymic, email, tel, position } = req.body;

        if (id !== req.user.userId) {
            return res.status(403).json({
                error: "Нет доступа!"
            });
        }

        try {

            const user = await prisma.user.findFirst({
                where: { id }
            });

            if (email) {
                const existUser = await prisma.user.findFirst({
                    where: { email }
                });

                if (existUser && existUser.id !== id) {
                    return res.status(400).json({
                        error: "Почта уже используется!"
                    })
                }
            }

            let imageName
            if (req.files) {
                const image = req.files.userImage;

                if (!allowedTypesImage.includes(image.mimetype)) {
                    return res.status(400).json({
                        error: "Загружать можно только jpeg, png, webp файлы!"
                    });
                }

                fs.unlinkSync(path.join(__dirname, "/../uploads/user-avatars/", user.avatarURL));

                imageName = Date.now() + "_" + image.name;
                image.mv(path.join(__dirname, "/../uploads/user-avatars/", imageName))
            }

            const updateUser = await prisma.user.update({
                where: { id },
                data: {
                    surname: surname || undefined,
                    userName: userName || undefined,
                    patronymic: patronymic || undefined,
                    position: position || undefined,
                    email: email || undefined,
                    tel: tel || undefined,
                    avatarURL: req.files ? imageName : undefined
                }
            });

            return res.status(200).json(updateUser);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    },
    current: async (req, res) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: req.user.userId
                },
            });

            if (!user) {
                return res.status(400).json({
                    error: "Не удалось найти пользователя!"
                })
            }

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await prisma.user.findMany();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    },
    deleteUser: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id пользователя!"
            })
        }

        try {

            const user = await prisma.user.findFirst({
                where: { id }
            });

            if (!user) {
                return res.status(400).json({
                    error: "Пользователь не найден!"
                })
            }

            fs.unlinkSync(path.join(__dirname, "/../uploads/user-avatars/", user.avatarURL));

            
            const deleteUserResultsCourse = await prisma.resultsCourse.deleteMany({
                where: {
                    userId: id
                }
            });
            
            const deleteUserPartip = await prisma.participation.deleteMany({
                where: {
                    userId: id, 
                }
            })

            const deleteUser = await prisma.user.delete({
                where: { id },
            });


            return res.status(200).json(deleteUser);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    },
    editUserAdmin: async (req, res) => {
        const { id } = req.params;
        const { surname, userName, patronymic, email, tel, position, role } = req.body;

        try {

            const user = await prisma.user.findFirst({
                where: { id }
            });

            if (email) {
                const existUser = await prisma.user.findFirst({
                    where: { email }
                });

                if (existUser && existUser.id !== id) {
                    return res.status(400).json({
                        error: "Почта уже используется!"
                    })
                }
            }

            let imageName
            if (req.files) {
                const image = req.files.userImage;

                if (!allowedTypesImage.includes(image.mimetype)) {
                    return res.status(400).json({
                        error: "Загружать можно только jpeg, png, webp файлы!"
                    });
                }

                fs.unlinkSync(path.join(__dirname, "/../uploads/user-avatars/", user.avatarURL));

                imageName = Date.now() + "_" + image.name;
                image.mv(path.join(__dirname, "/../uploads/user-avatars/", imageName))
            }

            const updateUser = await prisma.user.update({
                where: { id },
                data: {
                    surname: surname || undefined,
                    userName: userName || undefined,
                    patronymic: patronymic || undefined,
                    position: position || undefined,
                    email: email || undefined,
                    role: role || undefined,
                    tel: tel || undefined,
                    avatarURL: req.files ? imageName : undefined
                }
            });

            return res.status(200).json(updateUser);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    },
    getUserById: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id пользователя!"
            });
        }

        try {
            const user = await prisma.user.findFirst({
                where: { id }
            });

            if (!user) {
                return res.status(500).json({
                    error: "Пользователь не найден!"
                });
            }

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    }
};

module.exports = UserController;