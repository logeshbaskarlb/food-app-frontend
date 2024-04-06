import React from "react";
import { DataTables } from "../components";
import { HiCurrencyRupee } from "../assests/icons";
import { useSelector } from "react-redux";
import { deleteAProduct, getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { useDispatch } from "react-redux";
import { alertDanger, alertNull, alertSuccess } from "../context/actions/alertAction";

const DBItems = () => {
  const products = useSelector((state) => state.products)
  const dispatch = useDispatch()
  return (
    <div className="flex items-center justify-center gap-4 pt-6 w-full ">
      <DataTables
        columns={[
          {
            title: "Image",
            field: "imageURL",
            render: (rowData) => (
              <img
                src={rowData.imageURL}
                alt=""
                className=" w-32 h-16 object-contain rounded-md"
              />
            ),
          },
          {
            title: "Name",
            field: "product_name",
          },
          {
            title: "Category",
            field: "product_category",
          },
          {
            title: "Price",
            field: "product_price",
            render: (rowData) => (
              <p className="text-xl font-semibold text-textColor flex items-center justify-center">
                <HiCurrencyRupee className=" text-red-400" />
                {parseFloat(rowData.product_price).toFixed(2)}
              </p>
            ),
          },
        ]}

        data={products}

        title={"List of products"}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit data',
            onClick: (event, rowData) => {
              alert(`You want to edit product: ${rowData.productId}`);
            }
          },
          {
            icon: 'delete',
            tooltip: 'Delete data',
            onClick: (event, rowData) => {
              if (window.confirm('Are you sure you want to delete this product?')) {
                deleteAProduct(rowData.productId)
                  .then((res) => {
                    dispatch(alertSuccess('Product deleted.'));
                    setTimeout(() => {
                      dispatch(alertNull());
                    }, 3000);
                    getAllProduct().then((data) => {
                      dispatch(setAllProducts(data));
                    });
                  })
                  .catch((error) => {
                    dispatch(alertDanger(`Failed to delete product: ${error.message}`));
                  });
              }
            }
          }
        ]}
        
      />
    </div>
  );
};

export default DBItems;
