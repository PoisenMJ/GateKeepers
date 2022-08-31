import React, { useRef, useState } from "react";
import { IoCloseSharp, IoExpandSharp } from "react-icons/io5";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import Container from "../../components/Container";
import { HomeNavbar } from "../../components/Navbars";
import { Order } from "../../types/order";
import { LG, MD } from "../../util/breakpoints";
import colors from "../../util/colors";
import { formatDateTimestamp } from "../../util/date";

const Wrapper = styled.div`
  margin: auto;
  width: 50%;

  @media screen and (max-width: ${LG}) {
    width: 75%;
  }
  @media screen and (max-width: ${MD}) {
    width: 90%;
  }
`;

const templateOrder: Order = {
  id: "123456",
  items: [
    {
      name: "Product Name",
      image: "",
      size: "Large",
      price: "$9.00",
    },
  ],
  total: "$10.00",
  deliveryAddress: {
    addressLine: "1 pen road",
    cityOrState: "City",
    country: "Country",
    zipCode: "xxxxxx",
  },
  date: Date.now().toString(),
};

const OrderItem = styled.div`
  background-color: ${colors.darkestGrey};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background-color: ${colors.darkerGrey};
  }

  * {
    color: ${colors.almostWhite};
  }
`;

const OrderDetails = styled(animated.div)`
  position: fixed;
  bottom: 0;
  left: 50%;
  background-color: ${colors.darkestGrey};
  padding: 1rem;
  transform: "translate(-50%, 0)";
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 50%;

  @media screen and (max-width: ${LG}) {
    width: 80%;
  }
  @media screen and (max-width: ${MD}) {
    width: 100%;
  }

  * {
    color: ${colors.almostWhite};
  }
`;

const FadedBG = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  pointer-events: none;
  z-index: 5;
  cursor: pointer;
`;

const Items = new Array(3).fill(templateOrder);

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  const [styles, api] = useSpring(() => ({
    transform: "translate(-50%, 100px)",
    opacity: 0,
  }));

  const expandOrder = (order: Order) => {
    setSelectedOrder(order);
    api.start({
      transform: "translate(-50%, 0px)",
      opacity: 1,
    });
    if(fadedBGRef.current) fadedBGRef.current.style.pointerEvents = "auto";
  };

  const closeExpandedOrder = () => {
    setSelectedOrder(undefined);
    api.start({
      transform: "translate(-50%, 100px",
      opacity: 0,
    });
    if(fadedBGRef.current) fadedBGRef.current.style.pointerEvents = "none";
  };

  const fadedBGRef = useRef<HTMLDivElement>(null);

  return (
    <Container className="flex justify-between">
      <div className="w-full h-full flex">
        <Wrapper>
          {Items.map((item) => (
            <OrderItem onClick={() => expandOrder(item)}>
              <span className="font-bold">{item.items.length} Items</span>
              <span className="font-bold">{item.price}</span>
              <span className="font-bold">
                {formatDateTimestamp(item.date, "small")}
              </span>
              <IoExpandSharp size={20} />
            </OrderItem>
          ))}
        </Wrapper>
        <OrderDetails style={{ transform: styles.transform }}>
          {selectedOrder && (
            <>
              <span className="font-black text-2xl text-center">
                Order #{selectedOrder.id}
              </span>
              <button className="absolute top-5 right-5" onClick={closeExpandedOrder}><IoCloseSharp size={25}/></button>
              {selectedOrder.items.map((item) => (
                <div className="flex flex-row items-center justify-between p-4 pb-5">
                  <div className="w-12 h-12 bg-slate-500"></div>
                  <div className="flex flex-col px-5 mr-auto">
                    <span className="font-bold text-lg justify-self-end">
                      {item.name}
                    </span>
                    <span className="font-light text-md justify-self-start">
                      {item.size}
                    </span>
                  </div>
                  <span className="font-bold text-md">{item.price}</span>
                </div>
              ))}
              <div className="flex flex-row justify-between">
                <span className="font-bold text-xl">
                  {formatDateTimestamp(selectedOrder.date, "big")}
                </span>
                <span className="font-bold text-xl">{selectedOrder.total}</span>
              </div>
            </>
          )}
        </OrderDetails>
      </div>
      <HomeNavbar />
      <FadedBG
        style={{ opacity: styles.opacity }}
        onClick={closeExpandedOrder}
        ref={fadedBGRef}
      />
    </Container>
  );
};

export default Orders;
