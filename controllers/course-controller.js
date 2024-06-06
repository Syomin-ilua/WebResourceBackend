const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");

const allowedTypesImage = ['image/jpeg', "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

const CourseConroller = {
    addCourse: async (req, res) => {
        const { nameCourse, descriptionCourse, questions } = req.body;

        const questionsData = JSON.parse(questions);

        try {
            const exitCourse = await prisma.course.findFirst({
                where: { courseName: nameCourse },
            });

            if (exitCourse) {
                return res.status(400).json({
                    error: "Курс с таким названием уже существует"
                });
            }

            let coursePictureName;
            let courseMaterialName;
            if (req.files) {
                const imageCourse = req.files.imageCourse;
                const courseMaterial = req.files.courseMaterialFile;

                if (!allowedTypesImage.includes(imageCourse.mimetype)) {
                    return res.status(400).json({
                        error: "Разрешено загружать изображения с типом png, pdf, webp"
                    });
                }

                if (!allowedTypesFile.includes(courseMaterial.mimetype)) {
                    return res.status(400).json({
                        error: "Разрешено загружать материалы курса только с типом pdf"
                    });
                }

                coursePictureName = Date.now() + "_" + imageCourse.name;
                imageCourse.mv(path.join(__dirname, "/../uploads/course-materials/images/", coursePictureName));

                courseMaterialName = Date.now() + "_" + courseMaterial.name;
                courseMaterial.mv(path.join(__dirname, "/../uploads/course-materials/materials/", courseMaterialName));
            }

            const newCourse = await prisma.course.create({
                data: {
                    courseName: nameCourse,
                    courseNameLower: nameCourse.toLowerCase(),
                    courseDescription: descriptionCourse,
                    courseImage: coursePictureName,
                    theoreticalMaterials: courseMaterialName,
                    questions: {
                        create: questionsData.map(question => ({
                            text: question.text,
                            correctAnswer: question.correctAnswer,
                            answers: {
                                create: question.answers.map(answer => ({ text: answer })),
                            },
                        })),
                    },
                },
                include: {
                    questions: {
                        include: {
                            answers: true,
                        },
                    },
                },
            });

            return res.status(200).json({
                message: "Курс успешно создан"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Произошла ошибка на сервере" })
        }
    },
    deleteCourse: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id курса для удаления"
            })
        }

        try {

            const existCourse = await prisma.course.findUnique({
                where: { id }
            });

            if (!existCourse) {
                return res.status(500).json({
                    error: "Такой курс не найден!"
                });
            }

            fs.unlinkSync(path.join(__dirname, "/../uploads/course-materials/images/", existCourse.courseImage));
            fs.unlinkSync(path.join(__dirname, "/../uploads/course-materials/materials/", existCourse.theoreticalMaterials));

            await prisma.$transaction([
                prisma.resultsCourse.deleteMany({
                    where: {
                        courseId: id
                    }
                }),
                prisma.answer.deleteMany({
                    where: {
                        question: {
                            courseId: id,
                        },
                    },
                }),
                prisma.question.deleteMany({
                    where: {
                        courseId: id,
                    },
                }),
                prisma.course.delete({
                    where: {
                        id
                    },
                }),
            ]);

            return res.status(200).json({
                message: "Курс успешно удалён!"
            });

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            })
        }
    },
    getAllCourses: async (req, res) => {
        const search = (req.query.search || "").toLowerCase();

        try {
            const or = search ? {
                OR: [
                    { courseNameLower: { contains: search } }
                ],
            } : {};

            const courses = await prisma.course.findMany({
                where: {
                    ...or
                },
                include: {
                    questions: {
                        include: {
                            answers: true
                        }
                    },
                    ResultsCourse: {
                        include: {
                            user: true
                        }
                    }
                }
            });

            return res.status(200).json(courses);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            })
        }
    },
    getCourse: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id курса!"
            });
        }

        try {
            const course = await prisma.course.findFirst({
                where: { id },
                include: {
                    questions: {
                        include: {
                            answers: true
                        }
                    }
                }
            });

            if (!course) {
                return res.status(400).json({
                    error: "Курс не найден!"
                })
            }

            return res.status(200).json(course);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            })
        }
    },
    updateCourse: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не был передан id курса"
            });
        }

        const { nameCourse, descriptionCourse, questions } = req.body;

        let questionsData;
        if (questions) {
            try {
                questionsData = JSON.parse(questions);
            } catch (error) {
                return res.status(400).json({
                    error: "Неверный формат вопросов"
                });
            }
        }

        try {
            const existCourse = await prisma.course.findFirst({
                where: { id },
            });

            if (!existCourse) {
                return res.status(400).json({
                    error: "Курс не найден"
                });
            }

            if (nameCourse) {
                const existNameCourse = await prisma.course.findFirst({
                    where: { courseName: nameCourse },
                });

                if (existNameCourse && existNameCourse.id !== id) {
                    return res.status(400).json({
                        error: "Курс с таким названием уже существует"
                    });
                }
            }

            let coursePictureName;
            let courseMaterialName;
            if (req.files) {
                if (req.files.imageCourse) {
                    const imageCourse = req.files.imageCourse;

                    if (!allowedTypesImage.includes(imageCourse.mimetype)) {
                        return res.status(400).json({
                            error: "Загружать можно только jpeg, png, webp файлы!"
                        });
                    }

                    if (existCourse.courseImage) {
                        fs.unlinkSync(path.join(__dirname, "/../uploads/course-materials/images/", existCourse.courseImage));
                    }

                    coursePictureName = Date.now() + "_" + imageCourse.name;
                    imageCourse.mv(path.join(__dirname, "/../uploads/course-materials/images/", coursePictureName));
                }

                if (req.files.courseMaterialFile) {
                    const courseMaterial = req.files.courseMaterialFile;

                    if (!allowedTypesFile.includes(courseMaterial.mimetype)) {
                        return res.status(400).json({
                            error: "Разрешено загружать материалы курса только с типом pdf"
                        });
                    }

                    if (existCourse.theoreticalMaterials) {
                        fs.unlinkSync(path.join(__dirname, "/../uploads/course-materials/materials/", existCourse.theoreticalMaterials));
                    }

                    courseMaterialName = Date.now() + "_" + courseMaterial.name;
                    courseMaterial.mv(path.join(__dirname, "/../uploads/course-materials/materials/", courseMaterialName));
                }
            }

            const newCourse = await prisma.$transaction(async (prisma) => {
                const updatedCourse = await prisma.course.update({
                    where: { id },
                    data: {
                        courseName: nameCourse || undefined,
                        courseNameLower: nameCourse ? nameCourse.toLowerCase() : undefined,
                        courseImage: coursePictureName || undefined,
                        courseDescription: descriptionCourse || undefined,
                        theoreticalMaterials: courseMaterialName || undefined,
                    },
                });

                if (questionsData) {
                    await prisma.answer.deleteMany({
                        where: {
                            question: {
                                courseId: id
                            }
                        }
                    });
                    await prisma.question.deleteMany({
                        where: { courseId: id }
                    });

                    await Promise.all(questionsData.map(async question => {
                        const newQuestion = await prisma.question.create({
                            data: {
                                text: question.text,
                                correctAnswer: question.correctAnswer,
                                courseId: id,
                            }
                        });

                        await prisma.answer.createMany({
                            data: question.answers.map(answer => ({
                                text: (typeof answer === "object") ? answer.text : answer,
                                questionId: newQuestion.id
                            }))
                        });
                    }));
                }

                return updatedCourse;
            });

            return res.status(200).json({
                message: "Курс успешно обновлён"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    }
}

module.exports = CourseConroller;