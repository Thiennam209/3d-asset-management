/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* DTVT Asset Management - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 DTVT Asset Management (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// HIDE/CHANGE keyword

import React, { useEffect, useState } from "react";
import Sketchfab from "@sketchfab/viewer-api";
import "assets/css/TryonProduct.css";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

// Custom components
import Banner from "views/admin/marketplace/components/Banner";
import TableTopCreators from "views/admin/marketplace/components/TableTopCreators";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import NFT from "components/card/NFT";
import Card from "components/card/Card.js";

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/marketplace/variables/tableColumnsTopCreators";
// HIDE Recently Added, History
export default function Marketplace() {
  const sampleData =
    '[{"productId":"PD0000001","title":"Sofa","thumbnail":"","assets":[{"description":"Sofa","assetUID":"9d22695e0a9140eaa7c0d264f77baca2","isPublished":true,"image":"http://20.119.54.193:1337/uploads/sofa_1_c6617612bf.png"},{"description":"Sofa","assetUID":"9d22695e0a9140eaa7c0d264f77baca2","isPublished":true,"image":"http://20.119.54.193:1337/uploads/sofa_1_c6617612bf.png"}]},{"productId":"PD0000002","title":"Arm chair","thumbnail":"","assets":[{"description":"Arm chair","assetUID":"cb44d3c30fcd4e38ba872f57e98f1309","isPublished":true,"image":"http://20.119.54.193:1337/uploads/office_chair_968751ab52.png"},{"description":"Arm chair","assetUID":"cb44d3c30fcd4e38ba872f57e98f1309","isPublished":true,"image":"http://20.119.54.193:1337/uploads/office_chair_968751ab52.png"}]},{"productId":"PD0000003","title":"Coffee tables","thumbnail":"","assets":[{"description":"Coffee table","assetUID":"99732bb184194552a654ea72fedc964f","isPublished":true,"image":"http://20.119.54.193:1337/uploads/table_f4a54ed720.png"},{"description":"Coffee table","assetUID":"99732bb184194552a654ea72fedc964f","isPublished":true,"image":"http://20.119.54.193:1337/uploads/table_f4a54ed720.png"}]},{"productId":"PD0000004","title":"Pot plant","thumbnail":"","assets":[{"description":"Pot plant","assetUID":"dfa5e84f8ccb4270878065ce8b3d3d87","isPublished":true,"image":"http://20.119.54.193:1337/uploads/plant_00a123cbde.png"},{"description":"Pot plant","assetUID":"dfa5e84f8ccb4270878065ce8b3d3d87","isPublished":true,"image":"http://20.119.54.193:1337/uploads/plant_00a123cbde.png"}]}]';
  const tryonProducts = JSON.parse(sampleData);

  const autoPlayAll3DViewers = () => {
    var selectors = document.querySelectorAll("#api-frame");
    // console.log(selectors);
    Array.from(selectors).forEach((element) => {
      // console.log(element);
      var client = new Sketchfab(element);
      var uid = element.getAttribute("data-uid");
      client.init(uid, {
        success: function onSuccess(api) {
          api.start();

          api.addEventListener("viewerready", function () {
            // API is ready to use
            // Insert your code here
            // console.log("Viewer is ready");
          });
        },
        error: function onError() {
          console.log("Viewer error");
        },
      });
    });
  };

  // const loadData=()=>{
  //   const tryonProducts=JSON.parse(sampleData);
  //   tryonProducts.map((item,i)=>{
  //     console.log(item);
  //     console.log(item.assets[0].assetUID);
  //   });
  // }

  useEffect(() => {
    autoPlayAll3DViewers();
  }, []);

  // HANDLE DATA CHANGE
  const [activeColor, setActiveColor] = useState("black");

  const handleClick = (event) => {
    const selectedColor = event.target.getAttribute("data-color-sec");
    const picSrc = event.target.getAttribute("data-pic");
    const uid = event.target.getAttribute("data-uid");

    var imageSrc = document.querySelector(".productImage img");
    var iframeSrc = document.getElementById("api-frame");

    setActiveColor(selectedColor);
    imageSrc.setAttribute("src", picSrc);

    iframeSrc.setAttribute("src", `https://sketchfab.com/models/${uid}/embed`);
    iframeSrc.setAttribute("data-uid", uid);
  };

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      {/* Main Fields */}
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
        gap={{ base: "20px", xl: "20px" }}
        display={{ base: "block", xl: "grid" }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
        >
          <Banner />
          <Flex direction="column">
            <Flex
              mt="45px"
              mb="20px"
              justifyContent="space-between"
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Products
              </Text>
              <Flex
                align="center"
                me="20px"
                ms={{ base: "24px", md: "0px" }}
                mt={{ base: "20px", md: "0px" }}
              >
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#art"
                >
                  Art
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#music"
                >
                  Music
                </Link>
                <Link
                  color={textColorBrand}
                  fontWeight="500"
                  me={{ base: "34px", md: "44px" }}
                  to="#collectibles"
                >
                  Collectibles
                </Link>
                <Link color={textColorBrand} fontWeight="500" to="#sports">
                  Sports
                </Link>
              </Flex>
            </Flex>
            <SimpleGrid>
              {tryonProducts.map((item, i) => (
                <div className="container">
                  <div className="imgBx">
                    <iframe
                      id="api-frame"
                      data-uid={item.assets[0].assetUID}
                      // data-uid="d023021664b14066ba2091b46796d48a"
                      title="Sleek_modern_dining_table_set"
                      frameBorder="0"
                      allowFullScreen=""
                      mozallowfullscreen="true"
                      webkitallowfullscreen="true"
                      allow="autoplay; fullscreen; xr-spatial-tracking"
                      xr-spatial-tracking=""
                      execution-while-out-of-viewport=""
                      execution-while-not-rendered=""
                      web-share=""
                      src={`https://sketchfab.com/models/${item.assets[0].assetUID}/embed`}
                      // src="https://sketchfab.com/models/d023021664b14066ba2091b46796d48a/embed"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "30px 0 0 30px",
                      }}
                    ></iframe>
                  </div>
                  <div className="details">
                    <div className="content">
                      <h2>
                        {item.assets[0].description} <br />
                        <span>{item.productId}</span>
                      </h2>
                      {/* <p>
                      Featuring soft foam cushioning and lightweight, woven
                      fabric in the upper, the Jordan Proto-Lyte is made for
                      all-day, bouncy comfort. Lightweight Breathability:
                      Lightweight woven fabric with real or synthetic leather
                      provides breathable support. Cushioned Comfort: A
                      full-length foam midsole delivers lightweight, plush
                      cushioning. Secure Traction: Exaggerated
                      herringbone-pattern outsole offers traction on a variety
                      of surfaces.
                    </p> */}
                      <div className="productImage">
                        <img
                          src={item.assets[0].image}
                          alt="Grey Chair"
                          style={{
                            height: 200,
                            width: 350,
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <p className="product-colors">
                        Try-on models:
                        <span
                          className={`black ${
                            activeColor === "black" ? "active" : ""
                          }`}
                          data-color-primary="#000"
                          data-color-sec="black"
                          data-pic={item.assets[0].image}
                          onClick={handleClick}
                          data-uid={item.assets[0].assetUID}
                        ></span>
                        <span
                          className={`red ${
                            activeColor === "red" ? "active" : ""
                          }`}
                          data-color-primary="#7E021C"
                          data-color-sec="red"
                          data-pic={item.assets[1].image}
                          onClick={handleClick}
                          data-uid={item.assets[1].assetUID}
                        ></span>
                      </p>
                      <a id="8th"></a>
                      {/* <a
                        id="8th"
                        data-8code="9fys4"
                        style={{
                          flexDirection: "column",
                          display: "flex",
                          alignItems: "center",
                        }}
                      ></a> */}
                    </div>
                  </div>
                </div>
              ))}
            </SimpleGrid>
            {/* <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
              <NFT
                name="Dining Table"
                author="Ha Van"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4]}
                embededUrl="https://sketchfab.com/models/ef56949ac8bf43cc84d2226a5b5e0e14/embed"
                uid="ef56949ac8bf43cc84d2226a5b5e0e14"
                currentbid="3.5"
                download="#"
              />
              <NFT
                name="Wooding Drawer"
                author="By Nick Wilson"
                bidders={[Avatar1, Avatar2]}
                embededUrl="https://sketchfab.com/models/01fe38c6073942deb5e2fe3b2c801084/embed"
                uid="01fe38c6073942deb5e2fe3b2c801084"
                currentbid="4.7"
                download="#"
              />
              <NFT
                name="Wood Table"
                author="By Will Smith"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4]}
                embededUrl="https://sketchfab.com/models/6dd98f8b111446169b1dc867d0936554/embed"
                uid="6dd98f8b111446169b1dc867d0936554"
                currentbid="4.2"
                download="#"
              />

              <NFT
                name="Dining Table"
                author="Ha Van"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4]}
                embededUrl="https://sketchfab.com/models/ef56949ac8bf43cc84d2226a5b5e0e14/embed"
                uid="ef56949ac8bf43cc84d2226a5b5e0e14"
                currentbid="3.5"
                download="#"
              />
              <NFT
                name="Wooding Drawer"
                author="By Nick Wilson"
                bidders={[Avatar1, Avatar2]}
                embededUrl="https://sketchfab.com/models/01fe38c6073942deb5e2fe3b2c801084/embed"
                uid="01fe38c6073942deb5e2fe3b2c801084"
                currentbid="4.7"
                download="#"
              />
              <NFT
                name="Wood Table"
                author="By Will Smith"
                bidders={[Avatar1, Avatar2, Avatar3, Avatar4]}
                embededUrl="https://sketchfab.com/models/6dd98f8b111446169b1dc867d0936554/embed"
                uid="6dd98f8b111446169b1dc867d0936554"
                currentbid="4.2"
                download="#"
              />
            </SimpleGrid> */}
            {/* <Text
              mt="45px"
              mb="36px"
              color={textColor}
              fontSize="2xl"
              ms="24px"
              fontWeight="700"
            >
              Recently Added
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap='20px'
              mb={{ base: "20px", xl: "0px" }}>
              <NFT
                name='Swipe Circles'
                author='By Peter Will'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft4}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='Colorful Heaven'
                author='By Mark Benjamin'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft5}
                currentbid='0.91 ETH'
                download='#'
              />
              <NFT
                name='3D Cubes Art'
                author='By Manny Gates'
                bidders={[
                  Avatar1,
                  Avatar2,
                  Avatar3,
                  Avatar4,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                  Avatar1,
                ]}
                image={Nft6}
                currentbid='0.91 ETH'
                download='#'
              />
            </SimpleGrid> */}
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <Card px="0px" mb="20px">
            <TableTopCreators
              tableData={tableDataTopCreators}
              columnsData={tableColumnsTopCreators}
            />
          </Card>
          {/* <Card p="0px">
            <Flex
              align={{ sm: "flex-start", lg: "center" }}
              justify="space-between"
              w="100%"
              px="22px"
              py="18px"
            >
              <Text color={textColor} fontSize="xl" fontWeight="600">
                History
              </Text>
              <Button variant="action">See all</Button>
            </Flex>

            <HistoryItem
              name="Colorful Heaven"
              author="By Mark Benjamin"
              date="30s ago"
              image={Nft5}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Abstract Colors"
              author="By Esthera Jackson"
              date="58s ago"
              image={Nft1}
              price="0.91 ETH"
            />
            <HistoryItem
              name="ETH AI Brain"
              author="By Nick Wilson"
              date="1m ago"
              image={Nft2}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Swipe Circles"
              author="By Peter Will"
              date="1m ago"
              image={Nft4}
              price="0.91 ETH"
            />
            <HistoryItem
              name="Mesh Gradients "
              author="By Will Smith"
              date="2m ago"
              image={Nft3}
              price="0.91 ETH"
            />
            <HistoryItem
              name="3D Cubes Art"
              author="By Manny Gates"
              date="3m ago"
              image={Nft6}
              price="0.91 ETH"
            />
          </Card> */}
        </Flex>
      </Grid>
      {/* Delete Product */}
    </Box>
  );
}
