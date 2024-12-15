--server\db_query.sql
CREATE DATABASE db_project34;

CREATE TABLE `tbl_activities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_activities`
--

INSERT INTO `tbl_activities` (`id`, `name`, `status`) VALUES
(68, 'Шпакловка', 'active'),
(72, 'Саниране', 'active'),
(73, 'Лене на бетон', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_artisans`
--

CREATE TABLE `tbl_artisans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` text NOT NULL,
  `number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_artisans`
--

INSERT INTO `tbl_artisans` (`id`, `name`, `note`, `number`, `email`, `company_id`, `user_id`, `status`) VALUES
(28, 'Joro', '', '0888888888', 'joro@abv.bg', 1, 2, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_companies`
--

CREATE TABLE `tbl_companies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `mol` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `dds` enum('yes','no') NOT NULL DEFAULT 'no',
  `status` enum('active','inactive') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_companies`
--

INSERT INTO `tbl_companies` (`id`, `name`, `number`, `address`, `mol`, `email`, `phone`, `dds`, `status`) VALUES
(1, 'БЛД', '359439343', 'gr. truna', 'Петър Петров', 'bld@abv.bg', '088999999', 'no', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_measures`
--

CREATE TABLE `tbl_measures` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_measures`
--

INSERT INTO `tbl_measures` (`id`, `name`) VALUES
(19, 'квадратен метър'),
(20, 'линеен метър'),
(21, 'метър'),
(22, 'свършена рабта'),
(23, 'уговорка'),
(26, 'на брой');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_projects`
--

CREATE TABLE `tbl_projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_projects`
--

INSERT INTO `tbl_projects` (`id`, `name`, `company_id`, `company_name`, `email`, `address`, `start_date`, `end_date`, `note`, `status`) VALUES
(30, 'Сграда Авигея', 1, 'БЛД', 'bld@abv.bg', 'Дружба 1', '2024-12-01', '2025-03-31', '', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tasks`
--

CREATE TABLE `tbl_tasks` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `artisan_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `measure_id` int(11) NOT NULL,
  `price_per_measure` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `total_work_in_selected_measure` decimal(10,2) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_tasks`
--

INSERT INTO `tbl_tasks` (`id`, `project_id`, `name`, `artisan_id`, `activity_id`, `measure_id`, `price_per_measure`, `total_price`, `total_work_in_selected_measure`, `start_date`, `end_date`, `note`, `status`) VALUES
(49, 30, 'Леене на основи', 28, 68, 19, 100.00, 10000.00, 2500.00, '2024-12-01', '2024-12-31', '', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name_and_family` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `manager` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name_and_family`, `username`, `password`, `role`, `status`, `manager`) VALUES
(1, 'Dido Manager', 'didodido', '$2b$10$ChOJrboeZ9v2werX7Mp/XORRf3ju4g7Z4..g7sePd9zZMMj7ac8c.', 'manager', 'active', NULL),
(2, 'tabakov', 'tabakov', '$2b$10$MRRgf.kbIqCo.nyjcrDsMuCa3X.piPv86MsW/hp5R1z98Ekb0RpZC', 'user', 'active', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_workitems`
--

CREATE TABLE `tbl_workitems` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  `finished_work` text DEFAULT NULL,
  `status` enum('done','in_progress') NOT NULL DEFAULT 'in_progress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_workitems`
--

INSERT INTO `tbl_workitems` (`id`, `task_id`, `name`, `start_date`, `end_date`, `note`, `finished_work`, `status`) VALUES
(923, 49, 'леене кота 0', '2024-12-01', '2024-12-07', '', '100', 'in_progress');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_activities`
--
ALTER TABLE `tbl_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_artisans`
--
ALTER TABLE `tbl_artisans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_companies`
--
ALTER TABLE `tbl_companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_measures`
--
ALTER TABLE `tbl_measures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_projects`
--
ALTER TABLE `tbl_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_tasks`
--
ALTER TABLE `tbl_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artisan_id` (`artisan_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `measure_id` (`measure_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_manager_tbl_users_id` (`manager`);

--
-- Indexes for table `tbl_workitems`
--
ALTER TABLE `tbl_workitems`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_activities`
--
ALTER TABLE `tbl_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `tbl_artisans`
--
ALTER TABLE `tbl_artisans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tbl_companies`
--
ALTER TABLE `tbl_companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_measures`
--
ALTER TABLE `tbl_measures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tbl_projects`
--
ALTER TABLE `tbl_projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `tbl_tasks`
--
ALTER TABLE `tbl_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=265;

--
-- AUTO_INCREMENT for table `tbl_workitems`
--
ALTER TABLE `tbl_workitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=924;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `fk_manager_tbl_users_id` FOREIGN KEY (`manager`) REFERENCES `tbl_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
