import {
	Search as SearchIcon,
	AdminPanelSettings as AdminPanelSettingsIcon,
} from "@mui/icons-material";
import { Avatar, InputBase, styled } from "@mui/material";
import { useDeferredValue, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { searchResidents } from "@/services/user";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius * 5,
	backgroundColor: theme.palette.common.white,
	width: "100%",
	padding: theme.spacing(0.5, 1),
	display: "flex",
	alignItems: "center",
	boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 1),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	color: theme.palette.grey[500],
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: theme.palette.text.primary,
	width: "100%",
	"& .MuiInputBase-input": {
		padding: theme.spacing(0.8, 0.8, 0.8, 0),
		paddingLeft: `calc(1em + ${theme.spacing(2.5)})`,
		width: "100%",
		fontSize: "0.85rem",
	},
}));

const DropdownSearch = () => {
	const [query, setQuery] = useState("");
	const [isFocus, setIsFocus] = useState(false);
	const q = useDeferredValue(query);

	const { data, isLoading } = useQuery({
		queryKey: ["searchResidents", q],
		queryFn: () => searchResidents(q),
		enabled: q.trim().length > 1, // avoid searching on empty or short input
		staleTime: 1000 * 10, // 10s cache
	});

	return (
		<div className="relative flex-1 order-3 min-w-80 max-w-[calc(480px)]">
			<Search>
				<SearchIconWrapper>
					<SearchIcon fontSize="small" />
				</SearchIconWrapper>

				<StyledInputBase
					placeholder="Tìm SĐT chuyển tiền…"
					inputProps={{ "aria-label": "search" }}
					value={query}
					onFocus={() => setIsFocus(true)}
					onBlur={() => setTimeout(() => setIsFocus(false), 200)}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</Search>

			<AnimatePresence>
				{isFocus && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 10 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute border h-60 p-4 overflow-y-scroll text-black top-full left-0 w-full bg-white rounded-2xl space-y-2 shadow-md"
					>
						<div className="flex items-center gap-3">
							<SearchIcon />
							<div className="text-sm line-clamp-1">
								Tìm kiếm: "
								<span className="font-bold">{q}</span>"
							</div>
						</div>

						{isLoading && (
							<div className="text-sm line-clamp-1">
								Đang tải dữ liệu…
							</div>
						)}

						{data &&
							data.map((item) => (
								<button
									key={item.id}
									className="text-sm block w-full transition hover:bg-green-500 rounded-md hover:text-white p-2 line-clamp-1"
								>
									{item.fullName} ({item.phone})
								</button>
							))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DropdownSearch;
