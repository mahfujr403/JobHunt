/* eslint-disable react-hooks/exhaustive-deps */
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AdminJobsTable from "./AdminJobsTable";

const AdminJobs = () => {
	useGetAllAdminJobs();
	const [input, setInput] = useState("");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setSearchJobByText(input));
	}, [input]);
	return (
		<div>
			<Navbar />
			<div className="max-w-6xl mx-auto my-10">
				<div className="flex items-center justify-between my-5">
					<Input
						className="w-fit"
						placeholder="Filter by name, role"
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button onClick={() => navigate("/admin/jobs/create")}>
						New Jobs
					</Button>
				</div>
				<h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800 leading-tight ">
					Jobs
				</h1>
				<AdminJobsTable />
			</div>
		</div>
	);
};

export default AdminJobs;
