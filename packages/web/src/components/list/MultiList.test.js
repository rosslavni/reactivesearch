import React from 'react';
import renderer from 'react-test-renderer';
import MultiList from './MultiList';
import ReactiveBase from '../basic/ReactiveBase';

it('should render no results message', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render list of authors', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						'authors.keyword': {
							buckets: [
								{
									key: 'J. K. Rowling',
									doc_count: 10,
								},
								{
									key: 'Nora Roberts',
									doc_count: 7,
								},
							],
						},
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should render search/count/checkbox when showSearch/showCount/showCheckbox are true', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					showSearch
					showCount
					showCheckbox
					renderNoResults={() => 'No authors found'}
					mockData={{
						'authors.keyword': {
							buckets: [
								{
									key: 'J. K. Rowling',
									doc_count: 10,
								},
								{
									key: 'Nora Roberts',
									doc_count: 7,
								},
							],
						},
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should not render search/count/checkbox when showSearch/showCount/showCheckbox are false', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					showSearch={false}
					showCount={false}
					showCheckbox={false}
					renderNoResults={() => 'No authors found'}
					mockData={{
						'authors.keyword': {
							buckets: [
								{
									key: 'J. K. Rowling',
									doc_count: 10,
								},
								{
									key: 'Nora Roberts',
									doc_count: 7,
								},
							],
						},
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use renderItem to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					defaultValue={['J. K. Rowling']}
					renderItem={(key, docCount, isChecked) =>
						(isChecked ? (
							<div className="checked">
								{key} - {docCount}
							</div>
						) : (
							<div>
								{key} - {docCount}
							</div>
						))
					}
					mockData={{
						'authors.keyword': {
							buckets: [
								{
									key: 'J. K. Rowling',
									doc_count: 10,
								},
								{
									key: 'Nora Roberts',
									doc_count: 7,
								},
							],
						},
					}}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});

it('should use render prop to render the list item', () => {
	const elem = renderer
		.create(
			<ReactiveBase app="test" url="https://foo:bar@localhost:800">
				<MultiList
					mode="test"
					componentId="authors"
					dataField="authors.keyword"
					renderNoResults={() => 'No authors found'}
					mockData={{
						'authors.keyword': {
							buckets: [
								{
									key: 'J. K. Rowling',
									doc_count: 10,
								},
								{
									key: 'Nora Roberts',
									doc_count: 7,
								},
							],
						},
					}}
					render={({ data = [] }) => (
						<ul>
							{data.map(list => (
								<li key={list.key}>
									{list.key} {list.count}
								</li>
							))}
						</ul>
					)}
				/>
			</ReactiveBase>,
		)
		.toJSON();
	expect(elem).toMatchSnapshot();
});
