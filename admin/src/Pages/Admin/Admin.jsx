import React from 'react'
import './Admin.css'
import Sidebar from '../../Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Addproduct from '../../Components/AddProducts/Addproduct'
import ListProduct from '../../Components/ListProduct/ListProduct'
const Admin = () => {
    return (
        <div className="admin">
            <Sidebar></Sidebar>
            <Routes>
                <Route path='/addproduct' element={<Addproduct></Addproduct>}></Route>
                <Route path='/listproduct' element={<ListProduct></ListProduct>}></Route>
            </Routes>
        </div>
    )
}

export default Admin