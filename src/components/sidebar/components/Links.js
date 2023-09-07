/* eslint-disable */
import React from "react";
import { NavLink, useLocation, Redirect, Route, Switch } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  // let activeIcon = useColorModeValue("brand.500", "white");
  // let textColor = useColorModeValue("secondaryGray.500", "white");
  // let brandColor = useColorModeValue("brand.500", "brand.400");
  let activeIcon = "#FFFFFF";
  let textColor = "#6C757D";
  let bgColor = "#E9ECEF";
  let brandColor = "#0A58CA";
  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  const showIconSidebarLinks = (route) => {
    return (
      <>
        {route.icon ? (
          <Box marginBottom='55px'>
            <HStack
              spacing={
                activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
              }
              py='5px'
              ps='10px'>
              <Flex w='100%' alignItems='center' justifyContent='center'>
                <Box style={{ display: "inline-flex", padding: "8px 16px", alignItems: "center", gap: "18px", borderRadius: "8px" }}
                  background={activeRoute(route.path.toLowerCase())
                    ? brandColor
                    : bgColor}>
                  <Box
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeIcon
                        : textColor
                    }>
                    {route.icon}
                  </Box>
                </Box>
              </Flex>
              <Box
                h='36px'
                w='4px'
                bg={
                  activeRoute(route.path.toLowerCase())
                    ? brandColor
                    : "transparent"
                }
                borderRadius='5px'
              />
            </HStack>
          </Box>
        ) : (
          <Box>
            <HStack
              spacing={
                activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
              }
              py='5px'
              ps='10px'>
              <Text
                me='auto'
                color={
                  activeRoute(route.path.toLowerCase())
                    ? activeColor
                    : inactiveColor
                }
                fontWeight={
                  activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                }>
                {route.name}
              </Text>
              <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
            </HStack>
          </Box>
        )}
      </>
    )
  }

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    // const routeMove = [{ path: "/details" }]
    // const newArrayRoutes = routes.filter(item => routeMove.every(removeRoutes => removeRoutes.path !== item.path))
    // routes = newArrayRoutes
    return routes.map((route, index) => {
      
        if (route.layout === "/admin") {
          if (route.path === "/list-product") {
            return (showIconSidebarLinks(route))
          } else {
            return (<NavLink key={index} to={route.layout + route.path}>{showIconSidebarLinks(route)}</NavLink>)
          }
        } else {
          <Switch>
            <Redirect from='/' to='/admin/list-business' />
          </Switch>
        }
      // if (route.layout === "/admin") {
      //   if (route.path === "/list-product") {
      //     const routeLayout = "/list-product";
      //     return (showIconSidebarLinks(route, routeLayout))
      //   } else {
      //     const routeLayout = ""
      //     return (<NavLink key={index} to={route.layout + route.path}>{showIconSidebarLinks(route, routeLayout)}</NavLink>)
      //   }

      // } else {
      //   console.log("không");
      // }
      // switch (route.path) {
      //   case "/list-product": { const routeLayout = "/list-product"; return (showIconSidebarLinks(route, routeLayout)) } break;
      //   case "/detail-product/details": { const routeLayout = "/details"; return (showIconSidebarLinks(route, routeLayout)) }; break;
      //   default: { const routeLayout = ""; return (<NavLink key={index} to={route.layout + route.path}>{showIconSidebarLinks(route, routeLayout)}</NavLink>) }
      // }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
