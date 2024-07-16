const validacionesFecha = () => {

    const permisoVariasSemanas = async (i, permiso, cantidadSemanas, tipoPermiso) => {
        let nuevotipoPermiso
        if (i === 0) {
            // Primera semana
            permiso.fechaInicio = cantidadSemanas[i].startOfWeek;
            permiso.fechaFin = cantidadSemanas[i].endOfWeek;

            nuevotipoPermiso = tipoPermiso


        } else if (i === cantidadSemanas.length - 1) {
            // Última semana
            
            if (permiso.viejaFin == cantidadSemanas[i].startOfWeek) {                
                permiso.fechaPermiso = cantidadSemanas[i].startOfWeek;
                nuevotipoPermiso = 'uno';
                
            } else {
                permiso.fechaInicio = cantidadSemanas[i].startOfWeek;
                permiso.fechaFin = permiso.viejaFin
                nuevotipoPermiso = tipoPermiso
            }

        } else {
            // Semanas intermedias
            permiso.fechaInicio = cantidadSemanas[i].startOfWeek;
            permiso.fechaFin = cantidadSemanas[i].endOfWeek;
            nuevotipoPermiso = tipoPermiso
        }

        let nuevoPermiso = permiso        

        // Generar PDF para cada intervalo de semana
        return {
            nuevoPermiso,
            nuevotipoPermiso
        } 

        

    
    }


    return {
        permisoVariasSemanas

    }

}

export default validacionesFecha