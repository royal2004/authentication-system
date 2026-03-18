import React, { useContext, useRef, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin, setAxiosToken } = useContext(AppContext)

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking/tapping outside on mobile
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('touchstart', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('touchstart', handleOutsideClick)
        }
    }, [])

    const sendVerificationOtp = async () => {
        try {
            setDropdownOpen(false)
            axios.defaults.withCredentials = true;

            const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if (data.success) {
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async () => {
        try {
            setDropdownOpen(false)
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            localStorage.removeItem('token');
            setAxiosToken(null);
            navigate('/')
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

            <img src={assets.logo} alt="" className='w-28 sm:w-32' />
            {userData ?
                <div ref={dropdownRef} className='relative'>
                    {/* Avatar button — clickable on both desktop and mobile */}
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white focus:outline-none'
                    >
                        {userData.name?.[0]?.toUpperCase() ?? '?'}
                    </button>

                    {/* Dropdown — shown via state, works on touch devices */}
                    {dropdownOpen && (
                        <div className='absolute right-0 top-10 z-10 text-black rounded shadow-lg'>
                            <ul className='list-none m-0 p-2 bg-gray-100 text-sm min-w-[120px]'>
                                {!userData.isAccountVerified &&
                                    <li
                                        onClick={sendVerificationOtp}
                                        className='py-2 px-4 hover:bg-gray-200 active:bg-gray-300 cursor-pointer rounded whitespace-nowrap'
                                    >
                                        Verify email
                                    </li>
                                }
                                <li
                                    onClick={logout}
                                    className='py-2 px-4 hover:bg-gray-200 active:bg-gray-300 cursor-pointer rounded whitespace-nowrap'
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                : <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>}
        </div>
    )
}

export default Navbar