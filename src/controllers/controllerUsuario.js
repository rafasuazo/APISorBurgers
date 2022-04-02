const modeloUsuario = require('../models/modelUsuario');
const Cliente = require('../models/modelCliente');
const Empleado = require('../models/modelEmpleado');
const modeloCliente = require('../models/modelCliente');
const modeloEmpleado = require('../models/modelEmpleado');

// esto solo lo podrá hacer el empleado con puesto Gerente
// este lista solo los clientes
exports.ListaUsuariosClientes = async (req, res) => {

    // en teoría es como hacer:
    /* select * from de usuarios y un join con clientes
    donde attributes, son los datos que queremos mostrar de
    la tabla usuarios y clientes, y el include es el join con la otra tabla
    */

    const listaUsuarios = await modeloUsuario.findAll({
        attributes:[
            'correo', 'tipoUsuario'
        ],
        where: {
            'tipoUsuario': 'CL'
        },
        include: {
            model: Cliente
        }
    });

    if(!listaUsuarios.length > 0){
        res.status(200).json({msj: "No hay datos por mostrar"});
    }
    else{
        res.status(200).json(listaUsuarios);
    }
}

// obtener un dato en específico
exports.ObtenerUsuario = async (req, res) => {

    const { id } = req.query;
    
    const lista = await modeloUsuario.findOne({
        attributes: ['correo', 'contrasenia'],
        where:{
            id: id
        }
    })

    if(!lista){
        res.status(200).json({msj: "No existe el cliente"})
    }
    else{
        res.status(200).json({Usuario: lista})
    }
}

// este solo lista los empleados
exports.ListaUsuariosEmpleados = async (req, res) => {

    // donde el tipo de Usuario sea empleado
    const listaEmpleados = await modeloUsuario.findAll({
        where: {
            'tipoUsuario': 'EM'
        },
        include: {
            model: Empleado
        }
    });

    if(!listaEmpleados.length > 0){
        res.status(200).json({msj: "No hay datos por mostrar"});
    }
    else{
        res.status(200).json(listaEmpleados);
    }
}

// insertar usuario del cliente
exports.GuardarUsuarioCliente = async (req, res) => {

    /**SELECT * FROM sorburgers.clientes order by id desc limit 1; */
    const cliente = await Cliente.findOne({
        attributes: ['id'],
        order: [
            ['id', 'DESC']
        ],
        limit: 1
    })

    const id = cliente.dataValues.id;
    
    const { correo, contrasenia } = req.body;

    const buscaCorreo = await modeloUsuario.findOne({
        where:{
            correo: correo
        }
    })

    if(buscaCorreo){
        res.status(422).json({msj: "Correo existente!"});
    }
    else{

        await modeloUsuario.create({

            clienteId: id,
            correo: correo,
            contrasenia: contrasenia
        })
        .then((result) => {
            res.status(201).json({msj: "Registro almacenado exitosamente!"});
        })
        .catch((err) => {
            console.log(err);
            res.status(406).json({msj: "El registro no pudo ser guardado"});
        })
    }
}

// modificar cuenta de usuario
exports.ModificarCuentaCliente = async (req, res) => {

    const { id } = req.query;
    const { correo, contrasenia, confirmar } = req.body;

    let buscaCuenta = await modeloUsuario.findOne({
        where:{
            clienteId: id
        }
    })

    if(!buscaCuenta){
        res.status(404).json({msj: "El id proporcionado no existe"});
    }
    else{

        if(contrasenia !== confirmar){
            res.status(201).json({msj: "Las contraseñas no son iguales"});
        }
        else{
            
            buscaCuenta.correo = correo;
            buscaCuenta.contrasenia = contrasenia;
            await buscaCuenta.save()
            .then((result) => {
                res.status(201).json({msj: "La cuenta ha sido modificada exitosamente!"});
            })
            .catch((err) => {
                console.log(err);
                res.status(304).json({msj: "La cuenta no pudo ser modificada"});
            })
        }
    }
}

exports.EliminarCuentaCliente = async (req, res) => {

    const  { id } = req.query;

     await modeloUsuario.destroy({
        include:[{
            model: modeloCliente,
            where: {id: id}
        }],
        where: {
            clienteId: id
        }
    })

    await modeloCliente.destroy({
        where:{
            id: id
        }
    })
    .then((result) => {

        if(result == 0){
            res.status(400).json({msj: "El id proporcionado no existe"});
        }
        else{
            res.status(200).json({msj: "Cuenta eliminada satisfactoriamente"});
        }
    })
}

/**************************Empleados**************************/

exports.GuardarUsuarioEmpleado = async (req, res) => {

    const empleado = await modeloEmpleado.findOne({
        attributes: ['id'],
        order: [
            ['id', 'DESC']
        ],
        limit: 1
    })

    const id = empleado.dataValues.id;

    const { correo, contrasenia } = req.body;

    const buscaCorreo = await modeloUsuario.findOne({
        where:{
            correo: correo
        }
    })

    if(buscaCorreo){
        res.status(422).json({msj: "Correo existente!"});
    }
    else{

        await modeloUsuario.create({

            empleadoId: id,
            correo: correo,
            contrasenia: contrasenia,
            tipoUsuario: 'EM'
        })
        .then((result) => {
            res.status(201).json({msj: "Registro almacenado exitosamente!"});
        })
        .catch((err) => {
            console.log(err);
            res.status(406).json({msj: "El registro no pudo ser guardado"});
        })
    }
}

exports.ModificarCuentaEmpleado = async (req, res) => {

    const { id } = req.query;
    const { correo, contrasenia, confirmar } = req.body;

    let buscaCuenta = await modeloUsuario.findOne({
        where:{
            empleadoId: id
        }
    })

    if(!buscaCuenta){
        res.status(404).json({msj: "El id proporcionado no existe"});
    }
    else{

        if(contrasenia !== confirmar){
            res.status(201).json({msj: "Las contraseñas no son iguales"});
        }
        else{
            
            buscaCuenta.correo = correo;
            buscaCuenta.contrasenia = contrasenia;
            await buscaCuenta.save()
            .then((result) => {
                res.status(201).json({msj: "La cuenta ha sido modificada exitosamente!"});
            })
            .catch((err) => {
                console.log(err);
                res.status(304).json({msj: "La cuenta no pudo ser modificada"});
            })
        }
    }
}

exports.EliminarCuentaEmpleado = async (req, res) => {

    const { id } = req.query;

    await modeloUsuario.destroy({
        include:[{
            model: modeloEmpleado,
            where: {id: id}
        }],
        where:{
            empleadoId: id
        }
    })

    await modeloEmpleado.destroy({
        where:{
            id: id
        }
    })
    .then((result) => {

        if(result == 0){
            res.status(400).json({msj: "El id proporcionado no existe"});
        }
        else{
            res.status(200).json({msj: "Cuenta eliminada satisfactoriamente"});
        }
    })
}