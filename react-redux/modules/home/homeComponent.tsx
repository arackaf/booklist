import React, {Component, PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';
import { isLoggedIn } from 'reactStartup';
import ajaxUtil from 'util/ajaxUtil';

import Measure from 'react-measure';

import {scaleLinear, scaleOrdinal, scaleBand, schemeCategory10} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom} from 'd3-axis';
import 'd3-transition';

import debounce from 'lodash.debounce';

import {loadSubjects} from 'applicationRoot/rootReducerActionCreators';
import {topLevelSubjectsSortedSelector, RootApplicationType, getRootSubject} from 'applicationRoot/rootReducer';

function getDisplay(i){
    return 'Number ' + i;
}

class BarChart extends PureComponent<any, any> {
    state = {left: 0};
    sized = ({bounds}) => {
        if (bounds.left != this.state.left){
            this.setState({left: bounds.left});
            console.log(bounds.left);
        }
    }
    render() {
        let margin = {top: 20, right: 10, bottom: 180, left: 0},
            {data, width, height} = this.props;

        if (!data || !data.length){
            return null;
        }

        let dataValues = data.map(({count}) => count),
            displayValues = data.map(({display}) => display),
            chartHeight = height - margin.top - margin.bottom,
            dataMax = max(dataValues),
            dataScale = scaleLinear().domain([0, dataMax]).range([0, chartHeight]),
            scaleX = scaleBand()
                        .domain(displayValues)
                        .range([0, width])
                        .paddingInner([0.1])
                        .paddingOuter([0.3])
                        .align([0.5]),
            colorScale = scaleOrdinal()
                        .domain(data.map((d, i) => i))
                        .range(schemeCategory10),
            style = {display: 'block'};//, marginLeft: 'auto', marginRight: 'auto'};
            {/*<Measure bounds={true} onResize={this.sized}>
                {({measureRef}) => (*/
            /*    )}
            </Measure> ref={measureRef} */}

        return (
                    <svg onMouseEnter={() => console.log('SVG IN')} style={style}  width={width} height={height}>
                        <g transform={`scale(1, -1) translate(${margin.left}, ${margin.bottom - height})`}>
                            {data.map((d, i) => (
                                <Bar key={i} index={i} count={data.length} x={scaleX(d.display)} y={0} colors={d.colors} width={scaleX.bandwidth()} height={dataScale(d.count)} graphWidth={width} adjustTooltip={this.state.left} />
                            ))}
                        </g>
                        <g transform={`translate(${margin.left}, ${-1 * margin.bottom})`}>
                            <Axis scale={scaleX} transform={`translate(0, ${height})`}></Axis>
                        </g>
                    </svg>
        );
    }
}
let counter = 1;
class Bar extends PureComponent<any, any> {
    el: any;
    tooltip: any;
    tooltipShown: boolean;
    overTooltip: boolean;
    overBar: boolean;

    manageTooltip: any

    _manageTooltip(show, evt?){
        if (show && this.tooltipShown){
            return;
        }
        if (show){
            this.tooltipShown = true;

            this.tooltip.style.display = 'block';
            this.tooltip.style.visibility = 'hidden';

            let {count, index} = this.props,
                tBox = this.tooltip.getBoundingClientRect(),
                element = findDOMNode(this.el),
                box = element.getBoundingClientRect(),
                left = box.left + 2,
                top = box.top + 2;

            if (tBox.width > box.width && ((index / count) > 0.5)) {
                left -= (tBox.width - box.width + 4);
            }

            this.tooltip.style.left = left + 'px';
            this.tooltip.style.top = top + 'px';
            

            this.tooltip.style.visibility = '';            
            this.tooltip.style.display = 'block';            


        } else {
            this.tooltipShown = false;
            this.tooltip.style.display = 'none';
        }
    }

