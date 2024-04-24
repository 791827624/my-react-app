import { Carousel, Image } from "antd";
import React from "react";

export const Lili = () => {
  return (
    <div>
      <Carousel autoplay centerMode>
        {new Array(21).fill(0).map((_, index) => {
          return <Image src={`lili_pic${index + 1}.jpg`} key={index} />;
        })}
      </Carousel>
    </div>
  );
};
