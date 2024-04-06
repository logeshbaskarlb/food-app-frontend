import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {getAllUsers} from "../api"
import {  setAllUserDetails } from '../context/actions/allUserAction'
import DataTables from './DataTables'
import { Avatar } from '../assests'

const DBUser = () => {
  const allUsers = useSelector((state)=> state.allUsers)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!allUsers){
      getAllUsers().then((data)=> {
        dispatch(setAllUserDetails(data))
      })
    }
  },[])
  return (
    <div className="flex items-center justify-center gap-4 pt-6 w-full ">
      <DataTables
        columns={[
          {
            title: "Image",
            field: "imageURL",
            render: (rowData) => (
              <img
                src={rowData.photoURL ? rowData.photoURL : Avatar}
                alt=""
                className=" w-32 h-16 object-contain rounded-md"
              />
            ),
          },
          {
            title: "Name",
            field: "displayName",
          },
          {
            title: "Email",
            field: "email",
          },
          {
            title: "Verified",
            field: "emailVerified",
            render: (rowData) => (
              <p className={`px-2 py-1 w-32 text-center text-primary rounded-md 
              ${rowData.emailVerified ? "bg-emerald-500" : " bg-red-500"}`}>
                {rowData.emailVerified ? " Verified" : " Not Verified"}
              </p>
            )
          },
        
        ]}

        data={allUsers}

        title={"List of Users"}
        // actions={[
        //   {
        //     icon: 'edit',
        //     tooltip: 'Edit data',
        //     onClick: (event, rowData) => {
        //       alert(`You want to edit product: ${rowData.productId}`);
        //     }
        //   },
        //   {
        //     icon: 'delete',
        //     tooltip: 'Delete data',
        //     onClick: (event, rowData) => {
        //       if (window.confirm('Are you sure you want to delete this product?')) {
        //         deleteAProduct(rowData.productId)
        //           .then((res) => {
        //             dispatch(alertSuccess('Product deleted.'));
        //             setTimeout(() => {
        //               dispatch(alertNull());
        //             }, 3000);
        //             getAllProduct().then((data) => {
        //               dispatch(setAllProducts(data));
        //             });
        //           })
        //           .catch((error) => {
        //             dispatch(alertDanger(`Failed to delete product: ${error.message}`));
        //           });
        //       }
        //     }
        //   }
        // ]}
        
      />
    </div>
  )
}

export default DBUser
