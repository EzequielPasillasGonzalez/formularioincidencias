const tratarDatosApi = () => {
    const extraerNombreMateria = (data, materiasSolicitadas) => {
        let result = []

        for (const subArray of data) {
            for (const item of subArray) {
                for (const materia of materiasSolicitadas) {
                    if (item.crn_asignatura === materia.crn_asignatura) {
                        materia.nombre_asignatura = item.nombre_asignatura
                        result.push(materia)
                    }
                }
            }
        }

        result = eliminarDuplicados(result)

        return result
    };

    const getHorarioMateria = (datosCompletosMateria, permiso) => {
        let result = []
        for (const materia of datosCompletosMateria) {
            const inicioMateria = materia.horaini_hhmm
            const finMateria = materia.horafin_hhmm
            const inicioUsuario = permiso.horarioInicio
            const finUsuario = permiso.horarioFin

            if ((inicioUsuario >= inicioMateria && inicioUsuario <= finMateria) ||
                (finUsuario >= inicioMateria && finUsuario <= finMateria) ||
                (inicioUsuario <= inicioMateria && finUsuario >= finMateria)) {
                result.push(materia)
            }
        }

        return result
    };

    const eliminarDuplicados = (array) => {
        const seen = new Set();
        return array.filter(item => {
            const key = `${item.clave_asignatura}-${item.horaini_hhmm}-${item.horafin_hhmm}`;
            if (seen.has(key)) {
                return false;
            } else {
                seen.add(key);
                return true;
            }
        });
    };


    return {
        getHorarioMateria,
        extraerNombreMateria
    }
}

export default tratarDatosApi