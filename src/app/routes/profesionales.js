const express = require("express");
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"]; // Tipos de archivo permitidos
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Tipo de archivo no permitido"), false); // Rechazar el archivo
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const router = express.Router();

const profesionalController = require("../controllers/profesionalController");

router.post(
  "/registrar-solicitud",
  upload.single("titulo"),
  profesionalController.createProfessionalRequest
);

router.post("/buscar", profesionalController.buscarProfesional);

module.exports = router;
