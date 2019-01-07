import React, { Component } from 'react';
import {
	addComponent,
	removeComponent,
	watchComponent,
	updateQuery,
	setQueryListener,
	setQueryOptions,
} from '@appbaseio/reactivecore/lib/actions';
import hoistNonReactStatics from 'hoist-non-react-statics';
import {
	isEqual,
	checkValueChange,
	checkPropChange,
	getClassName,
	formatDate,
	getOptionsFromQuery,
} from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import XDate from 'xdate';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { withTheme } from 'emotion-theming';

import DateContainer from '../../styles/DateContainer';
import Title from '../../styles/Title';
import Flex from '../../styles/Flex';
import CancelSvg from '../shared/CancelSvg';
import { connect } from '../../utils';

class DatePicker extends Component {
	constructor(props) {
		super(props);

		const currentDate = props.selectedValue || props.value || props.defaultValue || '';
		this.state = {
			currentDate,
		};
		this.locked = false;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);
		this.setReact(props);
		const hasMounted = false;

		if (currentDate) {
			this.handleDateChange(currentDate, true, props, hasMounted);
		}
	}

	componentDidUpdate(prevProps) {
		checkPropChange(this.props.react, prevProps.react, () => this.setReact(this.props));
		checkPropChange(this.props.dataField, prevProps.dataField, () =>
			this.updateQuery(
				this.state.currentDate ? this.formatInputDate(this.state.currentDate) : null,
				this.props,
			),
		);

		if (!isEqual(this.props.value, prevProps.value)) {
			this.handleDateChange(this.props.value, true, this.props);
		} else if (
			!isEqual(this.formatInputDate(this.state.currentDate), this.props.selectedValue)
			&& !isEqual(this.props.selectedValue, prevProps.selectedValue)
		) {
			this.handleDateChange(this.props.selectedValue || '', true, this.props);
		}
	}

	componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	}

	setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	}

	formatInputDate = date => new XDate(date).toString('yyyy-MM-dd');

	static defaultQuery = (value, props) => {
		let query = null;
		if (value && props.queryFormat) {
			query = {
				range: {
					[props.dataField]: {
						gte: formatDate(new XDate(value).addHours(-24), props),
						lte: formatDate(new XDate(value), props),
					},
				},
			};
		}
		return query;
	};

	clearDayPicker = () => {
		if (this.state.currentDate !== '') {
			this.handleDateChange(''); // resets the day picker component
		}
	};

	handleDayPicker = (date) => {
		const { value, onChange } = this.props;
		if (value) {
			if (onChange) onChange(date || '');
		} else {
			this.handleDateChange(date || '');
		}
	};

	handleDateChange = (
		currentDate,
		isDefaultValue = false,
		props = this.props,
		hasMounted = true,
	) => {
		// currentDate should be valid or empty string for resetting the query
		if (isDefaultValue && !new XDate(currentDate).valid() && currentDate.length) {
			console.error(`DatePicker: ${props.componentId} invalid value passed for date`);
		} else {
			// ignore state updates when component is locked
			if (props.beforeValueChange && this.locked) {
				return;
			}

			this.locked = true;
			let value = null;
			if (currentDate) {
				value = isDefaultValue ? currentDate : this.formatInputDate(currentDate);
			}

			const performUpdate = () => {
				const handleUpdates = () => {
					this.updateQuery(value, props);
					this.locked = false;
					if (props.onValueChange) props.onValueChange(value);
				};

				if (hasMounted) {
					this.setState(
						{
							currentDate,
						},
						handleUpdates,
					);
				} else {
					handleUpdates();
				}
			};
			checkValueChange(props.componentId, value, props.beforeValueChange, performUpdate);
		}
	};

	updateQuery = (value, props) => {
		const { customQuery } = props;
		let query = DatePicker.defaultQuery(value, props);
		let customQueryOptions;
		if (customQuery) {
			({ query } = customQuery(value, props));
			customQueryOptions = getOptionsFromQuery(customQuery(value, props));
		}
		props.setQueryOptions(props.componentId, customQueryOptions);
		props.updateQuery({
			componentId: props.componentId,
			query,
			value,
			showFilter: props.showFilter,
			label: props.filterLabel,
			URLParams: props.URLParams,
			componentType: 'DATEPICKER',
		});
	};

	render() {
		return (
			<DateContainer
				showBorder={!this.props.showClear}
				style={this.props.style}
				className={this.props.className}
			>
				{this.props.title && (
					<Title className={getClassName(this.props.innerClass, 'title') || null}>
						{this.props.title}
					</Title>
				)}
				<Flex
					showBorder={this.props.showClear}
					iconPosition="right"
					style={{
						background: this.props.theme.colors.backgroundColor || 'transparent',
					}}
				>
					<DayPickerInput
						showOverlay={this.props.focused}
						formatDate={this.formatInputDate}
						value={this.state.currentDate}
						placeholder={this.props.placeholder}
						dayPickerProps={{
							numberOfMonths: this.props.numberOfMonths,
							initialMonth: this.props.initialMonth,
						}}
						clickUnselectsDay={this.props.clickUnselectsDay}
						onDayChange={this.handleDayPicker}
						inputProps={{
							readOnly: true,
						}}
						classNames={{
							container:
								getClassName(this.props.innerClass, 'daypicker-container')
								|| 'DayPickerInput',
							overlayWrapper:
								getClassName(this.props.innerClass, 'daypicker-overlay-wrapper')
								|| 'DayPickerInput-OverlayWrapper',
							overlay:
								getClassName(this.props.innerClass, 'daypicker-overlay')
								|| 'DayPickerInput-Overlay',
						}}
						{...this.props.dayPickerInputProps}
					/>
					{this.props.showClear && this.state.currentDate && (
						<CancelSvg onClick={this.clearDayPicker} />
					)}
				</Flex>
			</DateContainer>
		);
	}
}

