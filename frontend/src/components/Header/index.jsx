"use client";

import useUserStore from "@/store/userStore";
import DropdownSearch from "./DropdownSearch";
import Actions from "./Actions";

const Header = () => {
	const { user } = useUserStore();
	const names = user.fullName.split(" ");
	const lastName = names[names.length - 1];

	return (
		<div className="h-24 md:h-16 sticky top-0 left-0 w-full flex items-center justify-between px-4 bg-linear-to-r text-white from-green-500 to-teal-600 z-20 flex-wrap">
			<div className="text-xl shrink-0 font-bold">
				Xin chào, <span className="font-black">{lastName} 👋</span>
			</div>

			<DropdownSearch />

			<Actions />
		</div>
	);
};

export default Header;
