/* eslint-disable react-hooks/exhaustive-deps */
import useGetJobById from "@/hooks/useGetJobById";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const JobSetup = () => {
	const params = useParams();
	useGetJobById(params.id);
	const [input, setInput] = useState({
		title: "",
		description: "",
		location: "",
		position: "",
		jobType: "",
		salary: "",
		company: "",
	});

	const { singleJob } = useSelector((store) => store.job);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const changeEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", input.title);
		formData.append("description", input.description);
		formData.append("location", input.location);
		formData.append("position", input.position);
		formData.append("jobType", input.jobType);
		formData.append("salary", input.salary);
		formData.append("company", input.company);

		try {
			setLoading(true);
			const res = await axios.put(
				`${JOB_API_END_POINT}/update/${params.id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					withCredentials: true,
				}
			);
			if (res.data.success) {
				toast.success(res.data.message);
				navigate("/admin/jobs");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setInput({
			title: singleJob.title,
			description: singleJob.description,
			location: singleJob.location,
			position: singleJob.position,
			jobType: singleJob.jobType,
			salary: singleJob.salary,
			company: singleJob.company,
		});
	}, [singleJob]);

	return (
		<div>
			<Navbar />
			<div className="max-w-xl mx-auto my-10">
				<form onSubmit={submitHandler}>
					<div className="flex items-center gap-5 p-8">
						<Button
							onClick={() => navigate("/admin/companies")}
							variant="outline"
							className="flex items-center gap-2 text-gray-500 font-semibold"
						>
							<ArrowLeft />
							<span>Back</span>
						</Button>
						<h1 className="font-bold text-xl">Job Setup</h1>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label>Job Title</Label>
							<Input
								jobType="text"
								name="title"
								value={input.title}
								onChange={changeEventHandler}
							/>
						</div>
					</div>
					<div>
						<Label>Description</Label>
						<textarea
							name="description"
							value={input.description}
							onChange={changeEventHandler}
							className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
							rows="6" // Adjust the height by changing the rows attribute
						/>
					</div>

					<div>
						<Label>Location</Label>
						<Input
							type="text"
							name="location"
							value={input.location}
							onChange={changeEventHandler}
						/>
					</div>

					<div>
						<Label>Position</Label>
						<Input
							type="number"
							name="position"
							value={input.position}
							onChange={changeEventHandler}
						/>
					</div>

					<div>
						<Label>job Type</Label>
						<Input
							type="text"
							name="jobType"
							value={input.jobType}
							onChange={changeEventHandler}
						/>
					</div>

					<div>
						<Label>Salary</Label>
						<Input
							type="number"
							name="salary"
							value={input.salary}
							onChange={changeEventHandler}
						/>
					</div>
					{loading ? (
						<Button className="w-full my-4">
							{" "}
							<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
						</Button>
					) : (
						<Button type="submit" className="w-full my-4">
							Update
						</Button>
					)}
				</form>
			</div>
		</div>
	);
};

export default JobSetup;
