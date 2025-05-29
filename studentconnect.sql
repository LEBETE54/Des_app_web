-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: studentconnect
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asesor_detalles`
--

DROP TABLE IF EXISTS `asesor_detalles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asesor_detalles` (
  `usuario_id` int(11) NOT NULL,
  `descripcion_corta` varchar(255) DEFAULT NULL,
  `biografia_extendida` text DEFAULT NULL,
  `disponibilidad_general_texto` text DEFAULT NULL,
  `tarifa_descripcion` varchar(100) DEFAULT NULL,
  `enlace_video_presentacion_url` varchar(255) DEFAULT NULL,
  `promedio_calificacion` decimal(3,2) DEFAULT NULL,
  `total_asesorias_dadas` int(11) DEFAULT 0,
  PRIMARY KEY (`usuario_id`),
  CONSTRAINT `asesor_detalles_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asesor_detalles`
--

LOCK TABLES `asesor_detalles` WRITE;
/*!40000 ALTER TABLE `asesor_detalles` DISABLE KEYS */;
/*!40000 ALTER TABLE `asesor_detalles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asesor_materias`
--

DROP TABLE IF EXISTS `asesor_materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asesor_materias` (
  `asesor_usuario_id` int(11) NOT NULL,
  `materia_id` int(11) NOT NULL,
  PRIMARY KEY (`asesor_usuario_id`,`materia_id`),
  KEY `materia_id` (`materia_id`),
  CONSTRAINT `asesor_materias_ibfk_1` FOREIGN KEY (`asesor_usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `asesor_materias_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asesor_materias`
--

