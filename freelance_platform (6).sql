-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 01 juil. 2025 à 11:53
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `freelance_platform`
--

-- --------------------------------------------------------

--
-- Structure de la table `appel_doffre`
--

CREATE TABLE `appel_doffre` (
  `id` int(11) NOT NULL,
  `entreprise_id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `duree` varchar(100) DEFAULT NULL,
  `lieu` varchar(255) DEFAULT NULL,
  `remote` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `appel_doffre`
--

INSERT INTO `appel_doffre` (`id`, `entreprise_id`, `titre`, `description`, `budget`, `deadline`, `created_at`, `updated_at`, `duree`, `lieu`, `remote`) VALUES
(6, 3, 'test21test21', 'test21', 60.00, '2025-06-12', '2025-05-26 14:22:51', '2025-05-26 14:22:51', '3 mois', 'test21', 1),
(7, 3, 'test21test21test21', 'test21', 80.00, '2025-05-30', '2025-05-26 14:28:31', '2025-05-26 14:28:31', '3 mois', 'test21test21vtest21', 1),
(8, 4, 'TEST23', 'TEST23', 60.00, '2025-05-31', '2025-05-27 07:42:07', '2025-05-27 07:42:07', '3 mois', 'TEST23', 1),
(9, 6, 'testKilliantestKillian', 'testKilliantestKilliantestKillian', 90.00, '2025-06-19', '2025-06-17 07:41:22', '2025-06-17 07:41:22', '3 mois', 'testKillian', 1),
(10, 9, 'hnfnfndfhn', 'rnhngfbbfhbhbbhbeh', 80.00, '2025-06-28', '2025-06-24 07:50:34', '2025-06-24 07:50:34', '3 mois', 'paris', 1);

-- --------------------------------------------------------

--
-- Structure de la table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `freelancer_id` int(11) NOT NULL,
  `coverLetter` text NOT NULL,
  `proposedRate` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `freelancer_id`, `coverLetter`, `proposedRate`, `createdAt`) VALUES
(3, 7, 12, 'test19test19test19test19', 60.00, '2025-05-27 12:23:06'),
(4, 7, 14, 'test22test22test22', 60.00, '2025-05-27 14:59:55'),
(5, 9, 23, 'testEmailtestEmailtestEmailtestEmail', 90.00, '2025-06-17 09:42:58'),
(6, 9, 22, 'test31test31test31', 90.00, '2025-06-17 09:50:02'),
(7, 9, 21, 'test30test30test30test30', 70.00, '2025-06-17 09:59:33'),
(8, 9, 25, 'test32test32test32test32', 90.00, '2025-06-17 10:08:55'),
(9, 9, 26, 'TEST45TEST45TEST45', 80.00, '2025-06-17 13:15:46'),
(10, 10, 29, 'tbrbtrbtrbtbtb(tb', 70.00, '2025-06-24 09:51:37');

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `user1_id`, `user2_id`, `job_id`, `title`, `created_at`) VALUES
(1, 28, 26, NULL, NULL, '2025-05-27 11:02:16'),
(2, 28, 27, NULL, NULL, '2025-05-27 11:56:13'),
(5, 28, 26, 7, NULL, '2025-05-27 14:47:35'),
(6, 26, 27, NULL, NULL, '2025-05-27 14:58:03'),
(7, 28, 29, NULL, NULL, '2025-05-27 14:59:22'),
(8, 28, 29, 7, 'Appel d\'offre : test21test21test21', '2025-05-27 15:00:11'),
(9, 26, 29, NULL, NULL, '2025-05-27 15:08:39'),
(10, 40, 39, NULL, NULL, '2025-06-16 15:09:11'),
(11, 40, 41, NULL, NULL, '2025-06-16 15:25:43'),
(12, 43, 39, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 09:43:54'),
(13, 43, 37, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 10:00:49'),
(14, 43, 39, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 10:02:08'),
(15, 43, 44, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 10:10:03'),
(16, 43, 44, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 10:13:55'),
(17, 43, 39, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 10:14:54'),
(18, 43, 45, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 13:16:18'),
(19, 43, 45, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 13:16:22'),
(20, 43, 45, 9, 'Appel d\'offre : testKilliantestKillian', '2025-06-17 13:16:25'),
(21, 45, 44, NULL, NULL, '2025-06-18 09:19:24'),
(22, 44, 38, NULL, NULL, '2025-06-18 09:59:17'),
(23, 44, 29, NULL, 'TEST2', '2025-06-18 10:05:10'),
(24, 46, 45, NULL, 'test46test46test46', '2025-06-18 10:28:08'),
(25, 50, 51, 10, 'Appel d\'offre : hnfnfndfhn', '2025-06-24 09:55:01'),
(26, 49, 29, NULL, 'test49test49test49', '2025-06-25 09:35:33'),
(27, 49, 31, NULL, 'test49test49test49', '2025-06-25 09:35:42'),
(28, 49, 32, NULL, 'test49test49test49', '2025-06-25 09:35:49'),
(29, 49, 33, NULL, 'test49test49test49', '2025-06-25 09:35:56'),
(30, 49, 34, NULL, 'test49test49', '2025-06-25 09:36:07'),
(31, 49, 35, NULL, 'test49test49test49test49', '2025-06-25 09:36:16'),
(32, 49, 36, NULL, 'test49test49test49test49', '2025-06-25 09:36:23'),
(33, 49, 37, NULL, 'test49test49test49', '2025-06-25 09:36:30'),
(34, 49, 38, NULL, 'test49test49test49test49', '2025-06-25 09:36:39'),
(35, 49, 39, NULL, 'test49test49test49test49', '2025-06-25 09:36:47'),
(36, 62, 26, NULL, 'test57test57', '2025-06-25 10:24:53'),
(37, 62, 27, NULL, 'test57test57test57', '2025-06-25 10:24:59'),
(38, 62, 29, NULL, 'test57test57test57', '2025-06-25 10:25:06'),
(39, 62, 31, NULL, 'test57test57test57', '2025-06-25 10:25:13'),
(40, 62, 32, NULL, 'test57test57test57', '2025-06-25 10:25:19'),
(41, 62, 33, NULL, 'test57test57', '2025-06-25 10:25:54'),
(42, 62, 34, NULL, 'test57test57test57', '2025-06-25 10:26:01'),
(43, 62, 35, NULL, 'test57test57test57test57', '2025-06-25 10:26:08'),
(44, 62, 36, NULL, 'test57test57test57test57', '2025-06-25 10:26:16'),
(45, 62, 37, NULL, 'test57test57test57test57', '2025-06-25 10:26:25'),
(46, 63, 26, NULL, 'test58test58', '2025-06-25 10:54:31'),
(47, 63, 27, NULL, 'test58test58test58test58', '2025-06-25 10:57:28'),
(48, 63, 29, NULL, 'test58test58test58', '2025-06-25 10:57:34'),
(49, 63, 31, NULL, 'test58test58test58', '2025-06-25 10:57:39'),
(50, 63, 32, NULL, 'test58test58', '2025-06-25 10:57:45'),
(51, 63, 33, NULL, 'test58test58test58', '2025-06-25 10:57:51'),
(52, 63, 34, NULL, 'test58test58test58', '2025-06-25 10:57:57'),
(53, 63, 35, NULL, 'test58test58test58', '2025-06-25 10:58:03'),
(54, 63, 36, NULL, 'test58test58test58', '2025-06-25 10:58:10'),
(55, 63, 37, NULL, 'test58test58test58test58', '2025-06-25 10:58:17'),
(56, 64, 26, NULL, 'test59test59', '2025-06-25 11:00:32'),
(57, 64, 27, NULL, 'test59test59test59', '2025-06-25 11:00:38'),
(58, 64, 29, NULL, 'test59test59', '2025-06-25 11:00:45'),
(59, 64, 31, NULL, 'test59test59', '2025-06-25 11:00:51'),
(60, 64, 32, NULL, 'test59test59', '2025-06-25 11:00:56'),
(61, 64, 33, NULL, 'test59test59', '2025-06-25 11:01:02'),
(62, 64, 34, NULL, 'test59test59test59', '2025-06-25 11:01:08'),
(63, 64, 35, NULL, 'test59test59', '2025-06-25 11:01:15'),
(64, 64, 36, NULL, 'test59test59test59', '2025-06-25 11:01:21'),
(65, 64, 37, NULL, 'test59test59test59', '2025-06-25 11:01:28'),
(66, 64, 38, NULL, 'test59test59test59', '2025-06-25 11:01:35');

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `siret` varchar(14) DEFAULT NULL,
  `vat_number` varchar(20) DEFAULT NULL,
  `registration_city` varchar(100) DEFAULT NULL,
  `legal_status` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `user_id`, `name`, `siret`, `vat_number`, `registration_city`, `legal_status`, `address`, `website`, `logo`, `description`) VALUES
(3, 28, 'test21', '12345678901234', 'fr11111111111', 'test', 'test21', 'test21', 'https://lovable.dev/', 'test8', 'test21'),
(4, 30, 'TEST23', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'TEST23'),
(5, 40, 'test', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'testEmailchattestEmailchattestEmailchat'),
(6, 43, 'testKillian', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'testKilliantestKilliantestKillian'),
(7, 46, 'test46', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '/uploads/logos/logo-1750235245999-702292408.jpg', 'test46test46test46'),
(8, 49, 'test49', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'test49test49'),
(9, 50, 'test50', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'test50test50test50'),
(10, 62, 'test57', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'test57'),
(11, 63, 'test58', '12345678901234', 'fr11111111111', 'test', 'test8', '1 Rue de la Haye', 'https://lovable.dev/', '', 'test58test58test58test58');

-- --------------------------------------------------------

--
-- Structure de la table `freelances`
--

CREATE TABLE `freelances` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `availability` enum('Disponible','Indisponible') DEFAULT 'Disponible',
  `experience_years` int(11) DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `portfolio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`portfolio`)),
  `siret` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `freelances`
