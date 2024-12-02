/* eslint-disable react/jsx-key */
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const AdminJobsTable = () => {
	const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

	const [filterJobs, setFilterJobs] = useState(allAdminJobs);
	const navigate = useNavigate();

	useEffect(() => {
		("called");
		const filteredJobs = allAdminJobs.filter((job) => {
			if (!searchJobByText) {
				return true;
			}
			return (
				job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
				job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
			);
		});
		setFilterJobs(filteredJobs);
	}, [allAdminJobs, searchJobByText]);
	return (
		<div>
			<h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight ">
				Jobs
			</h1>
			<Table>
				<TableCaption>A list of your recent posted jobs</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Role</TableHead>
						<TableHead>Company Name</TableHead>
						<TableHead>Date</TableHead>
						<TableHead className="text-right">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filterJobs?.map((job) => (
						<tr>
							<TableCell className="font-bold">{job?.title}</TableCell>
							<TableCell className="text-gray">{job?.company?.name}</TableCell>
							<TableCell>{job?.createdAt.split("T")[0]}</TableCell>
							<TableCell className="text-right cursor-pointer">
								<Popover>
									<PopoverTrigger>
										<MoreHorizontal />
									</PopoverTrigger>
									<PopoverContent className="w-32">
										<div
											onClick={() => navigate(`/admin/jobs/${job._id}`)}
											className="flex items-center gap-2 w-fit cursor-pointer"
										>
											<Edit2 className="w-4" />
											<span>Edit</span>
										</div>
										<div
											onClick={() =>
												navigate(`/admin/jobs/${job._id}/applicants`)
											}
											className="flex items-center w-fit gap-2 cursor-pointer mt-2"
										>
											<Eye className="w-4" />
											<span>Applicants</span>
										</div>
									</PopoverContent>
								</Popover>
							</TableCell>
						</tr>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default AdminJobsTable;
