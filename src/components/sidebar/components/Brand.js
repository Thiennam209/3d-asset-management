import React from "react";

// Chakra imports
import { Flex, useColorModeValue } from "@chakra-ui/react";

import logoFPT from "assets/img/showroom_pic1.png";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <img src={logoFPT} alt="image" style={{width: "60%", marginBottom: "1.5rem"}} />
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
