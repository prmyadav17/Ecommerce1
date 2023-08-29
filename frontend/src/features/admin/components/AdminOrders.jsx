import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { discountedPrice, ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/Pagination";
import {
  fetchAllOrdersAsync,
  selectOrders,
  selectTotalOrder,
  updateOrderAsync,
} from "../../order/orderSlice";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrder);
  const [editableOrderId, seteditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});

  const handlePage = (page) => {
    setPage(page);
    // const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    // dispatch(fetchAllOrdersAsync(pagination));
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchAllOrdersAsync({ sort, pagination }));
  }, [dispatch, page, sort]);

  const handleShow = () => {
    console.log("Handle Show");
  };

  const handleUpdate = (e, order) => {
    const updateOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updateOrder));
    seteditableOrderId(-1);
  };

  const handleEdit = (order) => {
    seteditableOrderId(order.id);
  };

  const handleSort = (sortOption) => {
    const sort = { _sort: sortOption.sort, _order: sortOption.order };
    setSort(sort);
  };

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return `bg-purple-200 text-purple-600`;
      case "dispatched":
        return `bg-yellow-200 text-yellow-600`;
      case "delivered":
        return `bg-green-200 text-green-600`;
      case "cancelled":
        return `bg-red-200 text-red-600`;
      default:
        return `bg-purple-200 text-purple-600`;
    }
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <div className=" bg-gray-100 flex items-center justify-center font-sans overflow-hidden">
          <div className="w-full ">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th
                      className="py-3 px-2 text-left cursor-pointer"
                      onClick={(e) =>
                        handleSort({
                          sort: "id",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Order#{" "}
                      {sort._sort === "id" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4 inline" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-2 pl-16 text-left">Items</th>
                    <th
                      className="py-3 px-2 text-left cursor-pointer"
                      onClick={(e) =>
                        handleSort({
                          sort: "totalAmount",
                          order: sort._order === "asc" ? "desc" : "asc",
                        })
                      }
                    >
                      Total Amount{" "}
                      {sort._sort === "totalAmount" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4 inline" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4 inline" />
                        ))}
                    </th>
                    <th className="py-3 px-2 text-center">Shipping Address</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {orders &&
                    orders.map((order, index) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-100"
                        key={order.id}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-medium">{order.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">
                          {order.items.map((item) => (
                            <div className="flex items-center">
                              <div className="mr-2">
                                <img
                                  className="w-6 h-6 rounded-full"
                                  src={item.product.thumbnail}
                                  alt={item.product.title}
                                />
                              </div>
                              <span>
                                {item.product.title} - {item.quantity} - $
                                {discountedPrice(item.product)}
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex items-center justify-center">
                            ${order.totalAmount}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="">
                            <div>
                              <strong>{order.selectedAddress.name} </strong>
                            </div>
                            <div> {order.selectedAddress.street}</div>
                            <div>{order.selectedAddress.city}</div>
                            <div>{order.selectedAddress.state}</div>
                            <div>{order.selectedAddress.pinCode}</div>
                            <div> {order.selectedAddress.phone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {order.id === editableOrderId ? (
                            <select onChange={(e) => handleUpdate(e, order)}>
                              <option value="pending">Pending</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span
                              className={`${chooseColor(
                                order.status
                              )} py-1 px-3 rounded-full text-xs`}
                            >
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <div
                              onClick={(e) => handleShow(order)}
                              className="w-6 cursor-pointer mr-2 transform hover:text-purple-500 hover:scale-110"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </div>
                            <div
                              onClick={(e) => handleEdit(order)}
                              className="w-6 cursor-pointer mr-2 transform hover:text-purple-500 hover:scale-110"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Pagination
          page={page}
          setPage={setPage}
          handlePage={handlePage}
          totalItems={totalOrders}
        />
      </div>
    </div>
  );
}
