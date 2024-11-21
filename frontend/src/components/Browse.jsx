/* eslint-disable react-hooks/exhaustive-deps */
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Job from "./Job";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";

// const randomJobs = [1, 2,45];

const Browse = () => {
	useGetAllJobs();
	const { allJobs } = useSelector((store) => store.job);
	const dispatch = useDispatch();
	useEffect(() => {
		return () => {
			dispatch(setSearchedQuery(""));
		};
	}, []);
	return (
		<div>
			<Navbar />
			<div className="max-w-7xl mx-auto my-10">
				<h1 className="font-bold text-xl my-10">
					Search Results ({allJobs.length})
				</h1>
				{/* <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
					<div className="grid grid-cols-3 gap-4">
						{allJobs.map((job) => {
							return <Job key={job._id} job={job} />;
						})}
					</div>
				</div> */}

				<div className="flex-1 h-[88vh] overflow-y-auto pb-5">
					<div className="grid grid-cols-3 gap-4">
						{allJobs.map((job) => (
							<motion.div
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -100 }}
								transition={{ duration: 0.3 }}
								key={job?._id}
							>
								<Job job={job} />
							</motion.div>
						))}
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default Browse;
