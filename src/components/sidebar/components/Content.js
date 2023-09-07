// chakra imports

import { Box, Flex, Stack } from "@chakra-ui/react";

//   Custom components

import Brand from "components/sidebar/components/Brand";

import Links from "components/sidebar/components/Links";

import SidebarCard from "components/sidebar/components/SidebarCard";

import React from "react";

import { IoIosLogOut } from "react-icons/io";

import "./Tooltip.css";

const handleLogout = () => {
  localStorage.removeItem("dtvt");

  window.location.reload();
};

const handleMouseOver = () => {
  const tooltip = document.querySelector(".tooltip-content");

  tooltip.style.display = "block";
};

const handleMouseOut = () => {
  const tooltip = document.querySelector(".tooltip-content");

  tooltip.style.display = "none";
};

// FUNCTIONS

// HIDE SidebarCard

function SidebarContent(props) {
  const { routes } = props;

  // SIDEBAR

  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px="16px"
      borderRadius="30px"
      gap="35px"
    >
      <Brand />

      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mb="90px" display="flex" justifyContent="center">
        {/* <SidebarCard /> */}

        <div style={{ position: "relative" }}>
          <div className="tooltip-content">LogOut</div>

          <div
            onClick={handleLogout}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <IoIosLogOut
              style={{ width: "32px", height: "32px", color: "#6C757D" }}
            />
          </div>
        </div>
      </Box>
    </Flex>
  );
}

export default SidebarContent;
