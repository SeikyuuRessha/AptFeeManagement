import clsx from "clsx";

interface SkeletonProps {
	className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => {
	return <div className={clsx("bg-gray-200 animate-pulse", className)}></div>;
};

export default Skeleton;
