import React from "react";
import ConvertorTest from "./ConvertorTest";
import Convertor from "./Convertor";

const routes = [
  {
    path: "/",
    component: <Convertor />,
    exact: true,
  },
  {
    path: "/test",
    component: <ConvertorTest />,
    exact: true,
  },
  {
    path: "*",
    component: () => {
      return <h1 className="text-center">404</h1>;
    },
    exact: true,
  },
];

export default routes;
