import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
	ReactiveBase,
	DateRange,
	ReactiveList,
	SelectedFilters
} from "../../src";

class Main extends Component {
	onData = (res) => {
		const data = res._source;
		return (<div key={res._id}>
			<h2>{data.owner}/{data.name}</h2>
			<h4>{data.stars} 🌟</h4>
		</div>);
	}

	render() {
		return (
			<ReactiveBase
				app="gitxplore-live"
				credentials="bYTSo47tj:d001826a-f4ef-42c5-b0aa-a94f29967ba0"
				theme={{
					primaryColor: "salmon"
				}}
			>
				<div className="row">
					<div className="col">
						<DateRange
							componentId="DateRangeComponent"
							dataField="pushed"
							queryFormat="date_time_no_millis"
							title="Date Range"
							initialMonth={new Date("2017-04-07")}
							URLParams
						/>
					</div>

					<div className="col">
						<SelectedFilters />
						<ReactiveList
							dataField="name"
							componentId="ReactiveList"
							size={20}
							from={0}
							onData={this.onData}
							pagination
							defaultQuery={() => ({
								query: {
									match_all: {}
								},
								sort: {
									stars: { order: "desc" }
								}
							})}
							react={{
								and: ["DateRangeComponent"]
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById("root"));
