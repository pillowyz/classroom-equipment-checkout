-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Nov 10, 2025 at 09:33 PM
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
-- Database: `equipment`
--

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `device_id` int(11) NOT NULL,
  `device_name` varchar(100) NOT NULL,
  `device_type` varchar(50) NOT NULL,
  `status` enum('Available','Unavailable') NOT NULL DEFAULT 'Available',
  `last_checked_out` datetime DEFAULT NULL,
  `checked_out_by` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='check what devices are available';

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`device_id`, `device_name`, `device_type`, `status`, `last_checked_out`, `checked_out_by`) VALUES
(1, 'Test Laptop 1', 'Laptop', 'Available', '2025-10-02 20:26:09', NULL),
(2, 'Test Tablet 1', 'Tablet', 'Available', '2025-09-30 12:20:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_ID` varchar(10) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `student_email` varchar(100) NOT NULL,
  `password_hash` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_ID`, `student_name`, `student_email`, `password_hash`) VALUES
('123456789', 'Test Student', 'student@email.com', 'studentpassword');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `device_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `checkout_date` datetime NOT NULL DEFAULT current_timestamp(),
  `expected_return_date` datetime NOT NULL,
  `actual_return_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`transaction_id`, `student_id`, `device_id`, `quantity`, `checkout_date`, `expected_return_date`, `actual_return_date`) VALUES
(1, '123456789', 1, 1, '2025-09-30 12:22:24', '2025-09-30 18:22:17', '2025-09-30 12:26:03'),
(2, '987654231', 1, 1, '2025-10-02 20:26:09', '2025-10-03 02:25:51', '2025-11-03 19:02:15');

--
-- Triggers `transactions`
--
DELIMITER $$
CREATE TRIGGER `after_transaction_insert` AFTER INSERT ON `transactions` FOR EACH ROW BEGIN
    UPDATE devices
    SET status = 'Checked Out',
        last_checked_out = NOW(),
        checked_out_by = NEW.student_id
    WHERE device_id = NEW.device_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_transaction_update` AFTER UPDATE ON `transactions` FOR EACH ROW BEGIN
    -- Only act if actual_return_date is newly set
    IF NEW.actual_return_date IS NOT NULL AND OLD.actual_return_date IS NULL THEN
        UPDATE devices
        SET status = 'Available',       -- mark it available again
            checked_out_by = NULL
        WHERE device_id = NEW.device_id;
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`device_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_ID`),
  ADD UNIQUE KEY `student_email` (`student_email`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `device_id` (`device_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
