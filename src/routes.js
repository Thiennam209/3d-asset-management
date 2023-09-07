// CHANGE route name
import React, { lazy } from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";
import {

  BsCollection,

  BsPeopleFill,

  BsPlus

} from "react-icons/bs"

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import ListBusiness from "views/admin/listBusiness";
import ListProduct from "views/admin/listProduct";
import DetailProduct from "views/admin/detailProduct"

const routes = [
  // {
  //   name: "Main Dashboard",
  //   layout: "/admin",
  //   path: "/default",
  //   icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
  //   component: MainDashboard,
  // },
  // {
  //   name: "Assets",
  //   layout: "/admin",
  //   path: "/assets",
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width='20px'
  //       height='20px'
  //       color='inherit'
  //     />
  //   ),
  //   component: NFTMarketplace,
  //   secondary: true,
  // },
  {
    name: "Business List",
    layout: "/admin",
    path: "/list-business",
    icon: (
      <Icon
        as={BsPeopleFill}
        width='24px'
        height='24px'
        color='inherit'
      />
    ),
    component: lazy(() => import("views/admin/listBusiness")),
    secondary: true,
  },
  {
    name: "Product List",
    layout: "/admin",
    path: "/list-product",
    icon: (
      <Icon
        as={BsCollection}
        width='24px'
        height='24px'
        color='inherit'
      />
    ),
    component: lazy(() => import("views/admin/listProduct")),
    secondary: true,
  },
  {
    name: "Detail List",
    layout: "/admin/list-products",
    path: "/detail-product",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='24px'
        height='24px'
        color='inherit'
      />
    ),
    component: lazy(() => import("views/admin/detailProduct")),
    secondary: true,
  },
  // {
  //   name: "Product profile",
  //   layout: "/admin/list-products",
  //   path: "/product-profile",
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width='24px'
  //       height='24px'
  //       color='inherit'
  //     />
  //   ),
  //   component: lazy(() => import("views/admin/createProduct")),
  //   secondary: true,
  // },

  // {
  //   name: "Data Tables",
  //   layout: "/admin",
  //   icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
  //   path: "/data-tables",
  //   component: DataTables,
  // },
  // {
  //   name: "Profile",
  //   layout: "/admin",
  //   path: "/profile",
  //   icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
  //   component: Profile,
  // },
  // {
  //   name: "Sign In",
  //   layout: "/auth",
  //   path: "/sign-in",
  //   icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
  //   component: SignInCentered,
  // },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "/rtl-default",
  //   icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
  //   component: RTL,
  // },
];

export default routes;
