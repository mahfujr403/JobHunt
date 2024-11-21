import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LatestJobCards from "./LatestJobCards";

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
	const { allJobs } = useSelector((store) => store.job);

	return (
		<div className="max-w-7xl mx-auto my-20">
			<h1 className="text-4xl font-bold">
				<span className="text-[#6A38C2]">Latest & Top </span> Job Openings
			</h1>
			<div className="flex-1 h-[88vh] overflow-y-auto pb-5">
				<div className="grid grid-cols-3 gap-4 my-5">
					{allJobs.length <= 0 ? (
						<span>No Job Available</span>
					) : (
						allJobs?.slice(0, 6).map((job) => (
							<motion.div
								initial={{ opacity: 0, x: 100 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -100 }}
								transition={{ duration: 0.3 }}
								key={job?._id}
							>
								<LatestJobCards key={job._id} job={job} />
							</motion.div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default LatestJobs;
