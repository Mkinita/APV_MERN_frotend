import {createContext, useState, useEffect} from 'react'
import clienteAxios from '../config/axios'


const PacientesContext = createContext()


export const PacientesProvider = ({children}) =>{

    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})
    const [listanombre , setListaNombre] = useState([])
    const [texto ,setTexto] =('')
    

    useEffect(() => {
        const obtenerPacientes = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return

                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const {data} = await clienteAxios('/paciente',config)
                setPacientes(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerPacientes()
    }, [])

    const guardarPaciente = async (paciente) =>{

        const token = localStorage.getItem('token')
        const config={
             headers:{
             "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        } 

        if(paciente.id){
           try {
                const{data} = await clienteAxios.put(`/paciente/${paciente.id}`,paciente,config)
                
                const pacientesActualizados = pacientes.map(pacienteState => pacienteState._id ===
                   data._id ? data : pacienteState) 
                   setPacientes(pacientesActualizados)
           } catch (error) {
                console.log(error)
           }
        } else{
            try {
                
                const {data} = await clienteAxios.post('/paciente',paciente,config)
                const{ createdAt, updatedAt, __v, ...pacienteAlmacenado } = data
                setPacientes([pacienteAlmacenado, ...pacientes])
            } catch (error) {
                console.log(error.response.data.msg)
            }
        }

    }


    const setEdicion = (paciente) => {
        setPaciente(paciente)
    }

    const eliminarPaciente = async id  =>{
        const confirmar = confirm('¿Confirmar que deseas eliminar el registro?')
        if(confirmar){
            try {
                const token = localStorage.getItem('token')
                const config={
                     headers:{
                     "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    }
                } 

                const {data} = await clienteAxios.delete(`/paciente/${id}`,config)
                const pacientesActualizados =pacientes.filter(pacientesState => pacientesState._id
                    !== id)

                    setPacientes(pacientesActualizados)
            } catch (error) {
                console.log(error)
            }
        }
    }


    const buscaNombrePaciente = async () =>{

        const token = localStorage.getItem('token')
        const config={
             headers:{
             "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        } 
        const res = await clienteAxios.get(`/paciente/${texto}`,config)
        setListaNombre(res.data)

    }



    return(
        <PacientesContext.Provider 
            value={{
                pacientes,
                guardarPaciente,
                setEdicion,
                paciente,
                eliminarPaciente,
                buscaNombrePaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}


export default PacientesContext