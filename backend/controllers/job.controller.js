import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
	try {
		const {
			title,
			description,
			requirements,
			salary,
			location,
			jobType,
			experience,
			position,
			companyId,
		} = req.body;
		const userId = req.id;

		if (
			!title ||
			!description ||
			!requirements ||
			!salary ||
			!location ||
			!jobType ||
			!experience ||
			!position ||
			!companyId
		) {
			return res.status(400).json({
				message: "Somethin is missing.",
				success: false,
			});
		}
		const job = await Job.create({
			title,
			description,
			requirements: requirements.split(","),
			salary: Number(salary),
			location,
			jobType,
			experienceLevel: experience,
			position,
			company: companyId,
			created_by: userId,
		});
		return res.status(201).json({
			message: "New job created successfully.",
			job,
			success: true,
		});
	} catch (error) {
		 (error);
	}
};
// student k liye
export const getAllJobs = async (req, res) => {
	    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        };
        const jobs = await Job.find(query)
			.populate({
				path: "company",
			})
			.sort({ createdAt: -1 });
		if (!jobs) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}
		return res.status(200).json({
			jobs,
			success: true,
		});
	} catch (error) {
		 (error);
	}
};
// student
export const getJobById = async (req, res) => {
	try {
		const jobId = req.params.id;
		const job = await Job.findById(jobId).populate({
			path: "applications",
		});
		if (!job) {
			return res.status(404).json({
				message: "Jobs not found.",
				success: false,
			});
		}
		return res.status(200).json({ job, success: true });
	} catch (error) {
		 (error);
	}
};
// admin kitne job create kra hai abhi tk
// export const getAdminJobs = async (req, res) => {
//     try {
//         const jobs = await Job.find()
//             .populate('company')
//             .sort({ createdAt: -1 });
        
//         return res.status(200).json({
//             success: true,
//             jobs
//         });
//     } catch (error) {
//          (error);
//         return res.status(500).json({
//             message: "Error while fetching admin jobs",
//             success: false
//         });
//     }
// };
export const getAdminJobs = async (req, res) => {
	try {
		const jobs = await Job.find({ created_by: req.id }) // Filter by logged-in user's ID
			.populate("company")
			.sort({ createdAt: -1 });

		return res.status(200).json({
			success: true,
			jobs,
		});
	} catch (error) {
		 (error);
		return res.status(500).json({
			message: "Error while fetching admin jobs",
			success: false,
		});
	}
};




export const updateJob = async (req, res) => {
	try {
		const jobId = req.params.id;
		const {
			title,
			description,
			requirements,
			salary,
			location,
			jobType,
			experience,
			position,
			companyId,
		} = req.body;
		const userId = req.id;
		const job = await Job.findById(jobId);
		if (!job) {
			return res.status(404).json({
				message: "Job not found.",
				success: false,
			});
		}
		if (job.created_by.toString() !== userId) {
			return res.status(401).json({
				message: "You are not authorized to update this job.",
				success: false,
			});
		}
		const updatedJob = await Job.findByIdAndUpdate(jobId, {
			title,
			description,
			requirements: requirements.split(","),
			salary,
			location,
			jobType,
			experienceLevel: experience,
			position,
			company: companyId,
			created_by: userId,
			new: true,
		});
		return res.status(200).json({
			message: "Job updated successfully.",
			updatedJob,
			success: true,
		});
	} catch (error) {
		 (error);
	}
};
