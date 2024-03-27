import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Avatar, Logo } from "../assests";
import { isActiveStyles, isNotActiveStyles } from "../utils/styles";
import { motion } from "framer-motion";
import { buttonClick, slideTop } from "../animations";
import { MdLogout, MdShoppingCart } from "../assests/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import { app } from "../config/firebase.config";
import {getUserNull} from "../context/actions/userAction"

const Header = () => {
  const user = useSelector((state) => state.user);
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const firebaseAuth = getAuth(app)
  const signOut = () =>{
    firebaseAuth.signOut()
    .then(()=>{
      dispatch(getUserNull())
      navigate("/login",{replace:true})
    }).catch((err)=> console.log(err))
  }

  return (
    <header className="fixed backdrop-blur-md z-50 inset-x-0 top-0 flex items-center justify-between px-12 md:px-20 py-6">
      <NavLink to={"/"} className="flex items-center justify-center gap-4">
        <img src={Logo} alt="" className="w-12" />
        <p className="font-semibold text-xl">City</p>
      </NavLink>
      <nav className="flex items-center justify-center gap-8">
        <ul className="hidden md:flex items-center justify-center gap-16">
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/menu"}
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/services"}
          >
            Services
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
            to={"/abouts"}
          >
            About Us
          </NavLink>
        </ul>

        <motion.div {...buttonClick} className="relative cursor-pointer">
          <MdShoppingCart className="text-3xl text-textColor" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center absolute -top-4 -right-5">
            <p className="text-primary text-base font-semibold">2</p>
          </div>
        </motion.div>

        {user ? (
          <>
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setIsMenu(true)}
            >
              <div className="w-12 h-12 rounded-full shadow-md cursor-pointer overflow-hidden bg-green-200 flex items-center justify-center">
                <motion.img
                  className="w-full h-full object-cover"
                  src={user?.picture ? user?.picture : Avatar}
                  whileHover={{ scale: 1.15 }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {isMenu && (
                <motion.div
                  {...slideTop}
                  onMouseLeave={() => setIsMenu(false)}
                  className="px-6 py-4 w-48 backdrop-blur-md rounded-md shadow-md absolute top-12 right-0 flex flex-col gap-4"
                >
                  <Link
                    className="hover:text-red-500 text-xl text-textColor"
                    to={"/dashboard/home"}
                  >
                    Dashboard
                  </Link>
                  <Link
                    className="hover:text-red-500 text-xl text-textColor"
                    to={"/profile"}
                  >
                    My Profile
                  </Link>
                  <Link
                    className="hover:text-red-500 text-xl text-textColor"
                    to={"/user-orders"}
                  >
                    Orders
                  </Link>
                  <hr />
                  <motion.div
                  onClick={signOut}
                    {...buttonClick}
                    className="group flex items-center justify-center px-3 py-2 rounded-md shadow-md bg-gray-100 hover:bg-gray-200 gap-3"
                  >
                    <MdLogout className="text-2xl text-textColor group-hover::text-headingColor" />
                    <p className="text-textColor text-xl group-hover:text-headingColor">
                      Sign Out
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            <NavLink to={"/login"}>
              <motion.button
                {...buttonClick}
                className="px-4 py-2 rounded-md shadow-md bg-gray-100 border border-red-300 cursor-pointer"
              >
                Login
              </motion.button>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
