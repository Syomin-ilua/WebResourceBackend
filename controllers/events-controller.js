const { prisma } = require("../prisma/prisma-client");
const path = require("path");
const fs = require("fs");

const allowedTypesImage = ['image/jpeg', "image/png", "image/webp"];

const EventsController = {
    createEvent: async (req, res) => {
        const { name, description, eventLocation, schedules } = req.body;

        if (!name || !description || !eventLocation || !schedules) {
            return res.status(400).json({
                error: "Заполните обязательные поля"
            });
        }

        const schedulesData = JSON.parse(schedules);

        try {

            if (!req.files) {
                return res.status(400).json({
                    error: "Загрузите изображение мероприятия!"
                })
            }

            const exitEvent = await prisma.event.findFirst({
                where: { name }
            });

            if (exitEvent) {
                return res.status(400).json({
                    error: "Такое мероприятие уже существует"
                });
            }

            let eventPictureName;
            const eventPicture = req.files.eventPicture;

            if (!allowedTypesImage.includes(eventPicture.mimetype)) {
                return res.status(400).json({
                    error: "Разрешено загружать изображения с типом png, pdf, webp"
                });
            }

            eventPictureName = Date.now() + "_" + eventPicture.name;
            eventPicture.mv(path.join(__dirname, "/../uploads/event-images/", eventPictureName));

            const newEvent = await prisma.event.create({
                data: {
                    name,
                    description,
                    eventLocation,
                    schedules: {
                        create: schedulesData.map(schedule => ({
                            dayOfWeekId: Number(schedule.dayOfWeekId),
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                        })),
                    },
                    eventPicture: eventPictureName
                }
            });

            return res.status(200).json({
                message: "Мероприятие успешно создано"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    getAllEvents: async (req, res) => {
        try {
            const events = await prisma.event.findMany({
                include: {
                    schedules: {
                        include: {
                            dayOfWeek: true,
                        },
                    },
                    participations: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            return res.status(200).json(events);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    getEventById: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не был указан id мероприятия"
            });
        }

        try {
            const event = await prisma.event.findFirst({
                where: {
                    id: Number(id)
                },
                include: {
                    schedules: {
                        include: {
                            dayOfWeek: true,
                        },
                    },
                    participations: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!event) {
                return res.status(400).json({
                    error: "Мероприятие не найдено"
                });
            }

            return res.status(200).json(event);

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    deleteEvent: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не был указан id мероприятия"
            });
        }

        try {

            const event = await prisma.event.findFirst({
                where: {
                    id: Number(id)
                }
            });

            if (!event) {
                return res.status(400).json({
                    message: "Мероприятие не найдено"
                })
            }

            fs.unlinkSync(path.join(__dirname, "/../uploads/event-images/", event.eventPicture));

            await prisma.$transaction([
                prisma.schedule.deleteMany({
                    where: { sportEventId: Number(id) },
                }),
                prisma.participation.deleteMany({
                    where: {
                        sportEventId: Number(id)
                    }
                }),
                prisma.event.delete({
                    where: { id: Number(id) },
                })
            ]);

            return res.status(200).json({
                message: "Вы успешно удалили меропритие"
            })

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    joinEvent: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id мероприятия"
            });
        }

        try {

            const participation = await prisma.participation.create({
                data: {
                    sportEventId: Number(id),
                    userId: req.user.userId,
                },
            });

            return res.status(200).json({
                message: "Вы успешно записались на мероприятие"
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    exitEvent: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id мероприятия"
            });
        }

        try {

            const participation = await prisma.participation.delete({
                where: {
                    id: Number(id)
                },
            });

            return res.status(200).json({
                message: "Вы успешно вышли из мероприятия"
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    deleteUserInEvent: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не указан id"
            });
        }

        try {

            const participation = await prisma.participation.delete({
                where: {
                    id: Number(id)
                },
            });

            return res.status(200).json({
                message: "Вы успешно исключили сотрудника из мероприятия"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    updateEvent: async (req, res) => {

        const { id } = req.params;
        const { name, description, eventLocation, schedules } = req.body;

        let schedulesData;
        if (schedules) {
            schedulesData = JSON.parse(schedules);
        }

        if (!id) {
            return res.status(400).json({
                error: "Не указан id"
            });
        }

        try {
            const existEvent = await prisma.event.findFirst({
                where: { id: Number(id) }
            });

            if (!existEvent) {
                return res.status(400).json({
                    error: "Меропритие не найдено"
                });
            }

            let eventPictureName;
            if (req.files) {
                const eventPicture = req.files.eventPicture;

                if (!allowedTypesImage.includes(eventPicture.mimetype)) {
                    return res.status(400).json({
                        error: "Разрешено загружать изображения с типом png, pdf, webp"
                    });
                }

                fs.unlinkSync(path.join(__dirname, "/../uploads/event-images/", existEvent.eventPicture));

                eventPictureName = Date.now() + "_" + eventPicture.name;
                eventPicture.mv(path.join(__dirname, "/../uploads/event-images/", eventPictureName));
            }

            const updateEvent = await prisma.event.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: name || undefined,
                    description: description || undefined,
                    eventLocation: eventLocation || undefined,
                    eventPicture: eventPictureName || undefined,
                    schedules: schedulesData ? {
                        deleteMany: {},
                        create: schedulesData.map((schedule) => ({
                            dayOfWeekId: Number(schedule.dayOfWeekId),
                            startTime: schedule.startTime,
                            endTime: schedule.endTime,
                        }))
                    } : undefined
                },
            });

            return res.status(200).json({
                message: "Мероприятие успешно обновлено"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    }
}

module.exports = EventsController;