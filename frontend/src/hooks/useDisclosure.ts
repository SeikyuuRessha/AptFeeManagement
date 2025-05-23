import { useState } from "react";

const useDisclosure = () => {
	const [isOpen, setIsOpen] = useState(false);
	const onOpen = () => setIsOpen(true);
	const onOpenChange = () => setIsOpen((prev) => !prev);

	return { isOpen, onOpen, onOpenChange };
};

export { useDisclosure };
