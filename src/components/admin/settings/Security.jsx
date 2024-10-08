import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";

const Security = () => {
	const [twoFactor, setTwoFactor] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPasswordData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleChangePassword = () => {
		// Logic để đổi mật khẩu
		if (passwordData.newPassword !== passwordData.confirmNewPassword) {
			alert("New passwords do not match!");
			return;
		}
		console.log("Password changed:", passwordData);
		// Reset form sau khi đổi mật khẩu
		setPasswordData({
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		});
		setIsChangingPassword(false); // Ẩn form đổi mật khẩu sau khi hoàn tất
	};

	return (
		<SettingSection icon={Lock} title={"Security"}>
			<ToggleSwitch
				label={"Two-Factor Authentication"}
				isOn={twoFactor}
				onToggle={() => setTwoFactor(!twoFactor)}
			/>
			<div className="mt-4">
				{/* Nút hiện form đổi mật khẩu */}
				{!isChangingPassword ? (
					<button
						className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
						onClick={() => setIsChangingPassword(true)}
					>
						Change Password
					</button>
				) : (
					// Form đổi mật khẩu
					<div className="bg-gray-700 p-4 rounded-lg mt-4">
						<div className="mb-4">
							<label className="text-gray-400">Old Password:</label>
							<input
								type="password"
								name="oldPassword"
								value={passwordData.oldPassword}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-600 text-white rounded-lg"
							/>
						</div>

						<div className="mb-4">
							<label className="text-gray-400">New Password:</label>
							<input
								type="password"
								name="newPassword"
								value={passwordData.newPassword}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-600 text-white rounded-lg"
							/>
						</div>

						<div className="mb-4">
							<label className="text-gray-400">Confirm New Password:</label>
							<input
								type="password"
								name="confirmNewPassword"
								value={passwordData.confirmNewPassword}
								onChange={handleInputChange}
								className="w-full p-2 bg-gray-600 text-white rounded-lg"
							/>
						</div>

						<div className="flex justify-end">
							<button
								className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
								onClick={handleChangePassword}
							>
								Change Password
							</button>
							<button
								className="bg-gray-500 text-white px-4 py-2 rounded-lg"
								onClick={() => setIsChangingPassword(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</SettingSection>
	);
};

export default Security;
