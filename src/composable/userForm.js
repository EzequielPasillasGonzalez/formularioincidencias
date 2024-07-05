import awsApi from '@/api/awsApi.js'

const userForm = () => {


    const generarPDF = async (nombre, plaza, codigo, idMotivo, FraClausula, permiso, tipoPermiso) => {

        try {
            if (!permiso) {
                return 'no hay permiso'
            }

            idMotivo = parseInt(idMotivo)            

            let fechaPermiso = ''


            if (tipoPermiso === 'varios' && permiso.fechaInicio && permiso.fechaFin) {

                fechaPermiso = `${permiso.fechaInicio} a ${permiso.fechaFin}`

            } else if (tipoPermiso === 'uno' && permiso.fechaPermiso) {
                fechaPermiso = `${permiso.fechaPermiso} por todo el día`
            } else if (tipoPermiso === 'horas' && permiso.fechaPermiso && permiso.horarioInicio && permiso.horarioFin) {
                fechaPermiso = `${permiso.fechaPermiso} de ${permiso.horarioInicio} a ${permiso.horarioFin}`
            } else {
                return new Error('No hay un tipo de permiso seleccionado');
            }

            const data = await awsApi.post('/generatePDF', { nombre, plaza, codigo, idMotivo, FraClausula, fechaPermiso })                        

            return data
        } catch (error) {
            return new Error(error)
        }



    }

    return {
        generarPDF
    }

}

export default userForm