import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

type Props = {
    tooltipText: string;
} & (
    | {
          onClick: () => void;
          type: "button";
      }
    | {
          href: string;
          type: "link";
      }
);

export default function FloatingCreateButton(props: Readonly<Props>) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {props.type === "button" ? (
                    <Button
                        className="rounded-full p-0 w-10 h-10 flex items-center justify-center fixed bottom-2 right-2"
                        onClick={props.onClick}
                    >
                        <Plus className="text-foreground size-5" />
                    </Button>
                ) : (
                    <Button
                        className="rounded-full p-0 w-10 h-10 flex items-center justify-center fixed bottom-2 right-2"
                        asChild
                    >
                        <Link href={props.href}>
                            <Plus className="text-foreground size-5" />
                        </Link>
                    </Button>
                )}
            </TooltipTrigger>
            <TooltipContent>
                <p>{props.tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}
