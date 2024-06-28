const express = require('express');
const router = express.Router();
const { UserController, CourseConroller, BooksController, ResultsCourseController, NewsController, EventsController } = require("../controllers");
const authenticateToken = require("../middlewares/auth");
const authorizeRoles = require('../middlewares/authorizeRoles');

// Роуты пользователей
router.post("/login", UserController.login);
router.put("/edit-user/:id", authenticateToken, UserController.editUser);
router.get("/current", authenticateToken, UserController.current);

// Роуты курсов
router.post("/course", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), CourseConroller.addCourse);
router.delete("/delete-course/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), CourseConroller.deleteCourse);
router.get("/courses", CourseConroller.getAllCourses);
router.get("/course/:id", authenticateToken, CourseConroller.getCourse);
router.put("/courses/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), CourseConroller.updateCourse);

// Роуты книг
router.post("/books", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), BooksController.addBook);
router.delete("/books/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), BooksController.deleteBook);
router.get("/books", BooksController.getAllBook);
router.get("/books/:id", authenticateToken, BooksController.getBook);
router.put("/books/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), BooksController.updateBook);

// Роуты результатов тестов
router.post("/results", authenticateToken, ResultsCourseController.addResults);
router.get("/results/:id", authenticateToken, ResultsCourseController.getAllResutlsUser);
router.get("/result/:id", ResultsCourseController.getResultsCertificate);
router.delete("/results/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), ResultsCourseController.deleteResult);

// Административные роуты "Пользователей"
router.post("/users", authenticateToken, authorizeRoles(["ADMIN"]), UserController.register);
router.put("/users/:id", authenticateToken, authorizeRoles(["ADMIN"]), UserController.editUserAdmin);
router.get("/users", authenticateToken, authorizeRoles(["ADMIN"]), UserController.getAllUsers);
router.delete("/users/:id", authenticateToken, authorizeRoles(["ADMIN"]), UserController.deleteUser);
router.get("/users/:id", authenticateToken, UserController.getUserById);

// Роуты новостей
router.post("/news", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), NewsController.addNews);
router.put("/news/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), NewsController.updateNews);
router.delete("/news/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), NewsController.deleteNews);
router.get("/news", NewsController.getAllNews);
router.get("/news/:id", NewsController.getNewsById);

// Роуты мероприятий
router.post("/events", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), EventsController.createEvent);
router.post("/event/:id", authenticateToken, EventsController.joinEvent);
router.delete("/events/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), EventsController.deleteEvent);
router.delete("/event/:id", authenticateToken, EventsController.exitEvent);
router.delete("/delete-user-event/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), EventsController.deleteUserInEvent);
router.get("/events", EventsController.getAllEvents);
router.get("/events/:id", authenticateToken, EventsController.getEventById);
router.put("/events/:id", authenticateToken, authorizeRoles(["ADMIN", "MODERATOR"]), EventsController.updateEvent);

// router.post("/day", EventsController.main);

module.exports = router;