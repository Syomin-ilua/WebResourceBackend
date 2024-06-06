const express = require('express');
const router = express.Router();
const { UserController, CourseConroller, BooksController, ResultsCourseController, NewsController, ProfsouzController, EventsController, LibraryController } = require("../controllers");
const authenticateToken = require("../middlewares/auth");

// Роуты пользователей
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.put("/edit-user/:id", authenticateToken, UserController.editUser);
router.get("/current", authenticateToken, UserController.current);

// Роуты курсов
router.post("/course", authenticateToken, CourseConroller.addCourse);
router.delete("/delete-course/:id", authenticateToken, CourseConroller.deleteCourse);
router.get("/courses", CourseConroller.getAllCourses);
router.get("/course/:id", authenticateToken, CourseConroller.getCourse);
router.put("/courses/:id", authenticateToken, CourseConroller.updateCourse);

// Роуты книг
router.post("/books", authenticateToken, BooksController.addBook);
router.delete("/books/:id", authenticateToken, BooksController.deleteBook);
router.get("/books", BooksController.getAllBook);
router.get("/books/:id", authenticateToken, BooksController.getBook);
router.put("/books/:id", authenticateToken, BooksController.updateBook);

// Роуты результатов тестов
router.post("/results", authenticateToken, ResultsCourseController.addResults);
router.get("/results/:id", authenticateToken, ResultsCourseController.getAllResutlsUser);
router.get("/result/:id", ResultsCourseController.getResultsCertificate);
router.delete("/results/:id", authenticateToken, ResultsCourseController.deleteResult);

// Административные роуты "Пользователей"
router.post("/users", UserController.register);
router.put("/users/:id", UserController.editUserAdmin);
router.get("/users", authenticateToken, UserController.getAllUsers);
router.delete("/users/:id", authenticateToken, UserController.deleteUser);
router.get("/users/:id", authenticateToken, UserController.getUserById);

// Роуты новостей
router.post("/news", authenticateToken, NewsController.addNews);
router.put("/news/:id", authenticateToken, NewsController.updateNews);
router.delete("/news/:id", authenticateToken, NewsController.deleteNews);
router.get("/news", NewsController.getAllNews);
router.get("/news/:id", NewsController.getNewsById);

// Роуты Профсоюза
router.post("/union", authenticateToken, ProfsouzController.createProfsouz);
router.post("/add-user-union", authenticateToken, ProfsouzController.addUserProfsouz);
router.delete("/union/:id", authenticateToken, ProfsouzController.deleteUserProfsouz);
router.get("/union", authenticateToken, ProfsouzController.getAllUsersProfsouz);

// Роуты мероприятий
router.post("/events", authenticateToken, EventsController.createEvent);
router.post("/event/:id", authenticateToken, EventsController.joinEvent);
router.delete("/events/:id", authenticateToken, EventsController.deleteEvent);
router.delete("/event/:id", authenticateToken, EventsController.exitEvent);
router.delete("/delete-user-event/:id", authenticateToken, EventsController.deleteUserInEvent);
router.get("/events", EventsController.getAllEvents);
router.get("/events/:id", authenticateToken, EventsController.getEventById);
router.put("/events/:id", authenticateToken, EventsController.updateEvent);

// router.post("/day", EventsController.main);

// Роуты библиотеки
router.post("/library", authenticateToken, LibraryController.joinLibrary);
router.delete("/library/:id", authenticateToken, LibraryController.deleteUserInLibrary);
router.get("/library", authenticateToken, LibraryController.getAllLibrary);

module.exports = router;