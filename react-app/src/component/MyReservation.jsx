import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavBar from './navBar'

export default function MyReservation() {
  const [reservations , setReservation] = useState([])
  const location = useLocation()

  const get_reservations = async () => {
    try {
      const res = await axios.get('/myreservations')
      
      setReservation(res.data.reservations)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get_reservations()
  }, [])
    
return (
    <div>
      <NavBar />
      <table className='table mt-5'>
        <thead>
          <tr>
          <th><h6>Ville</h6></th>
          <th><h6>Place</h6></th>
          <th><h6>Invite</h6></th>
          <th><h6>Date</h6></th>
          </tr>
        </thead>
        <tbody>
          {
            reservations.map((res, i) => {return ( 
              <tr key={i} style={ i % 2 === 0 ? {backgroundColor : "rgb(117 117 117 / 4%)"} : {backgroundColor : "whitesmoke"}}>
                <td>{res.ville}</td>
                <td>{res.place}</td>
                <td>{res.invite}</td>
                <td>{`${res.date.slice(5,15)} ${res.date.slice(16,25)}`}</td>
              </tr>
            )})
          }
        </tbody>
      </table>
    </div>
  )
}
