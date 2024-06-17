-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 17 2024 г., 22:05
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `flower_shop`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`) VALUES
(3, 5, 1, 1),
(4, 5, 1, 1),
(5, 5, 2, 1),
(6, 5, 2, 1),
(7, 5, 1, 1),
(8, 5, 1, 1),
(9, 13, 12, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`) VALUES
(1, 1, '2024-05-21 09:58:27');

-- --------------------------------------------------------

--
-- Структура таблицы `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`, `address`, `phone`) VALUES
(3, 1, '1200.00', 'в обработке', '2024-05-21 12:15:07', '', ''),
(5, 1, '2400.00', 'в обработке', '2024-05-21 12:17:50', '', ''),
(6, 1, '1200.00', 'в обработке', '2024-05-21 12:19:11', '', ''),
(9, 1, '1200.00', 'в обработке', '2024-05-21 12:52:44', '12 ghjfj', '+7 909 154-21-53'),
(10, 1, '2400.00', 'в обработке', '2024-05-21 13:00:07', '12 ghjfj', '+7 909 154-21-53'),
(11, 1, '1200.00', 'в обработке', '2024-05-21 14:24:17', '12 ghjfj', '+7 909 154-21-53');

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(2, 3, 1, 1, '1200.00'),
(3, 5, 1, 2, '1200.00'),
(4, 6, 1, 1, '1200.00'),
(7, 9, 1, 1, '1200.00'),
(8, 10, 1, 2, '1200.00'),
(9, 11, 1, 1, '1200.00');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image`) VALUES
(15, 'Орхидея ', 'РРРРРРРРРРРР', 376, 'photo/romash.jpg'),
(16, 'Ромашки', 'fdhjrjg', 567, 'photo/rom.jpg');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES
(1, 'Елена ', '$2y$10$IGS4WYgIyf6qa6SqU3m50.16igwrthMk9S63Qr7t2HEmTAv/Wd8o6', 'khuuh@mail.ru'),
(2, 'вави', '$2y$10$yQSByViN2tagVIo8E./Gue4oo2wailusK2dwSWvd/qpTUbLqWSpO.', 'uuh@mail.ru'),
(3, 'Екатерина', '$2y$10$nWSYpAVgkanbbsGWPpb7ZOyYOpy1YWm9vFobofA.GkcaVdpLiXkES', 'ercgg@mail.ru'),
(4, 'Катя', '$2y$10$19pt6Lxu2qmTZMHRwuk6z.KZWs9RrySj7npttmY83T/vKl9M0n2RC', 'ercgg@mail.ru'),
(5, 'Лера', '$2y$10$8a2RiGbyOfsARneZVil2COhTr0hhKD.SouzRjkKaqKr45kgsN3Nwu', 'uuh@mail.ru'),
(6, 'vkvkvkv', '$2b$10$fqjGE.4LIEsbNizOPCMKoeHc4L8hD4HLzsEKNWsOYK.Z7UEQBGXP.', 'leeeet@mail.ru'),
(7, 'Полина', '$2b$10$ylnguABxFN.rQpj7.JS7OuV8hi9g/mEdm38j.fA3pJrUpeQ9cd3s.', 'Poli.123@mail.ru'),
(8, 'admin', '$2b$10$aLWITiFTtYi0cJ9jfUUvUOlPASJr1AIPlALyZLLJVPzN57MC501sS', 'admin@mail.ru'),
(9, 'liza', '$2b$10$MAoxvnDPDkRhWMgZBzPNjuwB48y2mKQ5Tjyg3rkh9hr0IsfrkDfSW', 'liza@mail.ru'),
(10, 'poli', '$2b$10$kLkWBleY49mNWTDEEyqKjO69ENLmmwGFFZMUtdZe/aMYe3q5lCg9e', 'poli@mail.ru'),
(11, 'sasa', '$2b$10$WTep8sstzLEYSfLXxnihJ.utn8PQQOSX/JaICzVgt/hvi1Qz1KcKq', 'sas@mail.ru'),
(12, 'Valeri', '$2b$10$SQ4zbPyiLzAgDZeVyGuYZ.LkeYSGJug9IJmA3paOVQLGf/QlQTgF.', 'Vavvii.12@mail.ru'),
(13, 'Лера', '$2y$10$YN.0ccrnokQLD0Ymt7qMOuzafBauEckZC2AGKLl5lUfy.rhwOMWuu', 'lera@mail.ru');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