--

INSERT INTO `freelances` (`id`, `user_id`, `title`, `specialization`, `location`, `hourly_rate`, `description`, `skills`, `availability`, `experience_years`, `avatar`, `portfolio`, `siret`) VALUES
(12, 26, 'test19', 'test19', 'test', 60.00, 'test19', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 13, '', '[\"test19\"]', NULL),
(13, 27, 'test20', 'Design résidentiel', 'test20', 80.00, 'test20', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 14, '', '[\"test20\"]', NULL),
(14, 29, 'TEST22', 'TEST22', 'TEST22', 60.00, 'TEST22', 'TEST22', 'Disponible', 0, '', '[]', NULL),
(15, 31, 'architecte', 'Design résidentiel', 'paris', 70.00, 'test24test24', 'AutoCADRevit', 'Disponible', 13, '', '[\"https://github.com/KillianKS\"]', NULL),
(16, 32, 'architecte', 'Design résidentiel', 'clamart', 60.00, 'test25test25test25test25', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 12, '', '[\"test25test25\",\"test25test25test25\",\"test25test25\"]', NULL),
(17, 33, 'architecte', 'Design résidentiel', 'clamart', 80.00, 'test26test26test26test26', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 10, '/uploads/avatars/1750063090220-60316324.jpg', '[\"test26\"]', NULL),
(18, 34, 'architecte', 'Design résidentiel', 'clamart', 80.00, 'test27test27test27', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 11, '', '[{\"url\":\"https://github.com/KillianKS\"},{\"url\":\"https://github.com/KillianKS\"},{\"title\":\"Projet Rénovation\",\"description\":\"test27test27test27test27test27test27test27test27test27test27\",\"image\":\"/uploads/avatars/1750067015786-716853627.jpg\"}]', NULL),
(19, 35, 'architecte', 'Design résidentiel', 'clamart', 90.00, 'test28test28test28test28', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 2, '/uploads/avatars/1750073797211-681194542.jpg', '[{\"title\":\"test28\",\"description\":\"test28test28test28test28test28test28test28\",\"image\":\"/uploads/avatars/1750073832598-735808079.jpg\"}]', NULL),
(20, 36, 'architecte', 'Design résidentiel', 'clamart', 80.00, 'test29test29test29test29', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 10, '/uploads/avatars/1750076010953-651234050.jpg', '[{\"title\":\"test29test29\",\"description\":\"test29test29test29test29test29test29\",\"image\":\"/uploads/avatars/1750076034318-153765530.jpg\"}]', NULL),
(21, 37, 'architecte', 'Design résidentiel', 'clamart', 60.00, 'test30test30test30', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 4, '/uploads/avatars/1750077502553-211807127.jpg', '[{\"title\":\"test30test30test30\",\"description\":\"test30test30test30test30test30test30test30\",\"image\":\"\"}]', NULL),
(22, 38, 'architecte', 'Design résidentiel', 'clamart', 60.00, 'test31test31', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 8, '/uploads/avatars/1750078106361-696397661.jpg', '[{\"title\":\"test31test31test31\",\"description\":\"test31test31test31test31\",\"image\":\"\"}]', NULL),
(23, 39, 'architecte', 'Design résidentiel', 'clamart', 70.00, 'testEmailtestEmailtestEmail', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 11, '', '[]', NULL),
(24, 41, 'architecte', 'Design résidentiel', 'clamart', 60.00, 'testemail2testemail2', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 6, '', '[]', NULL),
(25, 44, 'architecte', 'Design résidentiel', 'clamart', 80.00, 'test32test32test32', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 9, '', '[]', NULL),
(26, 45, 'ARCHITECTE', 'Design résidentiel', 'clamart', 70.00, 'TEST45TEST45TEST45', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 12, '', '[]', NULL),
(27, 47, 'architecte', 'Design résidentiel', 'clamart', 80.00, 'test47test47test47', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 5, '/uploads/avatars/1750237744394-150767528.jpg', '[]', NULL),
(28, 48, 'architeeeecte', 'Design résidentiel', 'clamart', 88.00, 'test48test48test48test48', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 2, '/uploads/avatars/1750238234551-894057012.jpg', '[{\"title\":\"test48test48test48test48\",\"description\":\"test48test48test48test48\",\"image\":\"/uploads/avatars/1750238231170-199221696.jpg\"}]', NULL),
(29, 51, 'architecte', 'Design résidentiel', 'clamart', 90.00, 'test51test51test51', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 4, '', '[]', NULL),
(30, 52, 'architecte', 'Design résidentiel', 'clamart', 800.00, 'test52test52test52', '[\"AutoCAD\",\"Revit\",\"Design durable\",\"Modélisation 3D\"]', 'Disponible', 3, '/uploads/avatars/1750336410015-643459843.jpg', '[{\"title\":\"test52test52test52\",\"description\":\"test52test52test52\",\"image\":\"/uploads/avatars/1750336401722-743495839.png\"},{\"title\":\"test52test52test52test52\",\"description\":\"test52test52test52test52\",\"url\":\"\",\"image\":\"\"},{\"title\":\"testtesttesttesttest\",\"description\":\"testtesttesttest\",\"url\":\"\",\"image\":\"\"},{\"title\":\"test52test52test52test52test52test52\",\"description\":\"test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52\",\"url\":\"https://github.com/KillianKS/BimplyFreelance/blob/main/project/.gitignore\",\"image\":\"\"},{\"title\":\"test52test52test52\",\"description\":\"test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52v\",\"url\":\"\",\"image\":\"\"},{\"title\":\"test52test52\",\"description\":\"test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52test52\",\"url\":\"\",\"image\":\"\"},{\"title\":\"test52test52test52\",\"description\":\"test52test52test52\",\"url\":\"\",\"image\":\"\"}]', NULL),
(31, 55, 'architecte', 'Design résidentiel', 'clamart', 90.00, 'test52test52test52', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 11, '', '[]', NULL),
(32, 57, 'archi', 'Design résidentiel', 'clamart', 70.00, 'test54test54test54test54test54', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 10, '', '[]', '12345678901234'),
(33, 60, 'archi', 'urbanisme', 'Paris', 90.00, 'test55test55test55test55', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 8, '', '[]', '12345678901234'),
(34, 61, 'arci', 'Design résidentiel', 'clamart', 90.00, 'test56test56test56', '[\"AutoCAD\",\"Revit\",\"Design durable\",\"Modélisation 3D\"]', 'Indisponible', 0, '', '[]', '12345678901234'),
(35, 64, 'archi', 'Design résidentiel', 'clamart', 87.00, 'test59test59test59test59', 'AutoCAD, Revit, Design durable, Modélisation 3D', 'Disponible', 10, '', '[]', '12345678901234');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `subject` varchar(255) DEFAULT NULL,
  `receiver_id` int(11) NOT NULL,
  `sender_role` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `created_at`, `subject`, `receiver_id`, `sender_role`) VALUES
