import { AnimatePresence, motion } from 'motion/react'
import { FC, ReactNode } from 'react'

interface ModalProps {
	children: ReactNode
	isOpen: boolean
	onOpenChange: () => void
}

const Modal: FC<ModalProps> = ({ isOpen, onOpenChange, children }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					onClick={onOpenChange}
					initial={{ opacity: 0 }}
					animate={{
						opacity: 1,
					}}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-[9999]'>
					<div className='absolute inset-0 bg-[rgba(0,0,0,.7)]'></div>

					<motion.div
						onClick={(e) => e.stopPropagation()}
						initial={{
							opacity: 0,
							translateY: 100,
						}}
						animate={{
							opacity: 1,
							translateY: 0,
						}}
						exit={{
							opacity: 0,
							translateY: 100,
						}}
						className='absolute left-0 bottom-0 h-[70vh] md:h-[360px] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-4 z-20 md:max-w-md w-full rounded-t-2xl md:rounded-2xl shadow-2xl overflow-y-scroll space-y-4 text-left'>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
