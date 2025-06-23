import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed top-0 right-0 z-10 navbar shadow-sm px-4 h-[64px] w-[calc(100%-200px)] bg-white">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Left - Search Bar */}
        <div className="relative  flex-1 flex justify-left">
          <div className="flex w-full max-w-md">
            <div className=" w-full  bg-gray-50">
              <input
                type="text"
                placeholder="Search product, supplier, order"
                className="input input-bordered w-full rounded-r-none pl-10"
              />
            </div>
          </div>
        </div>

        {/* End - Notification & Profile */}
        <div className="flex gap-4 items-center">
          {/* Notification Icon */}
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* Profile Avatar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
