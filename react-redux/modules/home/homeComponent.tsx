import React, {Component} from 'react';
import { isLoggedIn } from 'reactStartup';

import {scaleLinear, scaleOrdinal, schemeCategory10} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import {axisBottom} from 'd3-axis';

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
            {data, size} = this.props,
            dataMax = max(data),
            yScale = scaleLinear().domain([0, dataMax]).range([0, size[1]]),
            colorScale = scaleOrdinal()
                            .domain(data.map((d, i) => i))
                            .range(schemeCategory10);

        let scaleX = scaleLinear().domain([0, data.length]);

        let xAxis = axisBottom().scale(scaleX);

        select(node)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect');

        select(node)
            .selectAll('rect')
            .data(data)
            .exit()
            .remove();            

        select(node)
            .selectAll('rect')
            .data(data)
            .attr('x', (d, i) => (i * 25) + (i * 5))
            .attr('y', (d, i) => size[1] - yScale(d))
            .style('fill', (d, i) => colorScale(i))
            .attr('height', (d, i) => yScale(d))
            .attr('width', 25);

        select(node)
            .selectAll('g.brushAxis')
            .data(data)
            .enter()
            .append('g.brushAxis');

        select(node)
            .selectAll('g.brushAxis')
            .call(xAxis);

    }
    render() {
        return (
            <svg ref={node => this.node = node} width={500} height={500}>
                
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

            <BarChart data={[5, 10, 4, 5, 7, 11, 6, 31, 3, 7, 9, 18, 5, 22, 5]} size={[500, 500]} />
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