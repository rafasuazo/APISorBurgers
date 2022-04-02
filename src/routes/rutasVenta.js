const {Router} = require('express');
const router = Router();
const { body } = require('express-validator');
const validaciones = require('../middleware/authVenta');

// importando el controlador
const controladorVenta = require('../controllers/controllerVenta');

router.get('/', controladorVenta.ListarVentas);
router.post('/guardar', validaciones.Validacion, controladorVenta.GuardarVentas);
router.delete('/eliminar', controladorVenta.EliminarVenta);

module.exports = router;