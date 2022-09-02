import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from '../../util/colors';
import { animated, useSpring } from 'react-spring';

const Parent = styled(animated.div)`
  background-color: ${colors.darkerGrey};
  left: 50%;
  transform: translateX(-50%);
  padding: 1.5rem 2rem;
  border-radius: .35rem;
`;

const Text = styled.span`
  color: ${colors.almostWhite};
`;

interface Props {
  text: string;
  color?: string;
}

const FlashMessageEventName = "flashMessage";

export type FlashMessageEvent = CustomEvent<{ text: string, color?: string }>

export const TriggerFlashMessage = ({ text, color = colors.darkerGrey }: Props) => {
  document.dispatchEvent(
    new CustomEvent(FlashMessageEventName, {
      detail: {
        text,
        color
      }
    })
  );
};


const FlashMessage = () => {
  const [text, setText] = useState("");
  const [color, setColor] = useState(colors.darkerGrey);

  const [style, api] = useSpring(() => ({
    opacity: 0
  }));

  const eventHandler = (evt: CustomEvent<{ text: string, color: string }>) => {
    setText(evt.detail.text);
    setColor(evt.detail.color);
    api.start({ opacity: 1 });

    setTimeout(() => {
      api.start({ opacity: 0 });
    }, 3000);
  }

  useEffect(() => {
    document.addEventListener(FlashMessageEventName, eventHandler as EventListener);
  }, []);

  return (
    <Parent style={style} className="absolute bottom-5" color={color}>
      <Text>{text}</Text>
    </Parent>
  )
};

export default FlashMessage;