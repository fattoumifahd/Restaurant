import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function MailVerification() {
    const [userInput , setUserInput] = useState(null)
    const [matched , setMatched] = useState(false) 
    const [error , setError] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const {code} = location.state
    const {user_id} = location.state
    console.log(code)
    console.log(user_id)
    console.log(userInput)
    useEffect(()=> {
        checkMatch()
    }, [userInput, matched])

    const checkMatch = () => {
        code == Number(userInput) ? setMatched(true): setMatched(false)
        if (matched === true) {
            alert('Email verified')
            axios.get(`/email_verification/${user_id}`)
            .then((res) => res.data.message && navigate('/login') ).catch((err) => {
                console.log(err)
            })
                

        } else {
            
        }
    }
    const handleChange = ({target}) => {
        setUserInput(target.value)
       
    }

  return (
    <div className='form-box'>
        {/* <form action="" className='form' method='POST'> */}
            <input type="number" className='input form-control' maxLength={"6"} placeholder='Code' onChange={(e) => handleChange(e)} />
            {error && <span className='text-danger'>Incorrect code</span>  }
        {/* </form> */}
    </div>
  )
}