    componentDidMount() {
        this.manageTooltip = debounce(this._manageTooltip, 50);

        let tooltip = document.createElement('div');
        tooltip.innerHTML = 'HELLO WORLDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD' + (counter++) + '<button>Hi</button>';
        tooltip.setAttribute('class', 'tooltip');
        tooltip.style.display = 'none';


        tooltip.onmouseenter = () => {
            console.log('tooltip mouse OVER')
            this.manageTooltip(true);
        }

        tooltip.onmouseleave = e => {
            console.log('tooltip mouse OUT');

            let el = document.elementFromPoint(e.clientX, e.clientY);

            do {
                if (tooltip === el){
                    console.log('false positive');
                    return;
                }
            } while (el = el.parentNode as any);
            
            this.manageTooltip(false);
        }

        this.tooltip = tooltip;
        //console.log({left: box.left, top: box.top, x: this.props.x, width: this.props.width, height: this.props.height})
        
        document.body.appendChild(tooltip);
    }
    _showTooltip = (evt) => {
        console.log('BAR IN')
        evt.persist();
        this.manageTooltip(true, evt);
    }
    _hideTooltip = evt => {
        evt.persist();
        this.manageTooltip(false);
    }
    updateTooltip(){
        let element = findDOMNode(this.el),
            box = element.getBoundingClientRect();
            //debugger;

        this.tooltip.style.left = ~~(this.props.x + this.props.adjustTooltip + 3) + 'px';
        this.tooltip.style.top = ~~(box.bottom - this.props.height + 3) + 'px';

        //this.tooltip.style.top = ~~(box.top - this.tooltip.clientHeight - 1) + 'px';
    }
    render() {
        let {x, height, width, colors, graphWidth} = this.props;
        return colors.length == 1 
            ? <SingleBar showTooltip={this._showTooltip} hideTooltip={this._hideTooltip} ref={el => this.el = el} color={colors} {...{height, width, x, graphWidth}} />
            : <MultiBar showTooltip={this._showTooltip} hideTooltip={this._hideTooltip} ref={el => this.el = el} colors={colors} {...{height, width, x, graphWidth}} />
    }
}

class SingleBar extends PureComponent<any, any> {
    el: any;
    componentDidMount() {
        this.drawBar();
    }
    componentDidUpdate(prevProps, prevState) {
        this.drawBar();
    }
    drawBar(){
        select(this.el)
            .transition()
            .duration(300)
            .attr("height", this.props.height)
            .attr("width", this.props.width)
            .attr("x", this.props.x)
    }
    render() {
        let {x, height, width, color, graphWidth, showTooltip, hideTooltip} = this.props;

        return (
            <rect onMouseOver={showTooltip} onMouseOut={hideTooltip} ref={el => this.el = el} x={graphWidth} y={0} height={0} fill={color} width={0} />
        );
    }
}

class MultiBar extends PureComponent<any, any> {
    el: any;
    componentDidMount() {
        this.drawBar();
    }
    componentDidUpdate(prevProps, prevState) {
        this.drawBar();
    }
    drawBar(){
        let {height, width, x, colors} = this.props,
            count = colors.length,
            sectionHeight = ~~(height / count),
            heightUsed = 0;

        colors.forEach((color, i) => {
            let isLast = i + 1 == count,
                barHeight = isLast ? height - heightUsed : sectionHeight;
    
            select(this[`el${i}`])
                .transition()
                .duration(300)
                .attr("height", barHeight)
                .attr("width", width)
                .attr("x", x)
                .attr("y", heightUsed);

            heightUsed += barHeight;
        })
    }
    render() {
        let {x, height, width, colors, graphWidth, showTooltip, hideTooltip} = this.props;

        return (
            <g onMouseOver={showTooltip} onMouseOut={hideTooltip}>
                {colors.map((color, i) => <rect ref={el => this[`el${i}`] = el} x={graphWidth} y={0} height={0} fill={color} width={0} />)}
            </g>
        );
    }
}

class Axis extends Component<any, any> {
    //df
    el: any;
    componentDidMount() {
        this.updateAxis();
    }
    componentDidUpdate(prevProps, prevState) {
        this.updateAxis();
    }
    updateAxis(){
        let {scale} = this.props;
        let xAxis = axisBottom().scale(scale);

        select(this.el)
            .transition()
            .duration(300)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(290) translate(-10, -10)")
            .style("text-anchor", "end");
    }
    render() {
        let {children, scale, ...rest} = this.props;
        return (
            <g ref={el => this.el = el} {...rest}></g>
        );
    }
}