(1, 1, 28, 'test21test21test21', '2025-05-27 11:10:31', 'test21test21', 0, NULL),
(2, 2, 28, 'test21test21test21', '2025-05-27 11:56:13', 'test21test21', 0, NULL),
(3, 2, 27, 'test', '2025-05-27 12:06:03', NULL, 0, NULL),
(4, 2, 27, 'tesssddsvs', '2025-05-27 12:06:07', NULL, 0, NULL),
(5, 5, 28, 'salut', '2025-05-27 14:47:39', NULL, 0, NULL),
(6, 5, 28, 'test', '2025-05-27 14:47:41', NULL, 0, NULL),
(7, 6, 26, 'teeeeeeestteeeeeeestteeeeeeestteeeeeeest', '2025-05-27 14:58:03', 'teeeeeeest', 0, NULL),
(8, 7, 28, 'test21test21test21', '2025-05-27 14:59:22', 'test21', 0, NULL),
(9, 9, 26, 'tsqfsvs', '2025-05-27 15:08:39', 'treeeee', 0, NULL),
(10, 10, 40, 'testEmailchattestEmailchattestEmailchat', '2025-06-16 15:09:11', 'testEmailchat', 0, NULL),
(11, 10, 40, 'testEmailchattestEmailchattestEmailchattestEmailchattestEmailchat', '2025-06-16 15:11:34', 'testEmailchattestEmailchattestEmailchattestEmailchat', 0, NULL),
(12, 10, 40, 'testEmailchattestEmailchattestEmailchat', '2025-06-16 15:21:55', 'testEmailchat', 0, NULL),
(13, 10, 40, 'testEmailchattestEmailchattestEmailchat', '2025-06-16 15:22:05', NULL, 0, NULL),
(14, 10, 40, 'testEmailchattestEmailchattestEmailchat', '2025-06-16 15:22:06', NULL, 0, NULL),
(15, 10, 40, 'testEmailchattestEmailchattestEmailchat', '2025-06-16 15:22:17', NULL, 0, NULL),
(16, 11, 40, 'testemail2testemail2', '2025-06-16 15:25:43', 'testemail2testemail2', 0, NULL),
(17, 15, 43, 'tttt', '2025-06-17 10:10:19', NULL, 0, NULL),
(18, 16, 43, 'ttt', '2025-06-17 10:13:57', NULL, 0, NULL),
(19, 17, 43, 'tt', '2025-06-17 10:14:56', NULL, 0, NULL),
(20, 17, 39, 'ttttt', '2025-06-17 10:15:42', NULL, 0, NULL),
(21, 21, 45, 'TEEEESTRTEEEESTRTEEEESTRTEEEESTR', '2025-06-18 09:19:24', 'TEEEESTR', 0, NULL),
(22, 21, 45, 'ccccccccccccccc', '2025-06-18 09:25:57', 'ccccccccccccccc', 0, NULL),
(23, 22, 44, 'TESTTESTTEST', '2025-06-18 09:59:17', 'TEST', 0, NULL),
(24, 22, 44, 'TEST2TEST2TEST2', '2025-06-18 10:04:56', 'TEST2', 0, NULL),
(25, 23, 44, 'TEST2TEST2TEST2', '2025-06-18 10:05:10', 'TEST2', 0, NULL),
(26, 24, 46, 'test46test46test46test46', '2025-06-18 10:28:08', 'test46test46test46', 0, NULL),
(27, 25, 50, 'ttttffrfecfvgvgv', '2025-06-24 09:55:14', NULL, 0, NULL),
(28, 26, 49, 'test49test49test49test49', '2025-06-25 09:35:33', 'test49test49test49', 0, NULL),
(29, 27, 49, 'test49test49test49test49', '2025-06-25 09:35:42', 'test49test49test49', 0, NULL),
(30, 28, 49, 'test49test49test49test49', '2025-06-25 09:35:49', 'test49test49test49', 0, NULL),
(31, 29, 49, 'test49test49test49test49', '2025-06-25 09:35:56', 'test49test49test49', 0, NULL),
(32, 30, 49, 'bbbvvtest49test49', '2025-06-25 09:36:08', 'test49test49', 0, NULL),
(33, 31, 49, 'test49test49test49test49', '2025-06-25 09:36:16', 'test49test49test49test49', 0, NULL),
(34, 32, 49, 'test49test49test49test49', '2025-06-25 09:36:23', 'test49test49test49test49', 0, NULL),
(35, 33, 49, 'test49test49test49test49', '2025-06-25 09:36:31', 'test49test49test49', 0, NULL),
(36, 34, 49, 'test49test49test49test49', '2025-06-25 09:36:39', 'test49test49test49test49', 0, NULL),
(37, 35, 49, 'test49test49test49test49test49', '2025-06-25 09:36:47', 'test49test49test49test49', 0, NULL),
(38, 36, 62, 'test57test57', '2025-06-25 10:24:53', 'test57test57', 0, NULL),
(39, 37, 62, 'test57test57test57test57', '2025-06-25 10:24:59', 'test57test57test57', 0, NULL),
(40, 38, 62, 'test57test57test57test57test57', '2025-06-25 10:25:06', 'test57test57test57', 0, NULL),
(41, 39, 62, 'test57test57test57test57', '2025-06-25 10:25:13', 'test57test57test57', 0, NULL),
(42, 40, 62, 'test57test57test57test57', '2025-06-25 10:25:19', 'test57test57test57', 0, NULL),
(43, 41, 62, 'test57test57test57', '2025-06-25 10:25:54', 'test57test57', 0, NULL),
(44, 42, 62, 'test57test57test57test57test57', '2025-06-25 10:26:01', 'test57test57test57', 0, NULL),
(45, 43, 62, 'test57test57test57test57', '2025-06-25 10:26:08', 'test57test57test57test57', 0, NULL),
(46, 44, 62, 'test57test57test57test57test57', '2025-06-25 10:26:16', 'test57test57test57test57', 0, NULL),
(47, 45, 62, 'test57test57test57test57test57', '2025-06-25 10:26:25', 'test57test57test57test57', 0, NULL),
(48, 46, 63, 'test58test58test58test58test58', '2025-06-25 10:57:21', 'test58test58test58test58', 26, 'entreprise'),
(49, 47, 63, 'test58test58test58test58test58', '2025-06-25 10:57:28', 'test58test58test58test58', 27, 'entreprise'),
(50, 48, 63, 'test58test58test58test58test58', '2025-06-25 10:57:34', 'test58test58test58', 29, 'entreprise'),
(51, 49, 63, 'test58test58', '2025-06-25 10:57:39', 'test58test58test58', 31, 'entreprise'),
(52, 50, 63, 'test58test58test58test58', '2025-06-25 10:57:45', 'test58test58', 32, 'entreprise'),
(53, 51, 63, 'test58test58test58test58', '2025-06-25 10:57:51', 'test58test58test58', 33, 'entreprise'),
(54, 52, 63, 'test58test58test58test58', '2025-06-25 10:57:57', 'test58test58test58', 34, 'entreprise'),
(55, 53, 63, 'test58test58test58', '2025-06-25 10:58:03', 'test58test58test58', 35, 'entreprise'),
(56, 54, 63, 'test58test58test58test58', '2025-06-25 10:58:10', 'test58test58test58', 36, 'entreprise'),
(57, 55, 63, 'test58test58test58test58test58', '2025-06-25 10:58:17', 'test58test58test58test58', 37, 'entreprise'),
(58, 56, 64, 'test59test59test59', '2025-06-25 11:00:32', 'test59test59', 26, 'freelance'),
(59, 57, 64, 'test59test59test59test59', '2025-06-25 11:00:38', 'test59test59test59', 27, 'freelance'),
(60, 58, 64, 'test59test59test59test59test59', '2025-06-25 11:00:45', 'test59test59', 29, 'freelance'),
(61, 59, 64, 'test59test59test59test59', '2025-06-25 11:00:51', 'test59test59', 31, 'freelance'),
(62, 60, 64, 'test59test59test59test59', '2025-06-25 11:00:56', 'test59test59', 32, 'freelance'),
(63, 61, 64, 'test59test59test59test59', '2025-06-25 11:01:02', 'test59test59', 33, 'freelance'),
(64, 62, 64, 'test59test59test59test59', '2025-06-25 11:01:08', 'test59test59test59', 34, 'freelance'),
(65, 63, 64, 'test59test59test59test59', '2025-06-25 11:01:15', 'test59test59', 35, 'freelance'),
(66, 64, 64, 'test59test59test59test59test59', '2025-06-25 11:01:21', 'test59test59test59', 36, 'freelance'),
(67, 65, 64, 'test59test59test59test59', '2025-06-25 11:01:28', 'test59test59test59', 37, 'freelance'),
(68, 66, 64, 'test59test59test59test59', '2025-06-25 11:01:35', 'test59test59test59', 38, 'freelance');

