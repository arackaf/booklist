import React, {Component} from 'react';
import { isLoggedIn } from 'reactStartup';

import {scaleLinear, scaleOrdinal, scaleBand, schemeCategory10} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom} from 'd3-axis';

function getDisplay(i){
    return 'Number ' + i;
}

class BarChart extends Component<any, any> {
    node: any;
    componentDidUpdate(prevProps, prevState) {
        this.createBarChart();
    }
    componentDidMount() {
        this.createBarChart();
    }
    createBarChart = () => {
        let node = this.node,
            margin = {top: 20, right: 10, bottom: 80, left: 0},
            {data, size} = this.props,
            chartHeight = size[1] - margin.top - margin.bottom,
            dataMax = max(data),
            dataScale = scaleLinear().domain([0, dataMax]).range([0, chartHeight]),
            scaleX = scaleBand()
                        .domain(data.map((d, i) => getDisplay(i)))
                        .range([0, 500])
                        .paddingInner([0.1])
                        .paddingOuter([0.3])
                        .align([0.5]),
            colorScale = scaleOrdinal()
                            .domain(data.map((d, i) => i))
                            .range(schemeCategory10);

        let axisScale = scaleLinear().domain([1, data.length]).range([0, size[1]]);
        let xAxis = axisBottom().scale(scaleX);

        let panel = select("svg")
                        .append("g")
                        .attr("transform", `translate(${margin.left}, ${-1 * margin.bottom})`);

        panel
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect');

        panel
            .selectAll('rect')
            .data(data)
            .exit()
            .remove();            

        panel
            .selectAll('rect')
            .data(data)
            .attr('x', (d, i) => scaleX(getDisplay(i)))
            .attr('y', (d, i) => size[1] - dataScale(d))
            .style('fill', (d, i) => colorScale(i))
            .attr('height', (d, i) => dataScale(d))
            .attr('width', scaleX.bandwidth());

        panel
            .append('g')
            .attr('transform', 'translate(0, 500)') //I guess - just stick it somewhere  
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(290) translate(-10, -10)")
            .style("text-anchor", "end");


            //;


            //            .attr("dy", ".35em")

    }
    render() {
        return (
            <svg ref={node => this.node = node} width={500} height={500} style={{backgroundColor: 'lightblue'}}>
                
            </svg>
        );
    }
}

const MainHomePane = props =>
    <div className="row" style={{margin: 0}}>
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
        <div style={{ marginLeft: 10, marginRight: 10 }} className="col-md-10 col-lg-6">
            <div className="panel panel-default">
                <div className="panel-body">
                    {props.children}
                </div>
            </div>
        </div>
        <div className="hidden-xs hidden-sm col-md-1 col-lg-3"></div>
    </div>

const HomeIfLoggedIn = () => (
    <div>
        <MainHomePane>
            Welcome to <i>My Library</i>.  Eventually there'll be some sort of interesting dashboard here.  Until then, just use the menu above
            to either view your library, or scan some books in.
            <br />
            <br />

            <BarChart data={[5, 10, 4, 5, 7, 11, /*6, 31, 3, 7, 9, 18, 5, 22, 5*/]} size={[500, 500]} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </MainHomePane>
    </div>
)

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
            <a className="btn btn-primary" href="#login">Login or create an account</a>
        </MainHomePane>
    </div>
)

export default class Home extends Component<any, any>{
    state = { isLoggedIn: isLoggedIn() };
    render(){
        return (
            <div style={{ paddingLeft: 0, paddingRight: 0 }} className="container-fluid">
                { this.state.isLoggedIn ? <HomeIfLoggedIn /> : <HomeIfNotLoggedIn /> }
            </div>
        );
    }
}