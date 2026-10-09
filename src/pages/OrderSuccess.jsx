
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ShoppingBag,
} from "lucide-react";

function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(
        "shopsphere-last-order"
      );

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error(
        "Failed to load order:",
        error
      );
    }
  }, []);

  return (
    <section className="order-success-page">
      <div className="container">

        <div className="order-success-card">

          <div className="success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="small-heading">
            Order Confirmed
          </span>

          <h1>
            Thank You For Your Order!
          </h1>

          <p>
            Your order has been placed successfully.
            We will process it and prepare it for delivery.
          </p>


          {order && (
            <div className="order-success-details">

              <div>
                <span>Order ID</span>
                <strong>#{order._id}</strong>
              </div>

              <div>
                <span>Total Amount</span>
                <strong>
                  ₹
                  {Number(order.total || 0).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                  <strong className="order-processing">
                  {order.status || "Processing"}
                </strong>
              </div>

            </div>
          )}


          <div className="success-next-steps">

            <div>
              <Package size={19} />

              <div>
                <strong>
                  Order Processing
                </strong>

                <span>
                  Your order is being prepared.
                </span>
              </div>
            </div>


            <div>
              <ShoppingBag size={19} />

              <div>
                <strong>
                  Keep Shopping
                </strong>

                <span>
                  Discover more products from ShopSphere.
                </span>
              </div>
            </div>

          </div>


          <Link
            to="/products"
            className="btn btn-primary success-shopping-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </section>
  );
}

export default OrderSuccess;
