/* eslint-disable react-hooks/exhaustive-deps */
import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminJobs = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		const fetchAllAdminJobs = async () => {
			try {
				const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
					withCredentials: true,
				});
				if (res.data.success) {
					dispatch(setAllAdminJobs(res.data.jobs));
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchAllAdminJobs();
	}, []);
};

// export default useGetAllAdminJobs

// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setAllAdminJobs } from "../redux/jobSlice";
// import { JOB_API_END_POINT } from "../utils/constant";

// const useGetAllAdminJobs = () => {
// 	const dispatch = useDispatch();

// 	const fetchAllAdminJobs = async () => {
// 		try {
// 			const { data } = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
// 				withCredentials: true,
// 			});
// 			if (data.success) {
// 				dispatch(setAllAdminJobs(data.jobs));
// 			}
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchAllAdminJobs();
// 	}, []);
// };

export default useGetAllAdminJobs;
