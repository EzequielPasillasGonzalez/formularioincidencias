import awsApi from '@/api/awsApi.js'

const userForm = () => {


    const generarPDF = async (nombre, plaza, codigo, idMotivo, FraClausula, permiso, tipoPermiso )  => {

        if(!permiso){            
            return 'no hay permiso'
        }

        idMotivo = parseInt(idMotivo)          

        let fechaPermiso = ''


        if(tipoPermiso === 'diaCompleto' && permiso.masdiasPermiso !== ''){

            fechaPermiso = `${permiso.fechaPermiso} a ${permiso.masdiasPermiso}`

        } else if(tipoPermiso === 'diaCompleto' && permiso.masdiasPermiso === ''){
            fechaPermiso = `${permiso.fechaPermiso} por todo el día`
        }else{
            fechaPermiso = `${permiso.fechaPermiso} ${permiso.horarioInicio} a ${permiso.horarioFin}`
        }

         

        const { data } = await awsApi.post('/generatefile/pdf', {nombre, plaza, codigo, idMotivo, FraClausula, fechaPermiso })

        return data

    }

    return {
        generarPDF
    }

}

export default userForm