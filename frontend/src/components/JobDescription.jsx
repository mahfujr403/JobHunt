import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const JobDescription = () => {
	const { singleJob } = useSelector((store) => store.job);
	const { user } = useSelector((store) => store.auth);
	const isIntiallyApplied =
		singleJob?.applications?.some(
			(application) => application.applicant === user?._id
		) || false;
	const [isApplied, setIsApplied] = useState(isIntiallyApplied);

	const params = useParams();
	const jobId = params.id;
	const dispatch = useDispatch();

	const applyJobHandler = async () => {
		console.log("apply job handler");
		console.log(singleJob.experienceLevel);
		try {
			const res = await axios.get(
				`${APPLICATION_API_END_POINT}/apply/${jobId}`,
				{ withCredentials: true }
			);

			if (res.data.success) {
				setIsApplied(true); // Update the local state
				const updatedSingleJob = {
					...singleJob,
					applications: [...singleJob.applications, { applicant: user?._id }],
				};
				dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	useEffect(() => {
		const fetchSingleJob = async () => {
			try {
				const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
					withCredentials: true,
				});
				if (res.data.success) {
					dispatch(setSingleJob(res.data.job));
					setIsApplied(
						res.data.job.applications.some(
							(application) => application.applicant === user?._id
						)
					); // Ensure the state is in sync with fetched data
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchSingleJob();
	}, [jobId, dispatch, user?._id]);

	return (
		<>
			<Navbar />
			<div className="max-w-7xl mx-auto my-10">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-xl">{singleJob?.title}</h1>
						<div className="flex items-center gap-2 mt-4">
							<Badge className={"text-blue-700 font-bold"} variant="ghost">
								{singleJob?.applications?.length} Positions
							</Badge>
							<Badge className={"text-[#F83002] font-bold"} variant="ghost">
								{singleJob?.jobType}
							</Badge>
							<Badge className={"text-[#7209b7] font-bold"} variant="ghost">
								{singleJob?.salary} LPA
							</Badge>
						</div>
					</div>
					<Button
						onClick={isApplied ? null : applyJobHandler}
						disabled={isApplied}
						className={`rounded-lg ${
							isApplied
								? "bg-gray-600 cursor-not-allowed"
								: "bg-[#7209b7] hover:bg-[#5f32ad]"
						}`}
					>
						{isApplied ? "Already Applied" : "Apply Now"}
					</Button>
				</div>
				<h1 className="border-b-2 border-b-gray-300 text-xl text-center font-bold text-gray-700 py-4">
					Job Description
				</h1>
				<div className="my-6">
					<table className="table-auto w-full border-collapse">
						<thead>
							<tr className="bg-gray-100">
								<th className="px-4 py-2 font-semibold text-gray-600 w-1/4 text-center">
									Attribute
								</th>
								<th className="px-4 py-2 font-semibold text-gray-600 w-3/4 text-center">
									Details
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 text-left">
									Post Name
								</td>
								<td className="px-4 py-2 text-gray-800 ">{singleJob?.title}</td>
							</tr>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 ">
									Location
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.location}
								</td>
							</tr>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 ">
									Job Description
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.description}
								</td>
							</tr>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 ">
									Experience
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.experienceLevel} yrs
								</td>
							</tr>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 ">
									Salary
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.salary} BDT/year
								</td>
							</tr>
							<tr className="border-t border-b">
								<td className="px-10 py-2 font-medium text-gray-700 ">
									Total Applicants
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.applications?.length}
								</td>
							</tr>
							<tr className="border-t">
								<td className="px-10 py-2 font-medium text-gray-700">
									Posted Date
								</td>
								<td className="px-4 py-2 text-gray-800">
									{singleJob?.createdAt.split("T")[0]}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default JobDescription;
