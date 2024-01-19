import {Button, Menu, MenuItem, InputGroup, Classes} from "@blueprintjs/core";
import {Select2, ItemRenderer} from "@blueprintjs/select";
import React from "react";
import {useDebouncedCallback} from "use-debounce";

// @ts-ignore
import hyper from "@macrostrat/hyper";

import {OperatorQueryParameter, ColumnOperatorOption} from "./table";

import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/select/lib/css/blueprint-select.css";
import styles from "./edit-table.module.sass";
import {Filter} from "./table-util";


const h = hyper.styled(styles);


const validExpressions: ColumnOperatorOption[] = [
	{key: "na", value: "", verbose: "None"},
	{key: "eq", value: "=", verbose: "Equals"},
	{key: "lt", value: "<", verbose: "Is less than"},
	{key: "le", value: "<=", verbose: "Is less than or equal to"},
	{key: "gt", value: ">", verbose: "Is greater than"},
	{key: "ge", value: ">=", verbose: "Is greater than or equal to"},
	{key: "ne", value: "<>", verbose: "Is not equal to"},
	{key: "like", value: "LIKE", verbose: "Like"},
	{key: "is", value: "IS", verbose: "Is", placeholder: "true | false | null"},
	{key: "in", value: "IN", verbose: "In", placeholder: "1,2,3"}
]

interface TableMenuProps {
	columnName: string;
	onFilterChange: (query: OperatorQueryParameter) => void;
	filter: Filter;
	onGroupChange: (group: string | undefined) => void;
	group: string | undefined;
}

const TableMenu = ({columnName, onFilterChange, filter, onGroupChange, group} : TableMenuProps) => {

	const [inputPlaceholder, setInputPlaceholder] = React.useState<string>("");

	// Create a debounced version of the text state
	const [inputValue, setInputValue] = React.useState<string>(filter.value);
	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onFilterChange({operator: filter.operator, value: e.target.value})
	}
	const debouncedInputChange = useDebouncedCallback(onInputChange, 1000);

	// Set the expression current value from the parent filter
	const selectedExpression = validExpressions.find((expression) => expression.key === filter.operator);

	// Set if this group is active
	const groupActive: boolean = group === columnName;


	return h(Menu, {}, [
		h("div.filter-container", {}, [
			h("div.filter-header", {}, ["Filter"]),
			h("div.filter-select", {}, [
				h("select", {
					style: {
						padding: "6px",
						border: "#d7d8d9 1px solid",
						borderBottom: "none",
						borderRadius: "2px 2px 0 0",
					},
					onChange: (e) => {
						if (e.target.value === "na") {
							onFilterChange({operator: undefined, value: filter.value})
						} else {
							onFilterChange({operator: e.target.value, value: filter.value})
						}
					}
				}, [
					...validExpressions.map((expression) => {
						return h("option", {value: expression.key, selected: expression.key === filter.operator}, [expression.verbose])
					})
				]),
				h("div.filter-input", {}, [
					h(InputGroup, {
						"value": inputValue,
						className: "update-input-group",
						placeholder: inputPlaceholder,
						onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
							setInputValue(e.target.value);
							debouncedInputChange(e)
						}
					}, [])
				])
			]),
			h("div.filter-header", {}, ["Group"]),
			h("div.filter-select", {}, [
				h(Button,
					{
						rightIcon: groupActive ? "tick" : "disable",
						alignText: "left",
						intent: groupActive ? "success" : "warning",
						text: groupActive ? "Active" : "Inactive",
						fill: true,
						onClick: () => {
							onGroupChange(group == filter.column_name ? undefined : filter.column_name)
						}
					}, [])
			]),
		])
	])
}

export default TableMenu;