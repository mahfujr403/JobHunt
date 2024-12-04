/* eslint-disable react/prop-types */
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UpdateProfileDialog = ({ open, setOpen }) => {
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((store) => store.auth);

	const [input, setInput] = useState({
		fullname: user?.fullname || "",
		email: user?.email || "",
		phoneNumber: user?.phoneNumber || "",
		bio: user?.profile?.bio || "",
		skills: user?.profile?.skills?.join(", ") || "",
		profilePicture: null,
		resume: null,
	});

	const dispatch = useDispatch();

	const changeEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const fileChangeHandler = (e) => {
		const { name, files } = e.target;
		setInput({ ...input, [name]: files[0] });
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("fullname", input.fullname);
		formData.append("email", input.email);
		formData.append("phoneNumber", input.phoneNumber);
		formData.append("bio", input.bio);
		formData.append("skills", input.skills);
		if (input.profilePicture)
			formData.append("profilePicture", input.profilePicture);
		if (input.resume) formData.append("resume", input.resume);

		try {
			setLoading(true);
			const res = await axios.post(
				`${USER_API_END_POINT}/profile/update`,
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
					withCredentials: true,
				}
			);

			if (res.data.success) {
				dispatch(setUser(res.data.user));
				toast.success(res.data.message);
				setOpen(false);
			} else {
				toast.error(res.data.message || "Failed to update profile");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Internal server error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open}>
			<DialogContent
				className="sm:max-w-[425px]"
				onInteractOutside={() => setOpen(false)}
				aria-describedby="update-profile-description"
			>
				<DialogHeader>
					<DialogTitle>Update Profile</DialogTitle>
					<p id="update-profile-description" className="text-sm text-gray-500">
						Update your profile information, including your profile picture and
						resume.
					</p>
				</DialogHeader>
				<form onSubmit={submitHandler}>
					<div className="grid gap-4 py-4">
						<div>
							<Label>Profile Picture</Label>
							<Input
								type="file"
								name="profilePicture"
								accept="image/*"
								onChange={fileChangeHandler}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="fullname" className="text-right">
								Name
							</Label>
							<Input
								id="fullname"
								name="fullname"
								type="text"
								value={input.fullname}
								onChange={changeEventHandler}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={input.email}
								onChange={changeEventHandler}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="phoneNumber" className="text-right">
								Phone Number
							</Label>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								value={input.phoneNumber}
								onChange={changeEventHandler}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="bio" className="text-right">
								Bio
							</Label>
							<Input
								id="bio"
								name="bio"
								value={input.bio}
								onChange={changeEventHandler}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="skills" className="text-right">
								Skills
							</Label>
							<Input
								id="skills"
								name="skills"
								value={input.skills}
								onChange={changeEventHandler}
								className="col-span-3"
							/>
						</div>
						<div>
							<Label>Resume</Label>
							<Input
								type="file"
								name="resume"
								accept="application/pdf"
								onChange={fileChangeHandler}
							/>
						</div>
					</div>
					<DialogFooter>
						{loading ? (
							<Button className="w-full my-4">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button type="submit" className="w-full my-4">
								Update
							</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProfileDialog;
