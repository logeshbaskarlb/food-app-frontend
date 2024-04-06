import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { CChart } from "@coreui/react-chartjs";

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const drinks = products?.filter((item) => item.product_category === "drinks");
  const desserts = products?.filter(
    (item) => item.product_category === "desserts"
  );
  const fruits = products?.filter((item) => item.product_category === "fruits");
  const rice = products?.filter((item) => item.product_category === "rice");
  const curry = products?.filter((item) => item.product_category === "curry");
  const chinese = products?.filter(
    (item) => item.product_category === "chinese"
  );
  const bread = products?.filter((item) => item.product_category === "bread");

  useEffect(() => {
    if (!products) {
      getAllProduct()
        .then((data) => {
          dispatch(setAllProducts(data));
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, []); // Add 'products' to dependency array

  return (
    <div className=" flex items-center justify-center flex-col pt-6 w-full h-full">
      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="flex items-center justify-center">
          <div className="w-340 md:w-508">
            <CChart
              type="bar"
              data={{
                labels: [
                  "Drinks",
                  "Deserts",
                  "Fruits",
                  "Rice",
                  "Curry",
                  "Bread",
                  "Chines",
                ],
                datasets: [
                  {
                    label: "Category wise Count",
                    backgroundColor: "#f87979",
                    data: [
                      drinks?.length,
                      desserts?.length,
                      fruits?.length,
                      rice?.length,
                      curry?.length,
                      chinese?.length,
                      bread?.length,
                    ],
                  },
                ],
              }}
              labels="months"
            />
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-275 md:w-460">
            <CChart
              type="doughnut"
              data={{
                labels: [
                  "Orders", "Delivered", "Cancelled", "Paid","Not Paid"],
                datasets: [
                  {
                    backgroundColor: [
                      "#51FF00",
                      "#00B6FF",
                      "#008BFF",
                      "#FFD100",
                      "#FF00FB",
                    ],
                    data: [40,20,80,34,54],
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHome;
