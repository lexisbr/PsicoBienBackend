const Sequelize = require("sequelize");
const db = require("../../models");
const Profesionales = db.profesionales;
const Usuarios = db.usuarios;
const ProfesionalEspecialidades = db.profesional_especialidades;

module.exports = {
  find(req, res) {
    return Usuarios.findAll({ where: { estado: 1, idTipoUsuario: 2 } })
      .then((usuario) => res.status(200).send(usuario))
      .catch((error) => res.status(400).send(error));
  },
  async createProfessionalRequest(req, res) {
    try {
      const { dni, colegiado } = req.body;

      const fotoTitulo = req.file;

      const existingProfessional = await Profesionales.findAll({
        where: { colegiado: colegiado },
      });
      console.log(existingProfessional);
      if (existingProfessional.lenght > 0) {
        return res
          .status(500)
          .json({ message: "Numero de colegiado ya utilizado" });
      }

      const professional = new Profesionales({
        fotoTitulo: "http://localhost:3000/" + fotoTitulo.filename,
        colegiado,
        estado: 2,
      });

      await professional.save();

      return res
        .status(201)
        .json({ message: "Solicitud registrada exitosamente" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async buscarProfesional(req, res) {
    try {
      const { nombreCompleto, especialidades, idEstado } = req.body;
      console.log(especialidades);

      const profesionales = await db.sequelize.query(
        `CALL buscarProfesional("${nombreCompleto?.trim()}", ${idEstado}, "${especialidades}")`
      );
      profesionales.forEach((profesional) => {
        profesional.especialidades = profesional.especialidades.split(",");
      });
      return res.status(200).json(profesionales);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async obtenerEspecialidadesRegistradas(req, res) {
    try {
      const especialidades = await db.sequelize.query(
        `CALL obtenerEspecialidades()`
      );

      return res.status(200).json(especialidades);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async findData(req, res) {
    const { colegiado } = req.params;
    try {
      const data = await Profesionales.findAll({ where: { colegiado } });
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
  async datosProfesional(req, res) {
    try {
      const { colegiado } = req.params;

      const especialidades = await db.sequelize.query(
        `CALL verDatosProfesional("${colegiado}")`
      );
      return res.status(200).json(especialidades);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async actualizarPortada(req, res) {
    const file = req.file;
    const dni = req.body.dni;
    try {
      if (!file) {
        const error = new Error("No file");
        error.http.StatusCode = 400;
        return error;
      }
      const usuarios = await db.sequelize.query(
        "UPDATE usuarios SET urlFotoPortada = ? WHERE dni = ? ",
        {
          replacements: ["http://localhost:3000/" + file.filename, dni],
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );

      await res.status(200).json(file.path);
      console.log(file.path);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  async actualizarPerfil(req, res) {
    const file = req.file;
    const dni = req.body.dni;
    try {
      if (!file) {
        const error = new Error("No file");
        error.http.StatusCode = 400;
        return error;
      }
      const usuarios = await db.sequelize.query(
        "UPDATE usuarios SET urlFotoPerfil = ? WHERE dni = ? ",
        {
          replacements: ["http://localhost:3000/" + file.filename, dni],
          type: db.Sequelize.QueryTypes.UPDATE,
        }
      );

      await res.status(200).json(dni);
      console.log(dni);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
