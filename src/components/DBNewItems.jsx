import React, { useState } from "react";
import { statuses } from "../utils/styles";
import { Spinner } from "../components";
import { FaCloudUploadAlt, MdDelete } from "../assests/icons";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { useSelector, useDispatch } from "react-redux";
import {
  alertDanger,
  alertNull,
  alertSuccess,
} from "../context/actions/alertAction";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";
import { addNewProduct, getAllProduct } from "../api/index"
import { setAllProducts } from "../context/actions/productAction"

const DBNewItems = () => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadURL, setImageDownloadURL] = useState(null);

  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];

    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error : ${error}`));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageDownloadURL(downloadURL);
          setIsLoading(false);
          setProgress(null);
          dispatch(alertSuccess("Image uploaded to the cloud"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
        });
      }
    );
  };

  const deleteImageFromFirebase = () => {
    setIsLoading(true);
    if (imageDownloadURL) {
      const deleteRef = ref(storage, imageDownloadURL);
      deleteObject(deleteRef)
        .then(() => {
          setImageDownloadURL(null);
          setIsLoading(false);
          dispatch(alertSuccess("Image removed from the cloud"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
        })
        .catch((error) => {
          dispatch(alertDanger(`Error deleting image: ${error}`));
          setIsLoading(false);
        });
    } else {
      dispatch(alertDanger("No image to delete."));
      setIsLoading(false);
    }
  };
  
  const submitNewData = async () => {

    const data = {
          product_name: itemName,
          product_category: category,
          product_price: price,
          imageURL: imageDownloadURL,
        };

       await addNewProduct(data).then((res)=>{
          console.log(res)
          dispatch(alertSuccess("New Item added"));
          setTimeout(() => {
                dispatch(alertNull());
              }, 3000);
          
              // Reset form fields
              setImageDownloadURL(null);
              setItemName("");
              setPrice("");
              setCategory(null);
        })
        getAllProduct().then((data)=>{
          dispatch(setAllProducts(data))
        })
  };
  
  return (
    <div className="flex items-center justify-center flex-col pt-6 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full max-w-lg flex flex-col items-center gap-4">
        <InputValueField
          type="text"
          placeHolder={"Item name here"}
          stateFunc={setItemName}
          stateValue={itemName}
        />
        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                onClick={() => setCategory(data?.category)}
                key={data.id}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md
                ${
                  data.category === category
                    ? "bg-red-400 text-primary"
                    : "bg-transparent"
                }`}
              >
                {data.title}
              </p>
            ))}
        </div>
        <InputValueField
          type="number"
          placeHolder={"Item price"}
          stateFunc={setPrice}
          stateValue={price}
        />
        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex justify-center items-center">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {Math.round(progress > 0) && (
                <>
                  <div className="w-full flex flex-col items-center justify-center gap-2">
                    <span className="text-base font-medium text-textColor">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.round(progress)}%`,
                      }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadURL ? (
                <label>
                  <div className="flex flex-col justify-center items-center h-full w-full cursor-pointer">
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                      <p className="font-bold text-4xl">
                        <FaCloudUploadAlt className="-rotate-0" />
                      </p>
                      <p className="text-lg text-textColor">
                        Click to upload an image
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    accept="image/*"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <motion.img
                    whileHover={{ scale: 1.15 }}
                    src={imageDownloadURL}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    {...buttonClick}
                    type="button"
                    className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md duration-500 transition-all ease-in-out"
                    onClick={() => deleteImageFromFirebase(imageDownloadURL)}
                  >
                    <MdDelete className="-rotate-0" />
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>

        <motion.button
          onClick={submitNewData}
          {...buttonClick}
          className=" w-9/12 py-2 rounded-md bg-red-400 hover:bg-red-500"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export const InputValueField = ({
  type,
  placeHolder,
  stateValue,
  stateFunc,
}) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      className="w-full px-4 py-3 bg-gray-100 shadow-md outline-none rounded-md border border-gray-200 focus:border-red-400"
      value={stateValue}
      onChange={(e) => stateFunc(e.target.value)}
    />
  );
};
export default DBNewItems;
