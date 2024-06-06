const { prisma } = require("../prisma/prisma-client");
const htmlToPdf = require('html-to-pdf');
const pdf = require("html-pdf");
const puppeteerHtmlToPdf = require('puppeteer-html-pdf');
const buildCertificate = require("../services/buildCertificate");

const ResultsCourseController = {
    addResults: async (req, res) => {
        const { userId, resultProcent, courseId } = req.body;

        if (!userId || !resultProcent || !courseId) {
            return res.status(400).json({
                error: "Заполните обязательные поля"
            });
        }

        try {
            const existsUserResults = await prisma.resultsCourse.findFirst({
                where: {
                    userId: userId,
                    courseId: courseId
                }
            });

            if (existsUserResults) {

                if (resultProcent < existsUserResults.resultProcent) {
                    return res.status(400).json({
                        error: "Сохранять результат ниже предыдущего запрещено"
                    });
                }

                const updateResult = await prisma.resultsCourse.update({
                    where: {
                        id: existsUserResults.id
                    },
                    data: {
                        resultProcent: resultProcent
                    }
                });

                return res.status(200).json(updateResult);

            }

            const newResults = await prisma.resultsCourse.create({
                data: {
                    userId: userId,
                    courseId: courseId,
                    resultProcent: resultProcent
                }
            });

            return res.status(200).json(newResults);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере!"
            });
        }
    },
    getAllResutlsUser: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id пользователя!"
            });
        }

        try {

            const results = await prisma.resultsCourse.findMany({
                where: {
                    userId: id
                },
                include: {
                    course: true
                }
            });

            return res.status(200).json(results);

        } catch (error) {
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    getResultsCertificate: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Вы не указали id сертификата"
            });
        }

        try {
            const result = await prisma.resultsCourse.findFirst({
                where: {
                    id
                },
                include: {
                    course: true,
                    user: true
                }
            });

            if (!result) {
                return res.status(400).json({
                    error: "Результаты не найдены"
                });
            }

            const htmlContent = `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            padding: 0px;
            margin: 0px;
            font-family: "Montserrat", sans-serif;
        }

        .header {
            width: 100%;
            height: 150px;
            background-color: #00528F;
        }

        .container {
            max-width: 90%;
            margin: 0 auto;
            width: 100%;
            height: 100%;
        }

        .logo {
            width: 100%;
            height: 100%;
            padding-top: 50px;
        }

        .logo svg {
            display:inline-block
        }

        .logo h1 {
            display:inline-block
        }

        .logo__title {
            font-size: 20px;
            color: #fff;
        }

        .certificate__number {
            font-weight: 500;
            color: #333;
        }

        .certificate__author {
            max-width: 350px;
            margin-top: 100px
            width: 100%;
        }

        .certificate__author p:nth-of-type(1) {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            text-align: left;
        }

        .certificate__author p:nth-of-type(2) {
            font-size: 16px;
            font-weight: 700;
            color: #00528F;
            text-align: left;
        }

        .main {
            margin-top: 30px;
        }

        .certificate__title {
            color: #333;
            font-weight: 700;
            font-size: 28px;
        }

        .certificate__info {
            display: flex;
            flex-direction: column;
            row-gap: 5px;
        }

        .wrapper {
            width: 100%;
            height: 55vh;
            display: flex;
        }

        .leftSide {
            display: inline;
        }

        .rightSide {
            display: inline;
        }

        .results {
            display: flex;
            flex-direction: column;
            row-gap: 10px;
        }

        .results p:nth-of-type(1) {
            font-weight: 500;
            color: #333;
        }

        .results p:nth-of-type(2) {
            font-weight: 700;
            color: #333;
        }

        .results p:nth-of-type(3) {
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            column-gap: 10px;
        }

        .results p:nth-of-type(3) span {
            font-weight: 700;
            color: #333;
        }

        .user__info {
            font-size: 28px;
            font-weight: 700;
            color: #333;
            width: 340px;
        }

        .podpis {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
    <title>Сертификат</title>
</head>

<body>


    <header class="header">
        <div class="container">
            <div class="logo">
                <svg width="50px" height="50px" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.5625 11.5312L23.625 14.0625L13.5 19.125L3.375 14.0625L8.4375 11.5312M18.5625 17.1562L23.625 19.6875L13.5 24.75L3.375 19.6875L8.4375 17.1562M13.5 3.375L23.625 8.4375L13.5 13.5L3.375 8.4375L13.5 3.375Z"
                        stroke="white" stroke-width="2" />
                </svg>
                <h1 class="logo__title">Ресурсный центр <br> “Воронеж-ПЛАСТ”</h1>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <div class="wrapper">
                <div class="leftSide">
                    <div class="certificate__info">
                        <h2 class="certificate__title">Сертификат</h2>
                        <p class="certificate__number">№ от 07.05.2024</p>
                    </div>
                    <div class="certificate__author">
                        <p>Иванов Иван Иванович</p>
                        <p>Автор курса</p>
                    </div>
                </div>
                <div class="rightSide">
                    <div class="user">
                        <h2 class="user__info">${result.user.surname + " " + result.user.userName + " " + result.user.patronymic}</h2>
                    </div>
                    <div class="results">
                        <p>Успешно прошёл/прошла курс</p>
                        <p>${result.course.courseName} </p>
                        <p><span>Результат:</span> ${result.resultProcent}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>


</body>

</html>
            `

            pdf.create(htmlContent, { format: "A4" }).toStream((err, stream) => {
                if (err) {
                    return res.status(500).json({
                        error: "Произошла ошибка на сервере"
                    });
                }

                res.setHeader('Content-Type', 'application/pdf');
                stream.pipe(res);
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    },
    deleteResult: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: "Не был передан id результата"
            });
        }

        try {
            
            const deleteResult = await prisma.resultsCourse.delete({
                where: { id }
            });

            return res.status(200).json({
                message: "Результат успешно удалён"
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: "Произошла ошибка на сервере"
            });
        }
    }
}

module.exports = ResultsCourseController;