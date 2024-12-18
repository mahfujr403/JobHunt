/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import { setSearchedQuery } from "@/redux/jobSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const fitlerData = [
	{
		fitlerType: "Location",
		array: ["Dhaka", "Rajshahi", "Chattogram", "Sylhet", "Khulna"],
	},
	{
		fitlerType: "Industry",
		array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
	},
];

const FilterCard = () => {
	const [selectedValue, setSelectedValue] = useState("");
	const dispatch = useDispatch();
	const changeHandler = (value) => {
		setSelectedValue(value);
	};
	useEffect(() => {
		dispatch(setSearchedQuery(selectedValue));
	}, [selectedValue]);
	return (
		<div className="w-full bg-white p-2 rounded-md">
			<h1 className="font-bold text-lg">Filter Jobs</h1>
			<hr className="mt-3" />
			<RadioGroup value={selectedValue} onValueChange={changeHandler}>
				{fitlerData.map((data, index) => (
					<div>
						<h1 className="font-bold text-lg">{data.fitlerType}</h1>
						{data.array.map((item, idx) => {
							const itemId = `id${index}-${idx}`;
							return (
								<div className="flex items-center space-x-2 my-2">
									<RadioGroupItem value={item} id={itemId} />
									<Label htmlFor={itemId}>{item}</Label>
								</div>
							);
						})}
					</div>
				))}
			</RadioGroup>
		</div>
	);
};

export default FilterCard;
