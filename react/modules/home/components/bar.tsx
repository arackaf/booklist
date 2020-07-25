import React, { PureComponent } from "react";
import { useSpring, useSprings, config, animated } from "react-spring";

export default class Bar extends PureComponent<any, any> {
  el: any;
  tooltip: any;
  tooltipShown: boolean;
  overTooltip: boolean;
  overBar: boolean;

  manageTooltip: any;

  render() {
    let { x, data, height, width, totalSvgWidth, count, hoverBar, unHoverBar } = this.props;

    return data.entries.length == 1 ? (
      <SingleBar
        color={data.entries[0].color}
        children={data.entries[0].children}
        {...{ data, count, height, width, x, totalSvgWidth, hoverBar, unHoverBar }}
      />
    ) : (
      <MultiBar {...{ data, count, height, width, x, totalSvgWidth, hoverBar, unHoverBar }} />
    );
  }
}

const SingleBar = props => {
  let { color, hoverBar, unHoverBar, data } = props;

  let animatedValues = useSpring({
    config: config.stiff,
    from: { height: 0, width: 0, x: props.totalSvgWidth },
    to: { height: props.height, width: props.width, x: props.x }
  });

  return (
    <g onMouseOver={() => hoverBar(data.groupId)} onMouseOut={() => unHoverBar(data.groupId)}>
      <animated.rect {...animatedValues} y={0} fill={color} />
    </g>
  );
};

const MultiBar = props => {
  let { height, data, hoverBar, unHoverBar } = props;
  let count = data.entries.length;
  let colors = data.entries.map(e => e.color);

  let heightUsed = 0;
  const springs = useSprings(
    count,
    colors.map((color, i) => {
      let isLast = i + 1 == count;
      let sectionHeight = ~~(height / count);
      let barHeight = isLast ? height - heightUsed : sectionHeight;

      const heightToUse = heightUsed;
      heightUsed += barHeight;

      return {
        config: config.stiff,
        from: { x: props.totalSvgWidth, y: 0, height: 0, width: 0, fill: color },
        to: { x: props.x, y: heightToUse, height: barHeight, width: props.width, fill: color }
      };
    })
  );

  return (
    <g onMouseOver={() => hoverBar(data.groupId)} onMouseOut={() => unHoverBar(data.groupId)}>
      {springs.map((props: any) => (
        <animated.rect {...props} />
      ))}
    </g>
  );
};
