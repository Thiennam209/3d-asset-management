// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import AdminNavbarLinks from "components/navbar/NavbarLinksAdmin";
import { useLocation, Link } from "react-router-dom";
import { http } from "../../axios/init";

export default function AdminNavbar(props) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [nameBusiness, setNameBusiness] = useState("");

  // useEffect(() => {
  // 	window.addEventListener('scroll', changeNavbar);
  // 	return () => {
  // 		window.removeEventListener('scroll', changeNavbar);
  // 	};
  // });

  const { secondary, message, brandText } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("navy.700", "white");
  let secondaryText = useColorModeValue("gray.700", "white");
  let navbarPosition = "fixed";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(20px)";
  let navbarShadow = "none";
  let navbarBg = useColorModeValue(
    "rgba(244, 247, 254, 0.2)",
    "rgba(11,20,55,0.5)"
  );
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingX = "15px";
  let gap = "0px";
  const _getIDBusiness = () => {
    const searchParams = new URLSearchParams(location.search);
    const getIDBusiness = searchParams.get("id");
    return getIDBusiness;
  };
  const businessName = async () => {
    const pathName = props?.location?.pathname || "";
    if (
      pathName === "/admin/list-product" ||
      pathName === "/admin/list-products/detail-product"
    ) {
      _getIDBusiness();
      const getJWTToken = localStorage.getItem("dtvt");
      if (_getIDBusiness()) {
        const result = await http.get(
          `businesses?filters[businessId][$eq]=${_getIDBusiness()}`,
          {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          }
        );
        return result?.data?.data[0]?.attributes?.Name || "";
      }
    } else {
      return "";
    }
  };
  const detailProducts = () => {
    const pathName = props?.location?.pathname || "";
    switch (pathName) {
      case "/admin/list-products/detail-product":
        return "Product detail";
        break;
      default:
        return "";
    }
  };
  useEffect(() => {
    businessName().then((res) => {
      if (res !== "") {
        setNameBusiness(res);
      } else {
        setNameBusiness("");
      }
    });
  });

  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      // bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      // backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: "12px", md: "30px", lg: "30px", xl: "30px" }}
      px={{
        sm: paddingX,
        md: "10px",
      }}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top={{ base: "12px", md: "16px", lg: "20px", xl: "20px" }}
      // w={{
      //   base: "calc(100vw - 6%)",
      //   md: "calc(100vw - 8%)",
      //   lg: "calc(100vw - 6%)",
      //   xl: "calc(100vw - 276px)",
      //   "2xl": "calc(100vw - 276px)",
      // }}
      w="calc(100vw - 11vw - 60px)"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
        mb={gap}
      >
        <Box
          mb={{ sm: "8px", md: "0px" }}
          backdropFilter={navbarBackdrop}
          bg={navbarBg}
          w="100%"
          borderRadius="10px"
          padding="5px 20px"
        >
          {nameBusiness === "" ? (
            <Breadcrumb>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <Link to="/admin/list-business">Pages</Link>
              </BreadcrumbItem>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <Link to={`${props.location.pathname}`}>{brandText}</Link>
              </BreadcrumbItem>
            </Breadcrumb>
          ) : (
            <Breadcrumb>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <Link to="/admin/list-business">Pages</Link>
              </BreadcrumbItem>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <Link to={`/admin/list-product?id=${_getIDBusiness()}`}>
                  {nameBusiness}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <Link to={`/admin/list-product?id=${_getIDBusiness()}`}>
                  {brandText}
                </Link>
              </BreadcrumbItem>
              {detailProducts() !== "" && (
                <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                  <p style={{ cursor: "no-drop" }}>{detailProducts()}</p>
                </BreadcrumbItem>
              )}
            </Breadcrumb>
          )}
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
