import React from "react";
import { useTransition, useSpring, animated, config } from "react-spring";

const Axis = props => {
  let { children, scale, graphWidth, data, scaleX, masterTransform, ...rest } = props;

  const getTranslate = d => {
    let x = scaleX(d.display);
    let width = scaleX.bandwidth();
    let translateX = x + width / 2;

    return `translate(${translateX}, 0)`;
  };

  const axisTickTransitions = useTransition(data, {
    config: config.stiff,
    from: { opacity: 0, transform: "" },
    enter: d => ({ opacity: 1, transform: getTranslate(d) }),
    update: d => ({ transform: getTranslate(d) }),
    leave: { opacity: 0 },
    keys: item => item.display
  });

  const mainAxisTransitions = useSpring({
    to: { transform: props.transform, d: `M0.5,6 V0.5 H${props.graphWidth + 0.5} V 6`, masterTransform },
    config: config.stiff
  });

  return (
    <animated.g transform={mainAxisTransitions.masterTransform}>
      <animated.g fontSize="10" {...rest} transform={mainAxisTransitions.transform}>
        <animated.path fill="none" stroke="black" d={mainAxisTransitions.d} />
        {axisTickTransitions((styles, d) => {
          return (
            <animated.g style={{ opacity: styles.opacity }} transform={styles.transform}>
              <line stroke="#000" y1="0" y2="6" x1="0" x2="0"></line>
              <text fill="#000" style={{ textAnchor: "end" }} transform="translate(0, 10) rotate(300)">
                {d.display}
              </text>
            </animated.g>
          );
        })}
      </animated.g>
    </animated.g>
  );
};

export default Axis;
