"use client";

import { Box, useTheme } from "@mui/material";
import React from "react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const eventImages = ["cc1.jpg", "cc2.jpg", "cc3.jpg", "cc4.jpg"];

const Slider = () => {
	const theme = useTheme();

	const handleEventBannerClick = (index) => {
		console.log("Clicked Event Banner Index:", index);
	};

	return (
		<Box
			sx={{
				mt: 1.5,
				mb: 1.5,
				height: "400px",
				width: "100%",
				"& .swiper": {
					height: "100%",
					borderRadius: theme.shape.borderRadius,
				},
				"& .swiper-pagination-bullet": {
					backgroundColor: theme.palette.primary.light,
					opacity: 0.8,
				},
				"& .swiper-pagination-bullet-active": {
					backgroundColor: theme.palette.primary.main,
					opacity: 1,
				},
			}}
		>
			<Swiper
				modules={[Pagination, Autoplay]}
				spaceBetween={0}
				slidesPerView={1}
				pagination={{ clickable: true }}
				loop={true}
				autoplay={{
					delay: 3500,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}}
			>
				{eventImages.map((imgUrl, index) => (
					<SwiperSlide
						key={index}
						onClick={() => handleEventBannerClick(index)}
						style={{ cursor: "pointer" }}
					>
						<img
							src={imgUrl}
							alt={`Sự kiện ${index + 1}`}
							style={{
								display: "block",
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
};

export default Slider;