DatePicker.propTypes = {
	addComponent: types.funcRequired,
	removeComponent: types.funcRequired,
	setQueryListener: types.funcRequired,
	updateQuery: types.funcRequired,
	watchComponent: types.funcRequired,
	selectedValue: types.selectedValue,
	setQueryOptions: types.funcRequired,
	// component props
	className: types.string,
	clickUnselectsDay: types.bool,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	dayPickerInputProps: types.props,
	defaultValue: types.date,
	value: types.date,
	filterLabel: types.string,
	focused: types.bool,
	initialMonth: types.dateObject,
	innerClass: types.style,
	numberOfMonths: types.number,
	onQueryChange: types.func,
	onValueChange: types.func,
	onChange: types.func,
	placeholder: types.string,
	queryFormat: types.queryFormatDate,
	react: types.react,
	showClear: types.bool,
	showFilter: types.bool,
	style: types.style,
	theme: types.style,
	title: types.string,
};

DatePicker.defaultProps = {
	clickUnselectsDay: true,
	numberOfMonths: 1,
	placeholder: 'Select Date',
	showClear: true,
	showFilter: true,
};

const mapStateToProps = (state, props) => ({
	selectedValue: state.selectedValues[props.componentId]
		? state.selectedValues[props.componentId].value
		: null,
});

const mapDispatchtoProps = dispatch => ({
	addComponent: component => dispatch(addComponent(component)),
	removeComponent: component => dispatch(removeComponent(component)),
	updateQuery: updateQueryObject => dispatch(updateQuery(updateQueryObject)),
	watchComponent: (component, react) => dispatch(watchComponent(component, react)),
	setQueryListener: (component, onQueryChange, beforeQueryChange) =>
		dispatch(setQueryListener(component, onQueryChange, beforeQueryChange)),
	setQueryOptions: (component, props) => dispatch(setQueryOptions(component, props)),
});

const ConnectedComponent = connect(
	mapStateToProps,
	mapDispatchtoProps,
)(withTheme(props => <DatePicker ref={props.myForwardedRef} {...props} />));


// eslint-disable-next-line
const ForwardRefComponent = React.forwardRef((props, ref) => (
	<ConnectedComponent {...props} myForwardedRef={ref} />
));
hoistNonReactStatics(ForwardRefComponent, DatePicker);

export default ForwardRefComponent;