LOCK TABLES `asesor_materias` WRITE;
/*!40000 ALTER TABLE `asesor_materias` DISABLE KEYS */;
/*!40000 ALTER TABLE `asesor_materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificados`
--

DROP TABLE IF EXISTS `certificados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `nombre_certificado` varchar(150) NOT NULL,
  `institucion_emisora` varchar(150) DEFAULT NULL,
  `fecha_obtencion` date DEFAULT NULL,
  `archivo_url` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `valido_hasta` date DEFAULT NULL,
  `fecha_carga` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `certificados_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificados`
--

LOCK TABLES `certificados` WRITE;
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habilidades_catalogo`
--

DROP TABLE IF EXISTS `habilidades_catalogo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `habilidades_catalogo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_habilidad` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_habilidad` (`nombre_habilidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habilidades_catalogo`
--

LOCK TABLES `habilidades_catalogo` WRITE;
/*!40000 ALTER TABLE `habilidades_catalogo` DISABLE KEYS */;
/*!40000 ALTER TABLE `habilidades_catalogo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_disponibles_asesor`
--

DROP TABLE IF EXISTS `horarios_disponibles_asesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `horarios_disponibles_asesor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asesor_usuario_id` int(11) NOT NULL,
  `titulo_asesoria` varchar(255) NOT NULL,
  `descripcion_asesoria` text DEFAULT NULL,
  `materia_id` int(11) DEFAULT NULL,
  `fecha_hora_inicio` datetime NOT NULL,
  `fecha_hora_fin` datetime NOT NULL,
  `modalidad` enum('presencial','virtual') NOT NULL DEFAULT 'virtual',
  `enlace_o_lugar` varchar(255) DEFAULT NULL,
  `estado_disponibilidad` enum('disponible','cerrado_por_asesor','lleno') NOT NULL DEFAULT 'disponible',
  `max_estudiantes_simultaneos` int(11) DEFAULT 1,
  `notas_adicionales` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `asesor_usuario_id` (`asesor_usuario_id`),
  KEY `materia_id` (`materia_id`),
  CONSTRAINT `horarios_disponibles_asesor_ibfk_1` FOREIGN KEY (`asesor_usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `horarios_disponibles_asesor_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_disponibles_asesor`
--

LOCK TABLES `horarios_disponibles_asesor` WRITE;
/*!40000 ALTER TABLE `horarios_disponibles_asesor` DISABLE KEYS */;
INSERT INTO `horarios_disponibles_asesor` VALUES (1,2,'Calculo Vectorial','Recursadores jeje',NULL,'2025-05-28 09:00:00','2025-05-31 10:00:00','presencial','Edificio L salon 5','disponible',7,NULL,'2025-05-29 01:18:48','2025-05-29 01:18:48');
/*!40000 ALTER TABLE `horarios_disponibles_asesor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materias`
--

DROP TABLE IF EXISTS `materias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `area_conocimiento_padre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materias`
--

LOCK TABLES `materias` WRITE;
/*!40000 ALTER TABLE `materias` DISABLE KEYS */;
/*!40000 ALTER TABLE `materias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id_autor` int(11) DEFAULT NULL,
  `materia_id_relacionada` int(11) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `enlace_url` varchar(255) DEFAULT NULL,
  `tipo_recurso` enum('video','documento_pdf','articulo_web','imagen','otro') NOT NULL,
  `archivo_adjunto_url` varchar(255) DEFAULT NULL,
  `fecha_publicacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `es_publico` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `usuario_id_autor` (`usuario_id_autor`),
  KEY `materia_id_relacionada` (`materia_id_relacionada`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`usuario_id_autor`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `recursos_ibfk_2` FOREIGN KEY (`materia_id_relacionada`) REFERENCES `materias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,2,NULL,'Libro de Calculo','Ejercicios de calculo ','https://www.ugr.es/~fjperez/textos/calculo_diferencial_integral_func_una_var.pdf','documento_pdf',NULL,'2025-05-29 01:22:25',1);
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas_estudiantes`
--

DROP TABLE IF EXISTS `reservas_estudiantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservas_estudiantes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `horario_disponibilidad_id` int(11) NOT NULL,
  `estudiante_usuario_id` int(11) NOT NULL,
  `fecha_hora_reserva_especifica` datetime DEFAULT NULL,
  `notas_del_estudiante` text DEFAULT NULL,
  `estado_reserva` enum('confirmada','cancelada_estudiante','cancelada_asesor','completada','no_asistio') NOT NULL DEFAULT 'confirmada',
  `fecha_creacion_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion_registro` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `calificacion_a_asesor` tinyint(3) unsigned DEFAULT NULL,
  `comentario_a_asesor` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `horario_disponibilidad_id` (`horario_disponibilidad_id`),
  KEY `estudiante_usuario_id` (`estudiante_usuario_id`),
  CONSTRAINT `reservas_estudiantes_ibfk_1` FOREIGN KEY (`horario_disponibilidad_id`) REFERENCES `horarios_disponibles_asesor` (`id`),
  CONSTRAINT `reservas_estudiantes_ibfk_2` FOREIGN KEY (`estudiante_usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas_estudiantes`
--

LOCK TABLES `reservas_estudiantes` WRITE;
/*!40000 ALTER TABLE `reservas_estudiantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas_estudiantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_habilidades`
--

DROP TABLE IF EXISTS `usuario_habilidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_habilidades` (
  `usuario_id` int(11) NOT NULL,
  `habilidad_id` int(11) NOT NULL,
  PRIMARY KEY (`usuario_id`,`habilidad_id`),
  KEY `habilidad_id` (`habilidad_id`),
  CONSTRAINT `usuario_habilidades_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `usuario_habilidades_ibfk_2` FOREIGN KEY (`habilidad_id`) REFERENCES `habilidades_catalogo` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_habilidades`
--

LOCK TABLES `usuario_habilidades` WRITE;
/*!40000 ALTER TABLE `usuario_habilidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_habilidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `rol` enum('estudiante','asesor','admin') NOT NULL DEFAULT 'estudiante',
  `carrera` varchar(100) DEFAULT NULL,
  `semestre` int(11) DEFAULT NULL,
  `foto_perfil_url` varchar(255) DEFAULT NULL,
  `telefono` varchar(25) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultima_conexion` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Osiel Modesto Modesto','mods35go@gmail.com','$2b$10$48SrZp8J.n0B3OI4l9n8K.wg7TT66gFsj85aISNDT2xF8bq/fSWVi','estudiante','Ing Sistemas',7,NULL,'9981303640','2025-05-29 01:15:26',NULL,1),(2,'Skymods','osielm754@gmail.com','$2b$10$cV.2NNj/.OJfYq2KZI7Wou3GHwk5jpqQCkfgoZtpAHr5Ir3PKJihK','asesor','Ing Sistemas',8,NULL,'9928448903','2025-05-29 01:17:11',NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 22:17:46
