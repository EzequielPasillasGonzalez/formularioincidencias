import awsApi from '@/api/awsApi.js'


const userForm = () => {
    const formatDate = (fecha) => {        
        const [yyyy, mm, dd] = fecha.split('-');
        return `${dd}/${mm}/${yyyy}`;        
    }  

    const generarPDF = async (nombre, plaza, codigo, idMotivo, FraClausula, permiso, tipoPermiso, correo, adsqcripcion, diasSolicitados, datosCompletosMateria, firmantes) => {

        try {
            if (!permiso) {
                return 'no hay permiso'
            }

            idMotivo = parseInt(idMotivo)

            let fechaPermiso = ''


            if (tipoPermiso === 'varios' && permiso.fechaInicio && permiso.fechaFin) {

                permiso.fechaInicio = formatDate(permiso.fechaInicio)
                permiso.fechaFin = formatDate(permiso.fechaFin)

                console.log(permiso.fechaInicio);
                console.log(permiso.fechaFin);
                

                fechaPermiso = `${permiso.fechaInicio} a ${permiso.fechaFin}`

            } else if (tipoPermiso === 'uno' && permiso.fechaPermiso) {
                permiso.fechaPermiso = formatDate(permiso.fechaPermiso)
                console.log(permiso.fechaPermiso);
                fechaPermiso = `${permiso.fechaPermiso} por todo el día`
            } else if (tipoPermiso === 'horas' && permiso.fechaPermiso && permiso.horarioInicio && permiso.horarioFin) {
                permiso.fechaPermiso = formatDate(permiso.fechaPermiso)
                console.log(permiso.fechaPermiso);
                fechaPermiso = `${permiso.fechaPermiso} de ${permiso.horarioInicio} a ${permiso.horarioFin}`
            } else {
                return new Error('No hay un tipo de permiso seleccionado');
            }



            const data = await awsApi.post('/file/generatePdf', { nombre, plaza, codigo, idMotivo, FraClausula, fechaPermiso, adsqcripcion, diasSolicitados, datosCompletosMateria, firmantes })
            // const data = await axios.post('http://localhost:3000/api/generatefile/pdf', { nombre, plaza, codigo, idMotivo, FraClausula, fechaPermiso, adsqcripcion, diasSolicitados, datosCompletosMateria, firmantes })

            if(data.data.ok == false ){
                throw new Error(`En este momento no se pueden hacer solicitudes, intentanlo mas tarde ${data.data.body}`)
            }

            const dataGetUrl = await awsApi.post(`/file/getUrlFile?filename=${data.data.body.nombreTemp}`)

            if(dataGetUrl.data.ok == false ){
                throw new Error(`En este momento no se pueden hacer solicitudes, intentanlo mas tarde ${dataGetUrl.data.body}`)
            }


            const dataCorreo = await awsApi.post('/email/sendEmail', {
                "toAddress": "ezequiel.pasillas@alumnos.udg.mx",
                "subject": "Solicitud de incidencia",
                "url": `${dataGetUrl.data.body}`
            })

            if(dataCorreo.data.ok == false ){
                throw new Error(`En este momento no se pueden hacer solicitudes, intentanlo mas tarde ${dataCorreo.data.body}`)
            }


            return data
        } catch (error) {
            return new Error(error.message)
        }



    }

    const obtenerDataASignacion = async (codigo) => {

        try {
            const dataASignacion = await awsApi.post('/athena/asignacionProfMateria', { codigo })

            return dataASignacion.data
        } catch (error) {
            return new Error(error.message)
        }
    }

    const obtenerDatosProfesores = async (codigo) => {

        try {
            const dataProfesor = await awsApi.post('/athena/maestro', { codigo })


            return dataProfesor.data
        } catch (error) {
            return new Error(error.message)
        }
    }

    const obtenerAsignaturasHorario = async (codigo) => {

        try {
            const dataAsignaturas = await awsApi.post('/athena/asignaturasHorario', { codigo })


            return dataAsignaturas.data
        } catch (error) {
            return new Error(error.message)
        }
    }

    const processAsignaturas = async (dataAsignacion) => {
        const results = [];

        for (const item of dataAsignacion.body) {
            const result = await obtenerAsignaturasHorario(item.clave_asignatura);
            results.push(result.body);
        }

        return results;
    };

    const obtenerNombreAsignaturas = async (codigo) => {

        try {
            const dataAsignaturas = await awsApi.post('/athena/asignaturas', { codigo })


            return dataAsignaturas.data
        } catch (error) {
            return new Error(error.message)
        }

    }

    const processCrnAsignaturas = async (dataAsignacion) => {
        const results = [];

        for (const materias of dataAsignacion) { //? Anidar otro for para extraer resultados                        
            for (const item of materias) {

                const result = await obtenerNombreAsignaturas(item.crn_asignatura);
                results.push(result.body);
            }
        }
        

        return results;
    };

    const obtenerFirmantes = async () => {
        const { data } = await awsApi.post('/athena/firmantes')
        

        return data.body[1]

    }


    return {
        generarPDF,
        obtenerDatosProfesores,
        obtenerDataASignacion,
        processAsignaturas,
        processCrnAsignaturas,
        obtenerFirmantes
    }

}

export default userForm