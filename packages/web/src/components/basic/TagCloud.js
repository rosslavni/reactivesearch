import React, { Component } from "react";
import { connect } from "react-redux";

import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryOptions
} from "@appbaseio/reactivecore/lib/actions";
import {
	getQueryOptions,
	pushToAndClause,
	checkValueChange,
	getAggsOrder,
	checkPropChange,
	checkSomePropChange,
	getClassName
} from "@appbaseio/reactivecore/lib/utils/helper";

import types from "@appbaseio/reactivecore/lib/utils/types";

import Title from "../../styles/Title";
import TagList from "../../styles/TagList";

class TagCloud extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentValue: "",
			options: []
		};
		this.type = "term";
		this.internalComponent = props.componentId + "__internal";
	}

	componentWillMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);
		this.updateQueryOptions(this.props);

		this.setReact(this.props);

		if (this.props.selectedValue) {
			this.setValue(this.props.selectedValue);
		} else if (this.props.defaultSelected) {
			this.setValue(this.props.defaultSelected);
		}
	}

	componentWillReceiveProps(nextProps) {
		checkPropChange(
			this.props.react,
			nextProps.react,
			() => this.setReact(nextProps)
		);
		checkPropChange(
			this.props.options,
			nextProps.options,
			() => {
				this.setState({
					options: nextProps.options[nextProps.dataField].buckets || []
				});
			}
		);
		checkSomePropChange(
			this.props,
			nextProps,
			["size", "sortBy"],
			() => this.updateQueryOptions(nextProps)
		);

		if (this.props.defaultSelected !== nextProps.defaultSelected) {
			this.setValue(nextProps.defaultSelected);
		} else if (this.state.currentValue !== nextProps.selectedValue) {
			this.setValue(nextProps.selectedValue || "");
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	}

	setReact = (props) => {
		const { react } = props;
		if (react) {
			const newReact = pushToAndClause(react, this.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: this.internalComponent });
		}
	};

	defaultQuery = (value, props) => {
		if (value) {
			return {
				[this.type]: {
					[props.dataField]: value
				}
			};
		}
		return null;
	};

	setValue = (value, props = this.props) => {
		if (value == this.state.currentValue) {
			value = "";
		}

		const performUpdate = () => {
			this.setState({
				currentValue: value
			}, () => {
				this.updateQuery(value, props);
			});
		}

		checkValueChange(
			props.componentId,
			value,
			props.beforeValueChange,
			props.onValueChange,
			performUpdate
		);
	};

	updateQuery = (value, props) => {
		const query = props.customQuery || this.defaultQuery;
		let onQueryChange = null;
		if (props.onQueryChange) {
			onQueryChange = props.onQueryChange;
		}
		props.updateQuery({
			componentId: props.componentId,
			query: query(value, props),
			value,
			label: props.filterLabel,
			showFilter: props.showFilter,
			onQueryChange,
			URLParams: props.URLParams
		});
	};

	updateQueryOptions = (props) => {
		const queryOptions = getQueryOptions(props);
		queryOptions.aggs = {
			[props.dataField]: {
				terms: {
					field: props.dataField,
					size: props.size,
					order: getAggsOrder(props.sortBy)
				}
			}
		}
		props.setQueryOptions(this.internalComponent, queryOptions);
		// Since the queryOptions are attached to the internal component,
		// we need to notify the subscriber (parent component)
		// that the query has changed because no new query will be
		// auto-generated for the internal component as its
		// dependency tree is empty
		props.updateQuery({
			componentId: this.internalComponent,
			query: null
		});
	};

	handleInputChange = (e) => {
		const { value } = e.target;
		this.setState({
			searchTerm: value
		});
	};

	render() {
		const min = 0.8, max = 3;

		if (this.state.options.length === 0) {
			return null;
		}

		let highestCount = 0;
		this.state.options.forEach(item => {
			highestCount = item.doc_count > highestCount ? item.doc_count : highestCount;
		});

		return (
			<div style={this.props.style} className={this.props.className}>
				{this.props.title && <Title className={getClassName(this.props.innerClass, "title") || null}>{this.props.title}</Title>}
				<TagList className={getClassName(this.props.innerClass, "list") || null}>
					{
						this.state.options
							.map(item => {
								const size = ((item.doc_count / highestCount) * (max - min)) + min;

								return (<span
									key={item.key}
									className={getClassName(this.props.innerClass, "input")}
									onClick={() => this.setValue(item.key)}
									style={{ fontSize: `${size}em` }}
									className={this.state.currentValue === item.key ? "active" : null}
								>
									{item.key}
									{
										this.props.showCount &&
										` (${item.doc_count})`
									}
								</span>);
							})
					}
				</TagList>
			</div>
		);
	}
}

TagCloud.propTypes = {
	componentId: types.stringRequired,
	addComponent: types.funcRequired,
	dataField: types.stringRequired,
	sortBy: types.sortByWithCount,
	setQueryOptions: types.funcRequired,
	updateQuery: types.funcRequired,
	defaultSelected: types.string,
	react: types.react,
	options: types.options,
	removeComponent: types.funcRequired,
	beforeValueChange: types.func,
	onValueChange: types.func,
	customQuery: types.func,
	onQueryChange: types.func,
	placeholder: types.string,
	title: types.title,
	filterLabel: types.string,
	selectedValue: types.selectedValue,
	URLParams: types.boolRequired,
	showFilter: types.bool,
	size: types.number,
	style: types.style,
	className: types.string,
	innerClass: types.style,
	showCount: types.bool
}

TagCloud.defaultProps = {
	size: 100,
	sortBy: "asc",
	URLParams: false,
	showFilter: true,
	placeholder: "Search",
	style: {},
	className: null
}

const mapStateToProps = (state, props) => ({
	options: state.aggregations[props.componentId],
	selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || ""
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	updateQuery: (updateQueryObject) => dispatch(updateQuery(updateQueryObject)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props))
});

export default connect(mapStateToProps, mapDispatchtoProps)(TagCloud);
