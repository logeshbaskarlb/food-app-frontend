import React, { useEffect, useState } from "react";
import { LoginBg, Logo } from "../assests";
import { LoginInput } from "../components";
import { FaEnvelope, FaLock, FcGoogle } from "../assests/icons";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { validateUserJWTToken } from "../api";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../context/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { alertInfo, alertWarnig } from "../context/actions/alertAction";


const Login = () => {
  const [userEmail, setuserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setpassword] = useState("");
  const [confirm_password, setconfirm_password] = useState("");

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const user = useSelector((state)=>state.user);
  const alert = useSelector((state)=>state.alert);

  useEffect(()=>{
    if(user){
      navigate("/",{replace : true});
    }
  },[])

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCard) => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if (cred) {
          cred.getIdToken().then((token) => {
            validateUserJWTToken(token).then((data) => {
              dispatch(setUserDetails(data));
            });
            navigate("/", { replace: true });
          });
        }
      });
    });
  };

  const signUpWithEmailPass = async () => {
    if (userEmail === "" || password === "" || confirm_password === "") {
      // alert
      dispatch(alertInfo("Required fiels should not be empty"));
    } else {
      if (password === confirm_password) {
        setuserEmail("");
        setpassword("");
        setconfirm_password("");
        await createUserWithEmailAndPassword(
          firebaseAuth,
          userEmail,
          password
        ).then((userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        });
      } else {
        // alert message
        dispatch(alertWarnig("Password is incorrect"));

      }
    }
  };

  const signInWithEmailAndPass = async () => {
    if (userEmail !== "" && password !== "") {
      await signInWithEmailAndPassword(firebaseAuth, userEmail, password).then(
        (userCred) => {
          firebaseAuth.onAuthStateChanged((cred) => {
            if (cred) {
              cred.getIdToken().then((token) => {
                validateUserJWTToken(token).then((data) => {
                  dispatch(setUserDetails(data));
                });
                navigate("/", { replace: true });
              });
            }
          });
        }
      );
    } else {
      //alert message
      dispatch(alertWarnig("Password is incorrect"));

    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex ">
      <img
        src={LoginBg}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />

      {/*content box*/}
      <div className="flex flex-col items-center backdrop-brightness-10 w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-6">
        {/* Logo*/}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={Logo} className="w-8" alt="" />
          <p className="text-headingColor font-semibold text-2xl">city</p>
        </div>

        {/* Welcome Text */}
        <p className="text-3xl font-semibold text-headingColor">Welcome Back</p>
        <p className="text-xl text-textColor -mt-6">Sign in with following</p>

        {/* input section */}
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
          <LoginInput
            className="text-xl text-textColor"
            placeholder={"Email Here"}
            icon={<FaEnvelope />}
            inputState={userEmail}
            inputStateFunc={setuserEmail}
            type="email"
            isSignUp={isSignUp}
          />

          <LoginInput
            className="text-xl text-textColor"
            placeholder={"Password Here"}
            icon={<FaLock />}
            inputState={password}
            inputStateFunc={setpassword}
            type="password"
            isSignUp={isSignUp}
          />
          {isSignUp && (
            <LoginInput
              className="text-xl text-textColor"
              placeholder={"Confirm Password Here"}
              icon={<FaLock />}
              inputState={confirm_password}
              inputStateFunc={setconfirm_password}
              type="password"
              isSignUp={isSignUp}
            />
          )}

          {!isSignUp ? (
            <p>
              Doesm't have an account:
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer"
                onClick={() => setIsSignUp(true)}
              >
                Create one
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account:
              <motion.button
                {...buttonClick}
                className="text-red-400 underline cursor-pointer"
                onClick={() => setIsSignUp(false)}
              >
                {" "}
                Sign-in here
              </motion.button>
            </p>
          )}

          {/* button */}
          {isSignUp ? (
            <motion.button
              {...buttonClick}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
              onClick={signUpWithEmailPass}
            >
              Sign Up
            </motion.button>
          ) : (
            <motion.button
              {...buttonClick}
              onClick={signInWithEmailAndPass}
              className="w-full px-4 py-2 rounded-md bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150"
            >
              Sign In
            </motion.button>
          )}
        </div>

        <div className="flex items-center justify-between gap-16">
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
        </div>

        <motion.div
          {...buttonClick}
          className="flex items-center justify-center px-20 py-2 bg-lighttextGray backdrop-blur-md cursor-pointer rounded-3xl gap-4"
          onClick={() => loginWithGoogle()}
        >
          <FcGoogle className="text-3xl" />
          <p className="capitalize text-base text-headingColor">
            Signin with Google
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
