-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2025 at 05:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scilabreserve`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `roles` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `password`, `created_at`, `roles`) VALUES
(1, 'Dua', 'Joshua', 'Orlina', 'trickmic2@gmail.com', '$2y$10$NEeGjKDATUyfKwqBt2ShKeQUGJbPt3g9UU9oZZSWZpZW6tIL/Alj6', '2025-11-29 16:14:23', 'student'),
(2, 'Joshua', 'Joshua', 'Orlina', 'joshauorlina08@gmail.com', '$2y$10$..ysxd66okTK5QgqyjvWMe3gcTS55xPeQBW8/9UGnK/sbyNRE07Ha', '2025-11-29 17:20:40', ''),
(3, 'Joshu', 'Joshua', 'Orlina', 'trick123mic2@gmail.com', '$2y$10$8p5rAV2KOYuUkYuXadKvTuc5NtWLN50YRyCAabL85YDcbb9dYWnzi', '2025-12-01 02:40:17', 'student'),
(4, 'asdasd', 'asdasdas', 'dasdasd', 'asdasdasd@megaworldcorp.com', '$2y$10$7Ew8sBw5moNbqKfilS7EKOo2k6AZHpY17wTnuNOYJecwaoMsRz14a', '2025-12-01 02:40:40', 'student'),
(5, 'Duaa', 'Joshua', 'Orlina', 'trickmic2asd@gmail.com', '$2y$10$nuG9ghYGy7K1XHAF2/2RfutchByKtvsTuREueDOGddyonbYIqplWW', '2025-12-01 02:42:29', 'student'),
(6, 'a', 'a', 'a', 'a@gmail.com', '$2y$10$NlD.C7DWYwpm09mA.GNQ2.sgfNd05kBKu6PH2SlKaHBHJYVTJwiBe', '2025-12-01 02:44:01', 'student'),
(7, 'aas', 'ass', 'asas', 'ass@gmail.com', '$2y$10$8QvDCG6DoFw/oRvAt9ICBO9sTf8lp8EN0nm8GB0PQ5ZQZTy889yha', '2025-12-01 03:07:39', ''),
(8, 'pp', 'pp', 'pp', 'pp@gmail.com', '$2y$10$Sruksff4YML/5KZSx/0BiepchhixbGXIC5pK3K8pVXCnvQbABPv/K', '2025-12-01 03:11:04', ''),
(9, 'zz', 'zz', 'zz', 'zz@gmail.com', '$2y$10$OWggG9uQEEKAGtxBEyWMc.FnGakv4Nsc.kbqh4xlVFPWazdSPLstS', '2025-12-01 03:11:20', ''),
(10, 'asddddd', 'asdasda', 'asdq', 'asdasddd@gmail.com', '$2y$10$XlC89lDgCQzmYmeqiO3lDu8rcydslvbymdLjMZc3SVdcvlYXQb3si', '2025-12-01 03:12:17', ''),
(11, 'hh', 'hh', 'hh', 'hh@gmail.com', '$2y$10$adOKQ7I7PqXktT3l7DJ7buPSSw.mqEoBtM4lAaDnZGRLQQIyzWBxG', '2025-12-01 03:14:10', ''),
(12, 'xxx', 'xx', 'xx', 'xx@gmail.com', '$2y$10$NmhKZTKtcJzWx.yhtNEW2uuifyIhVy1iNF3O4CJ55z330HZbD/r9G', '2025-12-01 03:17:54', 'Array'),
(13, 'xx', 'xx', 'xx', 'xxa@gmail.com', '$2y$10$gQze2uiV5ubvmCGHz0XG1eey4gqPpTRBXFvFoKeiTQppgDL57afzK', '2025-12-01 03:22:10', 'teacher');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