const MainHomePane = props =>
    <div style={{margin: 0}}>
        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: '1200px' }}>
            <div className="panel panel-default">
                <div className="panel-body" style={{position: 'relative'}}>
                    {props.children}
                </div>
            </div>
        </div>
    </div>

function getColors(i){
    if (i === 0){
        return ['purple']
    } else if (i == 1){
        return ['orange']
    } else {
        return ['red', 'green', 'blue'];
    }
}

@connect((state: RootApplicationType) => ({
    subjects: topLevelSubjectsSortedSelector(state),
    subjectHash: state.app.subjectHash,
    subjectsLoaded: state.app.subjectsLoaded
}), {loadSubjects})
class HomeIfLoggedIn extends Component<any, any> {
    state = {data: null}
    componentDidMount() {
        if (this.props.subjectsLoaded){
            this.getChart();
        } else {
            this.props.loadSubjects();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.subjectsLoaded && this.props.subjectsLoaded){
            this.getChart();
        }
    }
    getChart = () => {
        let subjectIds = this.props.subjects.map(s => s._id),
            targetSubjectsLookup = new Set(subjectIds),
            subjectHash = this.props.subjectHash;

        let subjectResultsMap = new Map<string, number>([]);

        ajaxUtil.post('/book/booksBySubjects', {subjects: subjectIds, gatherToParents: 1}).then(resp => {
            resp.results.forEach(item => {
                let subjectsHeld = item.subjects
                                       .map(_id => targetSubjectsLookup.has(_id) ? _id : getRootSubject(subjectHash[_id].path))
                                       .map(_id => subjectHash[_id].name);

                let uniqueSubjects = Array.from(new Set(subjectsHeld)).sort().join(', ');

                if (!subjectResultsMap.has(uniqueSubjects)){
                    subjectResultsMap.set(uniqueSubjects, 0);
                }
                subjectResultsMap.set(uniqueSubjects, subjectResultsMap.get(uniqueSubjects) + 1);
            });

            this.setState({data: Array.from(subjectResultsMap).map(([name, count], i) => ({display: name, count, colors: getColors(i)})) })
        })
    }
    render() {
        //[5, 10, 4, 5, 7, 11, /*6, 31, 3, 7, 9, 18, 5, 22, 5*/]
        let {data} = this.state;
        return (
            <div>
                <MainHomePane>
                    Welcome to <i>My Library</i>.  Below is the beginnings of a data visualization of your library. More to come!
                    <hr />
                    <br />
                    <br />

                    {data ? <BarChart data={this.state.data} width={1100} height={600} /> : null}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </MainHomePane>
            </div>
        );
    }
}

const HomeIfNotLoggedIn = () => (
    <div>
        <MainHomePane>
            Welcome to <i>My Library</i>.
            <br /><br />
            This site is my own little passion project, the purpose of which is to track your library.  You scan in your books (or manually type in the isbn)
            and the books' info is fetched from Amazon, and stored for you.  You can then flexibly search and categorize your library. 
            <br /><br />
            So basically this site is of use to the extremely small percentage of people for whom the following are <i>all</i> true: they read a lot,
            own the books they read, and read non-eBooks.  As I said, this is more of a passion project than anything.
            <br /><br />
            It's free to sign up, and store up to 500 books.  In the remote chance someone actually wants to store more than that, there'll be some sort
            of nominal fee to help defray storage costs.
            <br /><br />
            For those interested in seeing the code for this site, the GitHub repository is <a target='_blank' href='https://github.com/arackaf/booklist'>here</a>
            <br /><br />
            <a className="btn btn-primary" href="/login">Login or create an account</a>
        </MainHomePane>
    </div>
)

export default class Home extends Component<any, any>{
    state = { isLoggedIn: isLoggedIn().logged_in };
    render(){
        return (
            <div style={{ paddingLeft: 0, paddingRight: 0 }} className="container-fluid">
                { this.state.isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn /> }
            </div>
        );
    }
}