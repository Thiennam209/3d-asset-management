// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, { useState, useEffect } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

import Sketchfab from "@sketchfab/viewer-api";

export default function NFT(props) {
  const { embededUrl,uid, name, author, bidders, download, currentbid } = props;
  const [like, setLike] = useState(false);

  const textColor = useColorModeValue("navy.700", "white");
  const textColorBid = useColorModeValue("brand.500", "white");
  
  // useEffect(()=>{
  //   var selectors = document.getElementById("api-frame");
    
  //   const client = new Sketchfab(selectors);

  //   client.init("6dd98f8b111446169b1dc867d0936554", {
  //     success: function onSuccess(api) {
  //       console.log("pre-start");
  //       api.start();
  //       console.log("start done");

  //       api.addEventListener("viewerready", function () {
  //         // API is ready to use
  //         // Insert your code here
  //         console.log("Viewer is ready");
  //       });
  //     },
  //     error: function onError() {
  //       console.log("Viewer error");
  //     },
  //   });
  //   console.log("Enddd");

  //   console.log('heloooooo');
  //   console.log(selectors);
  // })

  return (
    <Card p='20px'>
      <Flex direction={{ base: "column" }} justify='center'>
        <Box mb={{ base: "20px", "2xl": "20px" }} position='relative'>
          {/* <Image
            src={image}
            w={{ base: "100%", "3xl": "100%" }}
            h={{ base: "100%", "3xl": "100%" }}
            borderRadius='20px'
          /> */}


          <iframe id="api-frame" data-uid={uid} 
            title="Sleek_modern_dining_table_set" 
            frameBorder="0" allowFullScreen="" 
            mozallowfullscreen="true" 
            webkitallowfullscreen="true" 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            xr-spatial-tracking="" 
            execution-while-out-of-viewport="" 
            execution-while-not-rendered="" 
            web-share="" 
            src={embededUrl}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
            }}
            > </iframe>
          
          {/* {iframe} */}
          <Button
            position='absolute'
            bg='white'
            _hover={{ bg: "whiteAlpha.900" }}
            _active={{ bg: "white" }}
            _focus={{ bg: "white" }}
            p='0px !important'
            top='14px'
            right='14px'
            borderRadius='50%'
            minW='36px'
            h='36px'
            onClick={() => {
              setLike(!like);
            }}>
            <Icon
              transition='0.2s linear'
              w='20px'
              h='20px'
              as={like ? IoHeart : IoHeartOutline}
              color='brand.500'
            />
          </Button>
        </Box>
        <Flex flexDirection='column' justify='space-between' h='100%'>
          <Flex
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mb='auto'>
            <Flex direction='column'>
              <Text
                color={textColor}
                fontSize={{
                  base: "xl",
                  md: "lg",
                  lg: "lg",
                  xl: "lg",
                  "2xl": "md",
                  "3xl": "lg",
                }}
                mb='5px'
                fontWeight='bold'
                me='14px'>
                {name}
              </Text>
              <Text
                color='secondaryGray.600'
                fontSize={{
                  base: "sm",
                }}
                fontWeight='400'
                me='14px'>
                {author}
              </Text>
            </Flex>
            <AvatarGroup
              max={3}
              color={textColorBid}
              size='sm'
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}
              fontSize='12px'>
              {bidders.map((avt, key) => (
                <Avatar key={key} src={avt} />
              ))}
            </AvatarGroup>
          </Flex>
          <Flex
            align='start'
            justify='space-between'
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row",
            }}
            mt='25px'>
            {/* <Text fontWeight='700' fontSize='sm' color={textColorBid}>
              Current Bid: {currentbid}
            </Text> */}
            <Text fontWeight='700' fontSize='sm' color={textColorBid}>
              Rating: {currentbid}
            </Text>
            <Link
              href={download}
              mt={{
                base: "0px",
                md: "10px",
                lg: "0px",
                xl: "10px",
                "2xl": "0px",
              }}>
              {/* <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'>
                Place Bid
              </Button> */}
               <Button
                variant='darkBrand'
                color='white'
                fontSize='sm'
                fontWeight='500'
                borderRadius='70px'
                px='24px'
                py='5px'>
                View details
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