-- --------------------------------------------------------

--
-- Structure de la table `portfolio`
--

CREATE TABLE `portfolio` (
  `id` int(11) NOT NULL,
  `freelance_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `portfolio`
--

INSERT INTO `portfolio` (`id`, `freelance_id`, `title`, `description`, `image`, `url`, `created_at`) VALUES
(1, 19, 'test28', 'test28test28test28test28test28test28test28', '/uploads/avatars/1750073832598-735808079.jpg', NULL, '2025-06-16 14:12:53'),
(2, 20, 'test29test29', 'test29test29test29test29test29test29', '/uploads/avatars/1750076034318-153765530.jpg', NULL, '2025-06-16 14:13:57'),
(3, 21, 'test30test30test30', 'test30test30test30test30test30test30test30', NULL, NULL, '2025-06-16 14:38:52'),
(4, 22, 'test31test31test31', 'test31test31test31test31', NULL, NULL, '2025-06-16 14:49:05'),
(5, 28, 'test48test48test48test48', 'test48test48test48test48', '/uploads/avatars/1750238231170-199221696.jpg', NULL, '2025-06-18 11:17:40'),
(6, 30, 'test52test52test52', 'test52test52test52', '/uploads/avatars/1750336401722-743495839.png', NULL, '2025-06-19 14:33:51'),
(7, 30, 'clamartclamartclamart', 'clamartclamartclamartclamart', NULL, NULL, '2025-06-19 14:56:16'),
(8, 30, 'clamartclamartclamart', 'clamartclamartclamartclamart', NULL, NULL, '2025-06-19 15:00:29'),
(9, 30, 'DisponibleDisponibleDisponible', 'DisponibleDisponibleDisponible', '/uploads/portfolio/1750338112647-220420691.png', NULL, '2025-06-19 15:01:53'),
(10, 30, 'Design résidentielDesign résidentielDesign résidentiel', 'Design résidentielDesign résidentielDesign résidentiel', '/uploads/portfolio/1750338240573-306028441.jpg', NULL, '2025-06-19 15:04:01');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('freelance','entreprise') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expire` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `reset_token`, `reset_token_expire`) VALUES
(26, 'test19', 'test19@test19.com', 'test19', 'freelance', '2025-05-26 12:11:19', NULL, NULL),
(27, 'test20', 'test20@test20.com', 'test20', 'freelance', '2025-05-26 12:16:10', NULL, NULL),
(28, 'test21', 'test21@test21.com', 'test21', 'entreprise', '2025-05-26 12:20:26', NULL, NULL),
(29, 'TEST22', 'TEST22@TEST22.COM', 'TEST22', 'freelance', '2025-05-27 07:40:14', NULL, NULL),
(30, 'TEST23', 'test23@test23.com', 'TEST23', 'entreprise', '2025-05-27 07:41:43', NULL, NULL),
(31, 'test24', 'test24@test24.com', 'test2424', 'freelance', '2025-06-16 08:10:19', NULL, NULL),
(32, 'test25', 'test25@test25.com', 'test25test25', 'freelance', '2025-06-16 08:34:12', NULL, NULL),
(33, 'test26', 'test26@test26.com', 'test26test26', 'freelance', '2025-06-16 08:38:41', NULL, NULL),
(34, 'test27', 'test27@test27.com', 'test27test27', 'freelance', '2025-06-16 09:43:39', NULL, NULL),
(35, 'test28', 'test28@test28.com', 'test28test28', 'freelance', '2025-06-16 11:37:15', NULL, NULL),
(36, 'test29', 'test29@test29.com', 'test29test29', 'freelance', '2025-06-16 12:13:57', NULL, NULL),
(37, 'test30', 'test30@test30.com', '$2b$10$zXv7ojsH9qJKr/Gn2HfnYOCkDl0SeMMp9C9G5vCKHk5UBdg4/Nl2u', 'freelance', '2025-06-16 12:38:52', NULL, NULL),
(38, 'test31', 'test31@test31.com', '$2b$10$1ZViT6Zs7e2PNygLsM0vZ.WlldKrLn6V8ElP2e7G/eEv4PTYGfMRa', 'freelance', '2025-06-16 12:49:05', NULL, NULL),
(39, 'testEmail', 'killian.ngog@gmail.com', '$2b$10$seK4bBVkXw/0sRoSJJ/ffeMsL2pbrvFvw1N/BzI.pTTf4ec.9vS1a', 'freelance', '2025-06-16 13:07:24', NULL, NULL),
(40, 'testEmailchat', 'testEmailchat@testEmailchat.com', '$2b$10$CN2uPfUGeohEY0MfRGMpWus9dqisBpM7keavJe68jxP5PR/cPHnNe', 'entreprise', '2025-06-16 13:09:00', NULL, NULL),
(41, 'testemail2', 'fatalitykiki@gmail.com', '$2b$10$FYgLqk8Sh5xZqQcWWK2Mi.n3xJUkdYpMiTGdgHhxX21i14nExjSfq', 'freelance', '2025-06-16 13:25:26', NULL, NULL),
(43, 'testKillian', 'killian.cegef@orange.fr', '$2b$10$4yHcLDxA7fxZaW7rnFH0ZOh9NhUZeO68r1fQhZbyWFXbxteaFJzBW', 'entreprise', '2025-06-17 07:41:01', NULL, NULL),
(44, 'test32', 'test32@test32.com', '$2b$10$Fio8W2nLZGtveVfIR9WRyuClwSN3RSaDkFpAOkf7EPXjPI3SnJL2O', 'freelance', '2025-06-17 08:08:44', NULL, NULL),
(45, 'TEST45', 'test45@test45.com', '$2b$10$WopOUJsfYrYrAS14hEg6HusFmeMBm/r/gcyHQUfuyGQ8zfdlD7z2a', 'freelance', '2025-06-17 11:15:36', NULL, NULL),
(46, 'test46', 'test46@test46.com', '$2b$10$Z5F/o9zNUiiLTGuA3Z0l..cPA3gMYuvbLk6OYFong61zvBumeSlNW', 'entreprise', '2025-06-18 08:27:51', NULL, NULL),
(47, 'test47', 'test47@test47.com', '$2b$10$amdtjbIw8qgOMfuzpD7DRedWPtF2qPsck5d9/.qytyZ1HZLof66CC', 'freelance', '2025-06-18 09:09:34', NULL, NULL),
(48, 'test48', 'test48@test48.com', '$2b$10$XDFItS/SAOItW8nBz.4kqOl0UhatcFTBbXLjq1mc.SG4EgbiTwwSu', 'freelance', '2025-06-18 09:17:40', NULL, NULL),
(49, 'test49', 'test49@test49.com', '$2b$10$Pkv.C5DHzqWZgrrgtUkSE.ft5.pz.UlZhd7019cy1bgAKlw3YUOWO', 'entreprise', '2025-06-19 08:04:32', NULL, NULL),
(50, 'test50', 'test50@test50.com', '$2b$10$oSnymO997uOzjPMhIXe.pe65FvEKdOKkeuwYJks4qHxRVnl.aCA6C', 'entreprise', '2025-06-19 08:13:17', NULL, NULL),
(51, 'test51', 'test51@test51.com', '$2b$10$4pLeH87xCV3mj6v8vwiIY.g.bms2zevzS5mZhpzF8zKBlVLsW1DXO', 'freelance', '2025-06-19 08:16:50', NULL, NULL),
(52, 'test52', 'test52@test52.com', '$2b$10$kWp5cGe4GabBU3F/zoJHqew1/rt1H9ocF9vZvwBgOiDYTr7bVBcPm', 'freelance', '2025-06-19 12:33:51', NULL, NULL),
(55, 'Killian', 'test53@test53.com', '$2b$10$OcwGAbCSqvgGCMEHH50gKOm72GZetwbZZCkgiwUjLQ4Agiagy.IRS', 'freelance', '2025-06-24 08:27:21', NULL, NULL),
(57, 'Killiann', 'test54@test54.com', '$2b$10$iSb4pMMRnlEYVJEWclOf4eNJaDDvxkWfisoFyTq.oRWFV5uqGieIa', 'freelance', '2025-06-24 08:38:00', NULL, NULL),
(60, 'Killian', 'test55@test55.com', '$2b$10$opeP1dKc0a/1O4N/LoyySOxWxnGwyuD1L7b3MOhVay45g0EOQPDu.', 'freelance', '2025-06-24 08:55:09', NULL, NULL),
(61, 'test56', 'test56@test56.com', '$2b$10$D.iZ/IVnGwy3W73jJwmK.O1jnwg8rifLEDO4EI5wOZaolGbGOsIee', 'freelance', '2025-06-25 07:45:26', NULL, NULL),
(62, 'test57', 'test57@test57.com', '$2b$10$vTx2vQsvRhw74OHgDAQGNu/6Q/jMDd/d4ydUDkbhiO3qBn3bJEr3K', 'entreprise', '2025-06-25 07:51:37', NULL, NULL),
(63, 'test58', 'test58@test58.com', '$2b$10$kU.8EVWjTf9gPKOMKHAHgesvoKT92GkHYpma6AHFU9dIMP/LrfrPS', 'entreprise', '2025-06-25 08:54:09', NULL, NULL),
(64, 'test59', 'test59@test59.com', '$2b$10$6RmEk37x8MeGzeeU3SmYLOaxT3fSwIuiy0pGuGpegxqSI/xAmhM7u', 'freelance', '2025-06-25 09:00:20', NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `appel_doffre`
--
ALTER TABLE `appel_doffre`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entreprise_id` (`entreprise_id`);

--
-- Index pour la table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `freelancer_id` (`freelancer_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user1_id` (`user1_id`),
  ADD KEY `user2_id` (`user2_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `freelances`
--
ALTER TABLE `freelances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Index pour la table `portfolio`
--
ALTER TABLE `portfolio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `freelance_id` (`freelance_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appel_doffre`
--
ALTER TABLE `appel_doffre`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `freelances`
--
ALTER TABLE `freelances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT pour la table `portfolio`
--
ALTER TABLE `portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `appel_doffre`
--
ALTER TABLE `appel_doffre`
  ADD CONSTRAINT `appel_doffre_ibfk_1` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `appel_doffre` (`id`),
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`freelancer_id`) REFERENCES `freelances` (`id`);

--
-- Contraintes pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`job_id`) REFERENCES `appel_doffre` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `entreprises_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `freelances`
--
ALTER TABLE `freelances`
  ADD CONSTRAINT `freelances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `portfolio`
--
ALTER TABLE `portfolio`
  ADD CONSTRAINT `portfolio_ibfk_1` FOREIGN KEY (`freelance_id`) REFERENCES `freelances` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
