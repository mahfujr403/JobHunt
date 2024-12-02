import { cn } from "@/lib/utils";
import * as React from "react";

const Textarea = React.forwardRef(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				"w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200",
				className
			)}
			ref={ref}
			{...props}
		/>
	);
});

Textarea.displayName = "Textarea";

export { Textarea };
